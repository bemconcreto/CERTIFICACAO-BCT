import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { chargeId, email } = req.query;

  if (!chargeId || !email) {
    return res.status(400).json({ ok: false, error: "chargeId e email obrigatórios" });
  }

  const API_KEY = process.env.ASAAS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ ok: false, error: "API Key ausente" });
  }

  try {
    // 1️⃣ Consultar status do pagamento no Asaas
    const asaasRes = await fetch(
      `https://www.asaas.com/api/v3/payments/${chargeId}`,
      { headers: { access_token: API_KEY } }
    );

    const payment = await asaasRes.json();

    console.log("🔍 Status pagamento Asaas:", payment.id, payment.status);

    // 🔒 IDOR: chargeId e email chegam livres via query string — sem essa
    // checagem, qualquer pessoa que descobrisse (ou adivinhasse) um
    // chargeId de outra pessoa podia passar o PRÓPRIO email e marcar
    // `is_paid_certification=true` pra si mesma sem ter pago nada.
    // `externalReference` é o email (minúsculo) gravado na criação do
    // pagamento (ver pages/api/pagamento/criar.js) — só aceitamos a
    // confirmação se ele bater com o email recebido aqui.
    const referenciaExterna = (payment.externalReference || "").toLowerCase();
    const emailConsultado = email.toLowerCase();

    if (referenciaExterna !== emailConsultado) {
      console.warn(
        "⚠️ Tentativa de verificar pagamento com email divergente do externalReference:",
        { chargeId, emailConsultado, referenciaExterna }
      );
      return res.status(403).json({
        ok: false,
        error: "Este pagamento não pertence a este usuário",
      });
    }

    const isPaid = payment.status === "RECEIVED" || payment.status === "CONFIRMED";

    if (isPaid) {
      // 2️⃣ Se pago, atualizar o banco de dados imediatamente
      const { error } = await supabase
        .from("users")
        .update({
          is_paid_certification: true,
        })
        .eq("email", email.toLowerCase());

      if (error) {
        console.error("❌ Erro ao atualizar pagamento via polling:", error);
      } else {
        console.log("✅ Pagamento confirmado via polling para:", email);
      }
    }

    return res.json({
      ok: true,
      status: payment.status,
      isPaid,
    });
  } catch (err) {
    console.error("❌ Erro ao verificar pagamento:", err);
    return res.status(500).json({ ok: false, error: "Erro ao verificar pagamento" });
  }
}

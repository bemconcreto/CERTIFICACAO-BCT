import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ⚠️ Redundante com pages/api/webhook/asaas.js por segurança/compatibilidade
// (não dá pra confirmar pelo código qual URL está de fato cadastrada no
// painel Asaas como webhook oficial — melhor manter as duas protegidas do
// que arriscar que a "errada" fique sem a validação abaixo).
export default async function handler(req, res) {
  // 🔒 A validação do token do webhook agora é OBRIGATÓRIA. Antes, se
  // ASAAS_WEBHOOK_TOKEN não estivesse configurada na Vercel, o `if`
  // simplesmente pulava a checagem e QUALQUER POST sem token nenhum
  // creditava a certificação de qualquer email. Sem a env var configurada,
  // o endpoint agora recusa tudo (401) em vez de ficar aberto.
  const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;
  const receivedToken = req.headers["asaas-access-token"] || req.query.token;
  if (!webhookToken || receivedToken !== webhookToken) {
    return res.status(401).json({ ok: false });
  }

  try {
    const event = req.body;

    console.log("WEBHOOK RECEBIDO:", JSON.stringify(event));

    // Apenas pagamentos confirmados ou recebidos
    if (event.event !== "PAYMENT_CONFIRMED" && event.event !== "PAYMENT_RECEIVED") {
      return res.status(200).json({ ok: true });
    }

    const paymentId = event.payment?.id;

    if (!paymentId) {
      console.log("⚠️ Sem payment.id no evento");
      return res.status(200).json({ ok: true });
    }

    // 🔒 Nunca confiar cegamente no payload do webhook (pode ser forjado por
    // quem descobrir/adivinhar a URL) — reconsulta o pagamento direto na
    // API da Asaas pelo id e só credita se o status lá também confirmar
    // (mesmo padrão usado nos webhooks do APP-BCT).
    const API_KEY = process.env.ASAAS_API_KEY;
    if (!API_KEY) {
      console.error("❌ ASAAS_API_KEY ausente — não é possível confirmar pagamento");
      return res.status(200).json({ ok: true });
    }

    const asaasRes = await fetch(`https://www.asaas.com/api/v3/payments/${paymentId}`, {
      headers: { access_token: API_KEY },
    });
    const payment = await asaasRes.json();

    const statusConfirmado = payment.status === "RECEIVED" || payment.status === "CONFIRMED";

    if (!statusConfirmado) {
      console.log("⚠️ Status do pagamento na Asaas não confirma o webhook:", payment.status);
      return res.status(200).json({ ok: true });
    }

    // ⭐ externalReference = email do usuário — usa o valor confirmado
    // diretamente na API da Asaas, não o do payload do webhook.
    const email = payment.externalReference;

    if (!email) {
      console.log("⚠️ Sem externalReference no payment");
      return res.status(200).json({ ok: true });
    }

    // Atualizar no Supabase
    const { error } = await supabase
      .from("users")
      .update({
        is_paid_certification: true,
      })
      .eq("email", email.toLowerCase());

    if (error) {
      console.error("❌ Erro ao atualizar pagamento:", error);
    } else {
      console.log("✅ Pagamento confirmado para:", email);
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Erro Webhook:", err);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}
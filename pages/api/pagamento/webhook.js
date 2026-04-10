import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const event = req.body;

    console.log("WEBHOOK RECEBIDO:", JSON.stringify(event));

    // Apenas pagamentos confirmados ou recebidos
    if (event.event !== "PAYMENT_CONFIRMED" && event.event !== "PAYMENT_RECEIVED") {
      return res.status(200).json({ ok: true });
    }

    // ⭐ externalReference = email do usuário
    const email = event.payment?.externalReference;

    if (!email) {
      console.log("⚠️ Sem externalReference no payment");
      return res.status(200).json({ ok: true });
    }

    // Atualizar no Supabase
    const { error } = await supabase
      .from("users")
      .update({
        is_paid_certification: true,
        payment_date: new Date().toISOString(),
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
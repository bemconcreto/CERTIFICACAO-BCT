// pages/api/webhook/asaas.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).end(); // ⚠️ nunca 405
  }

  try {
    let body = "";

    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });

    const data = JSON.parse(body);

    console.log("📩 Webhook ASAAS:", data.event);
    console.log("📩 Webhook Payment:", JSON.stringify(data.payment));

    const { event, payment } = data;

    // 🔒 Nunca falhar
    if (!payment) {
      console.log("⚠️ Webhook sem payment");
      return res.status(200).json({ received: true });
    }

    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      // ⭐ Usar externalReference (email do usuário) como identificador principal
      const email = payment.externalReference;

      if (!email) {
        console.log("⚠️ Sem externalReference no pagamento");
        return res.status(200).json({ received: true });
      }

      const { error } = await supabase
        .from("users")
        .update({
          is_paid_certification: true,
          payment_date: new Date().toISOString(),
        })
        .eq("email", email.toLowerCase());

      if (error) {
        console.error("❌ Erro ao atualizar user:", error);
      } else {
        console.log("✅ Certificação liberada para:", email);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Erro webhook Asaas:", err);

    // ⚠️ MESMO COM ERRO → 200
    return res.status(200).json({ received: true });
  }
}
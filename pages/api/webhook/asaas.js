// pages/api/webhook/asaas.js

import db from "../../../lib/db";

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

    const { event, payment } = data;

    // 🔒 Nunca falhar
    if (!payment) {
      console.log("⚠️ Webhook sem payment");
      return res.status(200).json({ received: true });
    }

    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const email = payment.customerEmail || payment.billingEmail;

      if (!email) {
        console.log("⚠️ Sem email no pagamento");
        return res.status(200).json({ received: true });
      }

      await db.query(
        `UPDATE users
         SET is_paid_certification = true
         WHERE email = $1`,
        [email.toLowerCase()]
      );

      console.log("✔ Certificação liberada para:", email);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Erro webhook Asaas:", err);

    // ⚠️ MESMO COM ERRO → 200
    return res.status(200).json({ received: true });
  }
}
// pages/api/webhook/asaas.js

import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: false, // ASAAS envia RAW body
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    let body = "";

    await new Promise((resolve) => {
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", resolve);
    });

    const data = JSON.parse(body);

    console.log("📩 Webhook ASAAS recebido:", data);

    const event = data.event;
    const payment = data.payment;

    if (!payment) {
      console.log("❌ Sem pagamento no webhook");
      return res.status(400).end();
    }

    // Só processa pagamento confirmado
    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const externalId = payment.externalReference; // userId
      const valor = payment.value;

      console.log("🎉 Pagamento confirmado para user:", externalId);

      if (!externalId) {
        console.log("❌ Sem userId no externalReference");
        return res.status(400).end();
      }

      // Atualiza no banco o pagamento:
      await db.query(
        "UPDATE users SET is_paid_certification = true WHERE id = $1",
        [externalId]
      );

      console.log("✔ Usuário liberado no sistema:", externalId);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.log("❌ Erro no webhook:", err);
    res.status(500).send("Erro interno");
  }
}
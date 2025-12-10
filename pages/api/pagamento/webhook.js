import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const event = req.body;

    console.log("WEBHOOK RECEBIDO:", event);

    // Apenas pagamentos confirmados
    if (event.event !== "PAYMENT_CONFIRMED") {
      return res.status(200).json({ ok: true });
    }

    const userId = event.payment.externalReference;

    if (!userId) {
      return res.status(200).json({ ok: true });
    }

    // Atualizar Supabase
    await pool.query(
      `
      UPDATE users
      SET is_paid_certification = TRUE, payment_date = NOW()
      WHERE id = $1
      `,
      [userId]
    );

    return res.status(200).json({ ok: true });
    
  } catch (err) {
    console.error("Erro Webhook:", err);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}
import pool from "../../../lib/db";
import { generateCode } from "../../../lib/hmac";
import QRCode from "qrcode";

export default async function handler(req, res) {
  try {
    const payload = req.body;

    const status = payload?.event || payload?.status;
    const paymentId = payload?.payment?.id;
    const userId = payload?.payment?.metadata?.user_id;
    const cpf = payload?.payment?.metadata?.cpf;

    if (!paymentId) return res.status(200).json({ ok: true });

    // pagamento confirmado
    if (status === "PAYMENT_CONFIRMED") {
      // cria inscrição
      const startedAt = new Date();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await pool.query(
        `
          INSERT INTO inscriptions (user_id, started_at, expires_at, status, payment_id)
          VALUES ($1,$2,$3,'active',$4)
        `,
        [userId, startedAt, expiresAt, paymentId]
      );

      return res.json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.log("Erro webhook:", e);
    return res.status(500).json({ ok: false });
  }
}
import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { userId, paymentId } = req.body;

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
import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { userId } = req.query;

  const insc = (
    await pool.query(
      "SELECT * FROM inscriptions WHERE user_id = $1 ORDER BY id DESC LIMIT 1",
      [userId]
    )
  ).rows[0];

  if (!insc) return res.json({ status: "none" });

  const now = new Date();
  const expired = now > new Date(insc.expires_at);

  return res.json({
    status: expired ? "expired" : insc.status,
    started_at: insc.started_at,
    expires_at: insc.expires_at,
    progress: insc.progress || {},
  });
}
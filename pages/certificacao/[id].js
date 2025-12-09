// pages/api/certificado/[id].js
import pool from "../../../../lib/db";

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ ok: false, error: "id required" });

    const result = await pool.query(
      `SELECT c.id, c.user_id, c.issued_at, c.modules_count, c.note, u.name, u.cpf, u.email
       FROM certificates c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = $1 LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Certificado não encontrado" });
    }

    return res.json({ ok: true, certificate: result.rows[0] });
  } catch (err) {
    console.error("Erro /api/certificado/[id]:", err);
    return res.status(500).json({ ok: false, error: "Erro interno." });
  }
}
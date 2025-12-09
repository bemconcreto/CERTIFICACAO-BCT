import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { cpf } = req.query;

  if (!cpf) {
    return res.status(400).json({ error: "CPF obrigatório." });
  }

  const row = await pool.query(
    "SELECT * FROM certificates WHERE cpf = $1 AND status = 'active' ORDER BY id DESC LIMIT 1",
    [cpf]
  );

  if (row.rows.length === 0) {
    return res.json({ certified: false });
  }

  const cert = row.rows[0];

  return res.json({
    certified: true,
    code: cert.code,
    issued_at: cert.issue_date,
    status: cert.status
  });
}
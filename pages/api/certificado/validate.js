import pool from "../../../lib/db";
import { validateCertificate } from "../../../lib/certificate";

export default async function handler(req, res) {
  const { code } = req.query;

  const row = await pool.query(
    "SELECT * FROM certificates WHERE code = $1",
    [code]
  );

  if (row.rows.length === 0)
    return res.json({ valid: false, message: "Certificado não encontrado" });

  const c = row.rows[0];
  const isValid = validateCertificate(c);

  return res.json({
    valid: isValid,
    code: c.code,
    name: c.name,
    cpf: c.cpf.replace(/(\d{3})\d+(\d{2})/, "$1***$2"),
    issue_date: c.issue_date,
    status: c.status,
  });
}
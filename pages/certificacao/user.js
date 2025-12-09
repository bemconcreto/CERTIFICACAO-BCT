import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({ ok: false, error: "ID não fornecido" });
    }

    const result = await pool.query(
      "SELECT id FROM certificates WHERE user_id = $1 LIMIT 1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.json({ ok: true, id: null });
    }

    return res.json({ ok: true, id: result.rows[0].id });

  } catch (err) {
    console.log("Erro /certificado/user:", err);
    return res.json({ ok: false, error: "Erro interno." });
  }
}

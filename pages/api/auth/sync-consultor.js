import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ ok: false, error: "Email ausente" });
    }

    // Apenas busca o usuário – sem criar automaticamente!
    const result = await pool.query(
      `SELECT id, email FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ ok: false, error: "Usuário não encontrado." });
    }

    return res.json({
      ok: true,
      userId: result.rows[0].id,
    });

  } catch (err) {
    console.error("Erro sync consultor:", err);
    return res.json({ ok: false, error: "Erro interno." });
  }
}
import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "email obrigatório" });
    }

    // 1️⃣ Buscar userId REAL a partir do email
    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userId = userResult.rows[0].id;

    // 2️⃣ Buscar progresso do usuário
    const result = await pool.query(
      `
      SELECT module_id
      FROM user_module_progress
      WHERE user_id = $1
      ORDER BY module_id ASC
      `,
      [userId]
    );

    const modulos = result.rows.map((r) => Number(r.module_id));

    return res.status(200).json({
      ok: true,
      modulos,
    });
  } catch (err) {
    console.error("Erro ao carregar progresso:", err);
    return res.status(500).json({
      error: "Erro ao carregar progresso",
    });
  }
}
import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email, moduleId } = req.body;

    if (!email || !moduleId) {
      return res.status(400).json({ error: "Dados incompletos" });
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

    // 2️⃣ Registrar módulo como concluído
    await pool.query(
      `
      INSERT INTO user_module_progress (user_id, module_id, completed_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, module_id) DO NOTHING
      `,
      [userId, Number(moduleId)]
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao salvar módulo:", err);
    return res.status(500).json({ error: "Erro ao salvar progresso" });
  }
}
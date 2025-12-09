import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { userId, moduleId } = req.body;

    if (!userId || !moduleId) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    await pool.query(
      `INSERT INTO user_module_progress (user_id, module_id, completed_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, module_id) DO NOTHING`,
      [Number(userId), Number(moduleId)]
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao salvar módulo:", err);
    return res.status(500).json({ error: "Erro ao salvar progresso" });
  }
}
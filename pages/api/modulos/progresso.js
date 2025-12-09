import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId obrigatório" });
    }

    const result = await pool.query(
      `SELECT module_id FROM user_module_progress WHERE user_id = $1 ORDER BY module_id ASC`,
      [Number(userId)]
    );

    const modulos = result.rows.map((r) => Number(r.module_id));

    return res.status(200).json({ ok: true, modulos });
  } catch (err) {
    console.error("Erro ao carregar progresso:", err);
    return res.status(500).json({ error: "Erro ao carregar progresso" });
  }
}
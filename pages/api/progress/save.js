import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { userId, moduleId, score, passed } = req.body;

    if (!userId || !moduleId) {
      return res.json({ ok: false, error: "Dados insuficientes" });
    }

    await pool.query(
      `
      INSERT INTO progress (user_id, module_id, score, passed)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, module_id)
      DO UPDATE SET score = $3, passed = $4
      `,
      [userId, moduleId, score, passed]
    );

    return res.json({ ok: true });
  } catch (e) {
    console.log("Erro save progress:", e);
    return res.json({ ok: false, error: "Erro interno" });
  }
}
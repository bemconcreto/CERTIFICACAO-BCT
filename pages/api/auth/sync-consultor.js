import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { userId, cpf, email, name, consultorId } = req.body;

    // Verifica se já existe
    const exists = await pool.query(
      "SELECT id FROM users WHERE cpf = $1",
      [cpf]
    );

    if (exists.rows.length > 0) {
      return res.json({ ok: true });
    }

    // Cria novo usuário automaticamente
    await pool.query(
      `
      INSERT INTO users (name, cpf, email, consultor_id)
      VALUES ($1, $2, $3, $4)
      `,
      [name, cpf, email, consultorId || null]
    );

    return res.json({ ok: true });

  } catch (err) {
    console.log("Erro sync consultor:", err);
    return res.json({ ok: false });
  }
}
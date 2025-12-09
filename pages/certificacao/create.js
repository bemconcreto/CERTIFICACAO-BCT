import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método não permitido" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.json({ ok: false, error: "userId não enviado" });
    }

    // Buscar dados do usuário
    const resultUser = await pool.query(
      "SELECT id, name, cpf FROM users WHERE id = $1",
      [userId]
    );

    if (resultUser.rows.length === 0) {
      return res.json({ ok: false, error: "Usuário não encontrado" });
    }

    const user = resultUser.rows[0];

    // Verificar se certificado já existe
    const exists = await pool.query(
      "SELECT id FROM certificados WHERE user_id = $1",
      [userId]
    );

    if (exists.rows.length > 0) {
      return res.json({
        ok: true,
        id: exists.rows[0].id,
        message: "Certificado já existia",
      });
    }

    // Criar novo certificado
    const insert = await pool.query(
      `
      INSERT INTO certificados (user_id, cpf, nome)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [user.id, user.cpf, user.name]
    );

    return res.json({
      ok: true,
      id: insert.rows[0].id,
      message: "Certificado criado com sucesso!",
    });

  } catch (err) {
    console.log("Erro /certificado/create:", err);
    return res.json({ ok: false, error: "Erro interno." });
  }
}
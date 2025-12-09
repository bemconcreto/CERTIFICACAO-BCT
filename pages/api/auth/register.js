import pool from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    const { name, cpf, email, telefone, instagram, senha, consultorId } = req.body;

    if (!name || !cpf || !email || !senha) {
      return res.json({ ok: false, error: "Campos obrigatórios faltando." });
    }

    // Verifica se já existe usuário
    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR cpf = $2",
      [email, cpf]
    );

    if (exists.rows.length > 0) {
      return res.json({
        ok: false,
        error: "Usuário já cadastrado.",
      });
    }

    const hashed = hashPassword(senha);

    const insert = await pool.query(
      `
      INSERT INTO users (name, cpf, email, phone, instagram, password_hash, consultor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, cpf, email, consultor_id
      `,
      [name, cpf, email, telefone, instagram, hashed, consultorId || null]
    );

    const user = insert.rows[0];

    return res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        consultorId: user.consultor_id,
      }
    });

  } catch (err) {
    console.error("Erro no cadastro:", err);
    return res.json({ ok: false, error: "Erro interno no servidor." });
  }
}
// /pages/api/auth/login.js
import pool from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth"; // sua função que checa hash
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Método não permitido" });

  try {
    const { email, pass } = req.body; // pass é o campo que o frontend deve enviar

    if (!email || !pass) {
      return res.status(400).json({ ok: false, error: "Email e senha são obrigatórios." });
    }

    console.log("[login] Tentativa de login:", { email });

    // buscar usuário no banco
    const q = await pool.query(
      `SELECT id, name, cpf, email, password_hash, is_email_verified, consultor_id
       FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (q.rows.length === 0) {
      console.warn("[login] Usuário não encontrado:", email);
      return res.status(401).json({ ok: false, error: "Usuário ou senha incorretos." });
    }

    const user = q.rows[0];

    // checar senha
    const passwordOk = await verifyPassword(pass, user.password_hash);
    if (!passwordOk) {
      console.warn("[login] Senha incorreta para:", email);
      return res.status(401).json({ ok: false, error: "Usuário ou senha incorretos." });
    }

    // checar verificação de e-mail (se quiser obrigar)
    if (!user.is_email_verified) {
      console.log("[login] Email não verificado:", email);
      return res.status(403).json({ ok: false, requiresEmailVerification: true, error: "Confirme seu e-mail." });
    }

    // tudo certo -> gerar token
    const token = jwt.sign(
      {
        userId: user.id,
        cpf: user.cpf,
        email: user.email,
        consultorId: user.consultor_id || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("[login] Login OK:", email);

    return res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        consultorId: user.consultor_id || null
      }
    });

  } catch (err) {
    // log completo para debugar
    console.error("[login] ERRO:", err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: "Erro interno no login." });
  }
}
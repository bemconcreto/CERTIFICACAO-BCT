import jwt from "jsonwebtoken";
import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  try {
    const { token } = req.body;
    if (!token) {
      return res.json({ ok: false, error: "Token ausente." });
    }

    // 1️⃣ Validar token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.json({ ok: false, error: "Token inválido ou expirado." });
    }

    const userId = decoded.userId;

    // 2️⃣ Atualizar no banco
    await pool.query(
      `UPDATE users 
       SET is_email_verified = true 
       WHERE id = $1`,
      [userId]
    );

    return res.json({ ok: true });

  } catch (err) {
    console.error("Erro ao verificar email:", err);
    return res.json({ ok: false, error: "Erro interno." });
  }
}
// pages/api/usuario.js
import pool from "../../lib/db";

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    console.log("API /api/usuario chamado — id:", id);

    if (!id) {
      console.log("-> ID não fornecido");
      return res.status(400).json({ ok: false, error: "ID não fornecido." });
    }

    if (!process.env.DATABASE_URL) {
      console.log("⚠️ ATENÇÃO: DATABASE_URL NÃO ENCONTRADA no env.");
    }

    // 🔥 BUSCA COMPLETA — AGORA INCLUINDO is_paid_certification
    const result = await pool.query(
      `
      SELECT 
        id,
        name,
        cpf,
        email,
        consultor_id,
        is_certified,
        is_paid_certification,
        created_at
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    console.log("Resultado do SELECT (rows length):", result.rows.length);

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Usuário não encontrado."
      });
    }

    return res.json({
      ok: true,
      usuario: result.rows[0]
    });

  } catch (err) {
    console.error("❌ Erro /api/usuario:", err);
    const isDev = process.env.NODE_ENV !== "production";

    return res.status(500).json({
      ok: false,
      error: "Erro interno.",
      details: isDev ? err.message : undefined
    });
  }
}
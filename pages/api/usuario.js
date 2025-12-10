// pages/api/usuario.js
import pool from "../../lib/db";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    console.log("📡 [API] /api/usuario — ID recebido:", id);

    if (!id) {
      console.log("❌ ID não fornecido");
      return res.status(400).json({ ok: false, error: "ID não fornecido." });
    }

    if (!process.env.DATABASE_URL) {
      console.log("⚠️ AVISO: DATABASE_URL NÃO ENCONTRADA nas variáveis de ambiente.");
    }

    // ------------------------------------------------------
    // 🔍 CONSULTA COMPLETA DO USUÁRIO (com is_paid_certification)
    // ------------------------------------------------------
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

    console.log("📦 Resultado SELECT — rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("❌ Usuário não encontrado no banco.");
      return res.status(404).json({
        ok: false,
        error: "Usuário não encontrado."
      });
    }

    const usuario = result.rows[0];
    console.log("👤 Usuário carregado:", usuario);

    // ------------------------------------------------------
    // ✔ RETORNAR PARA O FRONTEND
    // ------------------------------------------------------
    return res.json({
      ok: true,
      usuario
    });

  } catch (err) {
    console.error("❌ Erro no endpoint /api/usuario:", err);

    const isDev = process.env.NODE_ENV !== "production";

    return res.status(500).json({
      ok: false,
      error: "Erro interno.",
      details: isDev ? err.message : undefined
    });
  }
}
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

    // logando string de conexão (apenas o início, sem expor tudo)
    if (process.env.DATABASE_URL) {
      console.log("DATABASE_URL presente. (não vamos imprimir por segurança)");
    } else {
      console.log("ATENÇÃO: DATABASE_URL NÃO ENCONTRADA no env.");
    }

    const result = await pool.query(
      "SELECT id, name, cpf, email, consultor_id FROM users WHERE id = $1",
      [id]
    );

    console.log("Resultado do SELECT (rows length):", result.rows.length);
    console.log("Rows:", result.rows.slice(0,5));

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Usuário não encontrado." });
    }

    return res.json({
      ok: true,
      usuario: result.rows[0]
    });

  } catch (err) {
    console.error("Erro /api/usuario (stack):", err && err.stack ? err.stack : err);
    // em dev, envie mensagem de erro mais detalhada para diagnóstico
    const isDev = process.env.NODE_ENV !== "production";
    return res.status(500).json({ ok: false, error: "Erro interno.", details: isDev ? (err.message || String(err)) : undefined });
  }
}
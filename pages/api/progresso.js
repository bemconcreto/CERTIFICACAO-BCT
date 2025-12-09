import pool from "../../lib/db";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({ ok: false, error: "ID não fornecido." });
    }

    // BUSCA O PROGRESSO DO ALUNO
    const result = await pool.query(
      `
      SELECT modulo, aprovado, nota
      FROM progresso
      WHERE user_id = $1
      ORDER BY modulo ASC
      `,
      [id]
    );

    // Transformar a lista em objeto:
    // { 1: { aprovado: true, nota: 90 }, 2: { ... } }
    const progresso = {};

    result.rows.forEach((row) => {
      progresso[row.modulo] = {
        aprovado: row.aprovado,
        nota: row.nota
      };
    });

    return res.json(progresso);

  } catch (err) {
    console.log("Erro /progresso:", err);
    return res.json({ ok: false, error: "Erro interno." });
  }
}
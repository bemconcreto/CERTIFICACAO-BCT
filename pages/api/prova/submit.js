import pool from "../../../lib/db";
import { modules } from "../../../lib/modules";

export default async function handler(req, res) {
  const { userId, moduloId, respostas } = req.body;

  const modulo = modules.find((m) => m.id === moduloId);
  if (!modulo) return res.json({ ok: false, error: "Módulo inexistente" });

  let acertos = 0;

  modulo.questions.forEach((q, i) => {
    if (respostas[i] && respostas[i].trim() === q.a.trim()) acertos++;
  });

  const score = (acertos / modulo.questions.length) * 100;
  const aprovado = score >= 80;

  // salva progresso
  await pool.query(
    `
      UPDATE inscriptions
      SET progress = jsonb_set(
        COALESCE(progress, '{}'::jsonb),
        '{${moduloId}}',
        '${JSON.stringify({ score, aprovado, responded_at: new Date() })}'
      )
      WHERE user_id = $1
    `,
    [userId]
  );

  return res.json({
    ok: true,
    score,
    aprovado,
    proximoModulo: aprovado ? moduloId + 1 : moduloId,
  });
}
import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email, moduleId, userId } = req.body;

    if (!email || !moduleId) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // 🔒 SEGURANÇA: este projeto ainda não tem sessão real (JWT/cookie) —
    // a "identidade" hoje é só o e-mail salvo no localStorage, que qualquer
    // pessoa pode forjar sabendo o e-mail de outra pessoa (IDOR). Como
    // correção pragmática, exigimos também o `userId` (id do Supabase,
    // salvo no localStorage junto do e-mail no login) e conferimos que ele
    // realmente pertence a esse e-mail antes de aceitar a conclusão do
    // módulo. Isso evita que alguém complete módulos da conta de terceiros
    // só enviando `{ email, moduleId }`.
    if (!userId) {
      return res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
    }

    // 🔹 resolver userId pelo email e checar se o pagamento foi confirmado
    const userResult = await pool.query(
      "SELECT id, is_paid_certification FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userRow = userResult.rows[0];

    // 🔒 IDOR: o userId enviado precisa bater com o dono real do e-mail
    if (String(userRow.id) !== String(userId)) {
      return res.status(403).json({ error: "Sessão inválida para este usuário." });
    }

    // 🔒 Evita concluir módulo sem ter pago a certificação (R$17,77 via Asaas)
    if (!userRow.is_paid_certification) {
      return res.status(403).json({
        error: "Pagamento da certificação não confirmado. Conclua o pagamento antes de continuar.",
      });
    }

    // 🔹 salvar progresso (usa o id confirmado no banco, não o valor bruto enviado pelo cliente)
    await pool.query(
      `
      INSERT INTO user_module_progress (user_id, module_id, completed_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, module_id) DO NOTHING
      `,
      [userRow.id, Number(moduleId)]
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao concluir módulo:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
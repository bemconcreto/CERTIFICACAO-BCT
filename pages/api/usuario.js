import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔒 STRING FIXA PARA USUÁRIOS GOOGLE
const GOOGLE_PASSWORD_HASH = "GOOGLE_AUTH_USER_DO_NOT_USE";

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      ok: false,
      error: "Email obrigatório",
    });
  }

  const emailLower = email.toLowerCase();

  try {
    // 1️⃣ Buscar usuário existente
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", emailLower)
      .single();

    if (user) {
      return res.json({ ok: true, usuario: user });
    }

    // 2️⃣ CPF FAKE VÁLIDO (11 dígitos)
    const cpfFake = (
      "999" +
      Math.floor(10000000 + Math.random() * 90000000)
    )
      .toString()
      .slice(0, 11);

    // 3️⃣ Criar usuário COMPLETO (RESPEITANDO O BANCO)
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email: emailLower,
        name: emailLower.split("@")[0].slice(0, 100),
        cpf: cpfFake,

        // ⚠️ NOME EXATO DA COLUNA DO SUPABASE
        password_hasl: GOOGLE_PASSWORD_HASH,

        phone: null,
        instagram: null,
        is_certified: false,
        is_paid_certification: false,
        is_email_verified: true,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Erro criando usuário:", error);
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }

    return res.json({ ok: true, usuario: newUser });
  } catch (err) {
    console.error("❌ Erro /api/usuario:", err);
    return res.status(500).json({
      ok: false,
      error: "Erro interno",
    });
  }
}
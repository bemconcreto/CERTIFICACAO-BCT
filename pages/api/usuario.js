import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      ok: false,
      error: "Email obrigatório",
    });
  }

  try {
    // 1️⃣ Buscar usuário existente
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (user) {
      return res.json({
        ok: true,
        usuario: user,
      });
    }

    // 2️⃣ CPF PLACEHOLDER 100% SEGURO (11 dígitos)
    const cpfFake = (
      "999" +
      Math.floor(10000000 + Math.random() * 90000000)
    )
      .toString()
      .slice(0, 11); // 🔒 garantia absoluta

    // 3️⃣ Criar usuário REAL
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        name: email.split("@")[0].slice(0, 100),
        cpf: cpfFake,
        phone: null,
        instagram: null,
        phone_code: null, // 🔥 ISSO EVITA O ERRO 22001
        is_certified: false,
        is_paid_certification: false,
        is_email_verified: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Erro criando usuário:", insertError);
      return res.status(500).json({
        ok: false,
        error: insertError.message,
      });
    }

    return res.json({
      ok: true,
      usuario: newUser,
    });
  } catch (err) {
    console.error("❌ Erro /api/usuario:", err);
    return res.status(500).json({
      ok: false,
      error: "Erro interno",
    });
  }
}
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
    // 1️⃣ BUSCAR USUÁRIO PELO EMAIL
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    // 2️⃣ SE ENCONTROU → RETORNA
    if (user) {
      return res.json({
        ok: true,
        usuario: user,
      });
    }

    // 3️⃣ SE NÃO ENCONTROU → CRIA USUÁRIO
    // ⚠️ CPF É NOT NULL → placeholder seguro
    const fakeCpf = `google_${Date.now()}`;

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        name: email.split("@")[0],
        cpf: fakeCpf, // 🔥 ESSENCIAL
        is_certified: false,
        is_paid_certification: false,
        is_email_verified: true, // Google já validou
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Erro criando usuário:", insertError);
      return res.status(500).json({
        ok: false,
        error: "Erro ao criar usuário",
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
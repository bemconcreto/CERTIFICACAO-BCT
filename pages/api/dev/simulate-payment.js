import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ⚠️ ROTA TEMPORÁRIA — APENAS PARA TESTES
// Acesse: /api/dev/simulate-payment?email=SEU_EMAIL
export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ ok: false, error: "Informe ?email=seu@email.com" });
  }

  const { data, error } = await supabase
    .from("users")
    .update({ is_paid_certification: true })
    .eq("email", email.toLowerCase())
    .select()
    .single();

  if (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.json({ ok: true, message: "Pagamento simulado com sucesso!", usuario: data });
}

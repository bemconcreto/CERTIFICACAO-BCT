import crypto from "crypto";

export const runtime = "nodejs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Buscar usuário pelo email
    const userRes = await fetch(
      `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id,email,is_certified`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    const users = await userRes.json();
    const user = users?.[0];

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Já certificado — retorna ok sem duplicar
    if (user.is_certified) {
      return res.status(200).json({ ok: true, message: "Já certificado" });
    }

    // Marcar como certificado
    const updateRes = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${user.id}`,
      {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          is_certified: true,
          certified_at: new Date().toISOString(),
          certificate_id: crypto.randomUUID(),
        }),
      }
    );

    if (!updateRes.ok) {
      return res.status(500).json({ error: "Falha ao certificar usuário" });
    }

    // Notificar CONSULTOR-BCT
    if (process.env.CONSULTOR_URL && process.env.INTERNAL_API_SECRET) {
      try {
        await fetch(`${process.env.CONSULTOR_URL}/api/internal/certificar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": process.env.INTERNAL_API_SECRET,
          },
          body: JSON.stringify({ email: email.toLowerCase() }),
        });
      } catch (syncErr) {
        console.error("Erro ao sincronizar certificação com CONSULTOR-BCT:", syncErr);
      }
    }

    return res.status(200).json({ ok: true, message: "Certificado emitido com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar certificado:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}

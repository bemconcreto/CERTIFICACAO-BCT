import crypto from "crypto";

export const runtime = "nodejs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        is_certified: true,
        certified_at: new Date().toISOString(),
        certificate_id: crypto.randomUUID()
      })
    });

    if (!updateRes.ok) {
      return res.status(500).json({ error: "Falha ao atualizar usuário" });
    }

    return res.status(200).json({
      ok: true,
      message: "Usuário certificado com sucesso!"
    });

  } catch (error) {
    console.error("Erro no endpoint de certificação:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}
export default async function handler(req, res) {
  console.log("🔥 Pagamento PIX - Início");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  const { userId, email, name, cpf } = req.body || {};

  if (!userId || !email || !name || !cpf) {
    console.log("❌ Body incompleto:", req.body);
    return res.status(400).json({
      ok: false,
      error: "Dados incompletos",
      received: req.body,
    });
  }

  console.log("👉 Dados recebidos:", req.body);

  const API_KEY = process.env.ASAAS_API_KEY;
  const CUSTOMER_ID = process.env.ASAAS_CUSTOMER_ID;

  if (!API_KEY || !CUSTOMER_ID) {
    console.log("❌ Erro: variáveis ASAAS ausentes");
    return res.status(500).json({ ok: false, error: "Erro de configuração ASAAS" });
  }

  try {
    console.log("🚀 Enviando cobrança ao ASAAS...");

    const cobrancaResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "certificacao-bct",
        "access_token": API_KEY
      },
      body: JSON.stringify({
        customer: CUSTOMER_ID,
        billingType: "PIX",
        value: 17.77,
        description: `Certificação BCT - Usuário ${userId}`,
        dueDate: new Date().toISOString().split("T")[0],
      }),
    });

    const text = await cobrancaResponse.text();
    console.log("🔵 Resposta ASAAS (RAW):", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.log("❌ Erro ao parsear JSON do ASAAS:", e);
      return res.status(500).json({
        ok: false,
        error: "Resposta inválida do ASAAS",
        raw: text
      });
    }

    if (!json.id) {
      console.log("❌ ASAAS retornou erro:", json);
      return res.status(500).json({
        ok: false,
        error: "Falha ao criar cobrança no ASAAS",
        detalhes: json
      });
    }

    console.log("✅ Cobrança criada!", json.id);

    return res.status(200).json({
      ok: true,
      charge_id: json.id,
      pixCopyPaste: json.pixCopyPaste,
      qrCodeImage: json.qrCodeImage
    });

  } catch (err) {
    console.log("🔥 ERRO GERAL:", err);
    return res.status(500).json({
      ok: false,
      error: "Falha inesperada",
    });
  }
}
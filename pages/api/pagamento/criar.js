export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método não permitido" });
    }

    const { userId, email, name } = req.body;

    if (!userId || !email || !name) {
      return res.status(400).json({ ok: false, error: "Dados incompletos" });
    }

    const API_KEY = process.env.ASAAS_API_KEY;
    const CUSTOMER_ID = process.env.ASAAS_CUSTOMER_ID;

    if (!API_KEY) {
      return res.status(500).json({ ok: false, error: "API KEY ausente" });
    }

    if (!CUSTOMER_ID) {
      return res.status(500).json({ ok: false, error: "CUSTOMER_ID ausente" });
    }

    // -------------------------------------------------------
    // 1️⃣ Criar cobrança ASAAS
    // -------------------------------------------------------
    const cobrancaResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "certificacao-bct",
        "access_token": API_KEY
      },
      body: JSON.stringify({
        customer: CUSTOMER_ID,          // 🔥 Cliente fixo CERTIFICAÇÃO-BCT
        billingType: "PIX",
        value: 17.77,
        description: `Certificação BCT - Usuário ${userId}`,
        dueDate: new Date().toISOString().split("T")[0],
      }),
    });

    let cobrancaText = await cobrancaResponse.text();
    console.log("🔵 RESPOSTA ASAAS (raw):", cobrancaText);

    let cobranca;
    try {
      cobranca = JSON.parse(cobrancaText);
    } catch (e) {
      console.error("❌ Falha ao parsear JSON:", e);
      return res.status(500).json({
        ok: false,
        error: "Resposta inválida do Asaas",
        raw: cobrancaText
      });
    }

    if (!cobranca || !cobranca.id) {
      return res.status(500).json({
        ok: false,
        error: "Falha ao criar cobrança",
        detalhes: cobranca,
      });
    }

    return res.status(200).json({
      ok: true,
      charge_id: cobranca.id,
      pixCopyPaste: cobranca.pixCopyPaste,
      qrCodeImage: cobranca.qrCodeImage,
    });

  } catch (err) {
    console.error("🔥 ERRO NO PAGAMENTO:", err);
    return res.status(500).json({ ok: false, error: "Erro interno no pagamento" });
  }
}
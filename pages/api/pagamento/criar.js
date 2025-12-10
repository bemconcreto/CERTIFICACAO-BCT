export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  console.log("🔥 Pagamento PIX - Início");
  console.log("👉 Dados recebidos:", req.body);

  const API_KEY = process.env.ASAAS_API_KEY;
  const CUSTOMER_ID = process.env.ASAAS_CUSTOMER_ID;

  if (!API_KEY || !CUSTOMER_ID) {
    console.log("❌ ERRO: Variáveis ASAAS ausentes");
    return res.status(500).json({
      ok: false,
      error: "Configuração do ASAAS ausente",
    });
  }

  try {
    // 1️⃣ Criar pagamento PIX
    const createPayment = await fetch("https://www.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: API_KEY,
      },
      body: JSON.stringify({
        customer: CUSTOMER_ID,
        billingType: "PIX",
        value: 17.77,
        dueDate: new Date().toISOString().slice(0, 10),
      }),
    });

    const paymentData = await createPayment.json();
    console.log("🔍 RESPOSTA ASAAS:", paymentData);

    if (paymentData?.errors) {
      return res.status(400).json({ ok: false, error: paymentData.errors });
    }

    const paymentId = paymentData.id;

    // 2️⃣ Obter PIX copia e cola
    const qrRes = await fetch(
      `https://www.asaas.com/api/v3/payments/${paymentId}/pixQrCode`,
      { headers: { access_token: API_KEY } }
    );

    const qrData = await qrRes.json();
    console.log("🔍 PIX GERADO:", qrData);

    if (!qrData?.payload) {
      return res.status(400).json({
        ok: false,
        error: "ASAAS não retornou payload PIX",
      });
    }

    // 3️⃣ Retornar para o front
    return res.status(200).json({
      ok: true,
      pixCopyPaste: qrData.payload,
      charge_id: paymentId,
    });

  } catch (err) {
    console.log("❌ ERRO AO GERAR PIX:", err);
    return res.status(500).json({
      ok: false,
      error: "Erro interno ao gerar PIX",
    });
  }
}
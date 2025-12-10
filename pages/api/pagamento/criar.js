export default async function handler(req, res) {
  console.log("🔥 Pagamento PIX - Início");
  console.log("👉 Dados recebidos:", req.body);

  try {
    const API_KEY = process.env.ASAAS_API_KEY;
    const CUSTOMER_ID = process.env.ASAAS_CUSTOMER_ID;

    if (!API_KEY || !CUSTOMER_ID) {
      console.log("❌ ERRO: variáveis ASAAS ausentes");
      return res.status(500).json({ error: "Configuração incompleta" });
    }

    // 🔥 Criar cobrança PIX
    const response = await fetch("https://www.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": API_KEY,
      },
      body: JSON.stringify({
        customer: CUSTOMER_ID,
        billingType: "PIX",
        value: 17.77,
        dueDate: new Date().toISOString().split("T")[0]
      })
    });

    const payment = await response.json();
    console.log("🔍 RESPOSTA ASAAS:", payment);

    if (!payment || !payment.pixTransaction) {
      return res.status(500).json({ error: "Erro ao gerar cobrança PIX" });
    }

    const copiaCola = payment.pixTransaction.payload;

    return res.status(200).json({
      success: true,
      copiaCola
    });

  } catch (e) {
    console.log("❌ ERRO GERAL:", e);
    return res.status(500).json({ error: "Erro interno." });
  }
}
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { userId, email, cpf, name } = req.body;

    if (!userId || !email || !cpf || !name) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // Dados da cobrança
    const payload = {
      customer: process.env.ASAAS_CUSTOMER_ID,
      billingType: "PIX",
      value: 17.77,
      dueDate: new Date().toISOString().split("T")[0],
      description: `Certificação Consultor BCT - Usuário ${userId}`,
      externalReference: String(userId),
      payableWith: "PIX"
    };

    const response = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": process.env.ASAAS_API_KEY
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.errors) {
      console.error(data.errors);
      return res.status(400).json({ error: "Erro na criação do pagamento ASAAS" });
    }

    return res.status(200).json({
      ok: true,
      paymentId: data.id,
      pix: data.pixQrCode,
      qrCodeBase64: data.pixQrCodeImage,
      copiaCola: data.pixQrCode
    });

  } catch (err) {
    console.error("Erro ASAAS:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
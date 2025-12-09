export default async function handler(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ ok: false, error: "Usuário não encontrado." });
    }

    // Aqui futuramente vamos buscar os dados do usuário no banco.
    // Mas por enquanto vamos deixar fixo para teste.

    const response = await fetch("https://www.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": process.env.ASAAS_API_KEY, // precisa existir no .env.local
      },
      body: JSON.stringify({
        customer: "CUS0000000000000", // TEMPORÁRIO — Vamos criar o cadastro automático depois
        billingType: "PIX",
        value: 17.77,
        dueDate: new Date().toISOString().split("T")[0],
        description: "Certificação Consultor BCT"
      })
    });

    const data = await response.json();
    console.log("Retorno Asaas:", data);

    // LINK DO CHECKOUT DA ASAAS
    return res.json({
      ok: true,
      checkoutUrl:
        data.invoiceUrl ||
        data.bankSlipUrl ||
        data.pixQrCodeImage ||
        null,
    });

  } catch (err) {
    console.log("ERRO NA ASAAS:", err);
    return res.json({ ok: false, error: "Erro ao gerar cobrança." });
  }
}
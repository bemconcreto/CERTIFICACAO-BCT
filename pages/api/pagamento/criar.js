import axios from "axios";

export default async function handler(req, res) {
  try {
    const { userId, name, email, cpf } = req.body;

    if (!userId || !name || !email || !cpf) {
      return res.status(400).json({ ok: false, error: "Dados inválidos." });
    }

    const API = axios.create({
      baseURL: "https://www.asaas.com/api/v3",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,   // 👈 OBRIGATÓRIO
      }
    });

    // 🟦 1) Criar ou localizar cliente
    const cliente = await API.post("/customers", {
      name,
      email,
      cpfCnpj: cpf,
      externalReference: `cert-${userId}`,
    }).catch(e => e.response);

    console.log("🔵 RESPOSTA CLIENTE:", cliente?.data);

    if (!cliente?.data?.id) {
      return res.status(500).json({
        ok: false,
        error: "Falha ao criar cliente no ASAAS",
        detalhe: cliente?.data
      });
    }

    const customerId = cliente.data.id;

    // 🟩 2) Criar cobrança PIX de R$ 17,77
    const cobranca = await API.post("/payments", {
      customer: customerId,
      billingType: "PIX",
      value: 17.77,
      description: "Certificação Consultor BCT",
      dueDate: new Date().toISOString().substring(0, 10),
    }).catch(e => e.response);

    console.log("🟢 RESPOSTA COBRANÇA:", cobranca?.data);

    if (!cobranca?.data?.id) {
      return res.status(500).json({
        ok: false,
        error: "Falha ao gerar cobrança",
        detalhe: cobranca?.data
      });
    }

    return res.json({
      ok: true,
      charge: cobranca.data,
    });

  } catch (err) {
    console.error("❌ ERRO FINAL:", err);
    return res.status(500).json({ ok: false, error: "Erro interno", detalhe: err.message });
  }
}
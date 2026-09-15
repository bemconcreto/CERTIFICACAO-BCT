// pages/api/webhook/asaas.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

// ⭐ Este é o webhook considerado oficial (bodyParser desligado + leitura do
// stream bruto, padrão mais robusto pra receber webhooks). Se no painel da
// Asaas a URL cadastrada for a de pages/api/pagamento/webhook.js, inverta
// esse comentário — o importante é que as DUAS fiquem com a mesma proteção.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).end();
  }

  // 🔒 A validação do token do webhook agora é OBRIGATÓRIA. Antes, se
  // ASAAS_WEBHOOK_TOKEN não estivesse configurada na Vercel, o `if`
  // simplesmente pulava a checagem e QUALQUER POST sem token nenhum
  // creditava a certificação de qualquer email. Sem a env var configurada,
  // o endpoint agora recusa tudo (401) em vez de ficar aberto.
  const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;
  const receivedToken = req.headers["asaas-access-token"] || req.query.token;
  if (!webhookToken || receivedToken !== webhookToken) {
    return res.status(401).json({ ok: false });
  }

  try {
    let body = "";

    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });

    const data = JSON.parse(body);

    console.log("📩 Webhook ASAAS:", data.event);
    console.log("📩 Webhook Payment:", JSON.stringify(data.payment));

    const { event, payment } = data;

    // 🔒 Nunca falhar
    if (!payment) {
      console.log("⚠️ Webhook sem payment");
      return res.status(200).json({ received: true });
    }

    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      if (!payment.id) {
        console.log("⚠️ Sem payment.id no evento");
        return res.status(200).json({ received: true });
      }

      // 🔒 Nunca confiar cegamente no payload do webhook (pode ser forjado
      // por quem descobrir/adivinhar a URL) — reconsulta o pagamento direto
      // na API da Asaas pelo id e só credita se o status lá também
      // confirmar (mesmo padrão usado nos webhooks do APP-BCT).
      const API_KEY = process.env.ASAAS_API_KEY;
      if (!API_KEY) {
        console.error("❌ ASAAS_API_KEY ausente — não é possível confirmar pagamento");
        return res.status(200).json({ received: true });
      }

      const confirmRes = await fetch(
        `https://www.asaas.com/api/v3/payments/${payment.id}`,
        { headers: { access_token: API_KEY } }
      );
      const paymentConfirmado = await confirmRes.json();

      const statusConfirmado =
        paymentConfirmado.status === "RECEIVED" || paymentConfirmado.status === "CONFIRMED";

      if (!statusConfirmado) {
        console.log("⚠️ Status do pagamento na Asaas não confirma o webhook:", paymentConfirmado.status);
        return res.status(200).json({ received: true });
      }

      // ⭐ Usar externalReference (email do usuário) confirmado na API,
      // não o do payload do webhook, como identificador principal
      const email = paymentConfirmado.externalReference;

      if (!email) {
        console.log("⚠️ Sem externalReference no pagamento");
        return res.status(200).json({ received: true });
      }

      const { error } = await supabase
        .from("users")
        .update({
          is_paid_certification: true,
        })
        .eq("email", email.toLowerCase());

      if (error) {
        console.error("❌ Erro ao atualizar user:", error);
      } else {
        console.log("✅ Certificação liberada para:", email);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Erro webhook Asaas:", err);

    // ⚠️ MESMO COM ERRO → 200
    return res.status(200).json({ received: true });
  }
}
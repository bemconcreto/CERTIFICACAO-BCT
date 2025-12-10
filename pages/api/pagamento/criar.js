console.log("🔥🔥🔥 TESTE ABSOLUTO 001 — ESTE É O ARQUIVO CORRETO");
export default async function handler(req, res) {
  console.log("🔥 ROTA /api/pagamento/criar FOI CHAMADA");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);

  // ---- LER O RAW BODY MANUALMENTE ----
  let raw = "";
  await new Promise((resolve) => {
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", resolve);
  });

  console.log("📌 RAW BODY RECEBIDO:", raw);

  let body = null;
  try {
    body = JSON.parse(raw);
  } catch (e) {
    console.log("❌ ERRO AO PARSEAR BODY", e);
  }

  console.log("📌 BODY PARSEADO:", body);

  // TESTE: Retorna só para confirmar
  return res.status(200).json({
    ok: true,
    rawBody: raw,
    parsed: body,
  });
}
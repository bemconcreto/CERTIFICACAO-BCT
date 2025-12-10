export default async function handler(req, res) {
  console.log("🔥 ROTA /api/pagamento/criar FOI CHAMADA");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);

  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => {
    console.log("📌 RAW BODY RECEBIDO:", raw);

    res.status(200).json({
      ok: true,
      message: "Debug recebido",
      rawBody: raw,
      parsed: (() => {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })()
    });
  });
}
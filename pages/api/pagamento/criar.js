export default async function handler(req, res) {
  console.log("🔥🔥🔥 TESTE ABSOLUTO 002 — Handler executando");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  console.log("Headers:", req.headers);
  console.log("👉 Body recebido:", req.body);

  const { userId, email, name } = req.body || {};

  if (!userId || !email || !name) {
    return res.status(400).json({ ok: false, error: "Body incompleto" });
  }

  return res.status(200).json({
    ok: true,
    message: "Body recebido com sucesso!",
    body: req.body,
  });
}
export default async function handler(req, res) {
  console.log("🔥 TESTE EXTREMO — INÍCIO");
  console.log("Método:", req.method);

  console.log("🔍 VARS LIDAS:");
  console.log("API_KEY:", process.env.ASAAS_API_KEY || "VAZIO");
  console.log("CUSTOMER:", process.env.ASAAS_CUSTOMER_ID || "VAZIO");

  return res.status(200).json({
    ok: true,
    apiKeyLen: process.env.ASAAS_API_KEY ? process.env.ASAAS_API_KEY.length : 0,
    customer: process.env.ASAAS_CUSTOMER_ID || null,
  });
}
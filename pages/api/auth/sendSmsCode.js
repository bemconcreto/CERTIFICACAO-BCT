import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export default async function handler(req, res) {
  const { phone } = req.body;

  const code = Math.floor(100000 + Math.random() * 900000);

  await client.messages.create({
    body: `Seu código BCT é: ${code}`,
    from: process.env.TWILIO_PHONE,
    to: "+55" + phone
  });

  // armazenar código no banco
  // você pode usar uma tabela sms_codes

  res.json({ ok: true });
}
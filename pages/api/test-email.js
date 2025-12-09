import nodemailer from "nodemailer";

export default async function handler(req, res) {
  console.log("📨 Iniciando teste de email...");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // 👈 Hostinger exige isso às vezes
      },
    });

    console.log("🔍 Conectando ao SMTP...");
    await transporter.verify();
    console.log("✔ SMTP conectado com sucesso!");

    const info = await transporter.sendMail({
      from: `"Bem Concreto" <${process.env.SMTP_USER}>`,
      to: "eltonramaldes@gmail.com",
      subject: "TESTE BEM CONCRETO ✔",
      text: "Se você recebeu isso, o SMTP está funcionando.",
    });

    console.log("📬 Email enviado:", info);
    return res.json({ ok: true, info });

  } catch (err) {
    console.error("❌ ERRO NO SMTP:", err);
    return res.json({ ok: false, error: String(err) });
  }
}
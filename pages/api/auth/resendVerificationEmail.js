import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  try {
    console.log("🔄 Reenvio solicitado");

    const { email, userId } = req.body;

    console.log("📩 Email recebido:", email);

    if (!email || !userId) {
      return res.status(400).json({ ok: false, error: "Dados incompletos." });
    }

    // 🔐 Criar novo token
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const verifyUrl =
      `${process.env.NEXT_PUBLIC_BASE_URL}/verificar-email?token=${token}`;

    console.log("🔗 verifyUrl:", verifyUrl);

    // 💌 Configurar SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("🔍 Testando conexão com SMTP...");
    await transporter.verify();
    console.log("✔ SMTP OK");

    console.log("📝 Enviando email...");
    const info = await transporter.sendMail({
      from: "nao-responda@bemconcreto.com.br",
      to: email,
      subject: "Confirme seu e-mail",
      html: `
        <h2>Seu Bem Mais Concreto...!</h2>
        <p>Para concluir seu cadastro, confirme seu e-mail clicando no link abaixo:</p>
        <p><a href="${verifyUrl}">Confirmar e-mail</a></p>
      `,
    });

    console.log("📤 Email enviado:", info);

    return res.json({ ok: true });

  } catch (err) {
    console.error("❌ Erro no reenvio:", err);
    return res.json({ ok: false, error: "Erro ao reenviar email." });
  }
}
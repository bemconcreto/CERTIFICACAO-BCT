import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método não permitido" });

  try {
    const { email, userId } = req.body;
    if (!email || !userId) {
      return res.json({ ok: false, error: "Dados inválidos." });
    }

    // 🔐 GERA TOKEN
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verificar-email?token=${token}`.replace(
      "//verificar",
      "/verificar"
    );

    console.log("sendVerificationEmail -> START", {
      email,
      userId,
      verifyUrl,
    });

    // 🚀 TRANSPORTER OTIMIZADO (Hostinger exige isso)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Hostinger exige isso em muitos casos
      },
      pool: true, // melhora estabilidade
      maxConnections: 1,
      maxMessages: 5,
    });

    // 🔄 Hostinger precisa de uma pequena pausa antes do envio
    await new Promise((resolve) => setTimeout(resolve, 450));

    // 🔍 Verifica handshake
    const verifyResult = await transporter.verify();
    console.log("sendVerificationEmail -> transporter.verify:", verifyResult);

    // 📩 Email
    const mailOptions = {
      from: `"Bem Concreto" <nao-responda@bemconcreto.com.br>`,
      to: email,
      subject: "Confirme seu e-mail ✔",
      html: `
        <h2>Seu Bem Mais Concreto!</h2>
        <p>Para concluir seu cadastro, confirme seu e-mail clicando no link abaixo:</p>
        <p><a href="${verifyUrl}">Confirmar e-mail</a></p>
        <br/>

      `,
      envelope: {
        from: "nao-responda@bemconcreto.com.br", // CORRETO para Hostinger
        to: email,
      },
      headers: {
        "X-Mailer": "Bem Concreto Certificação",
      },
    };

    // ✉️ ENVIA
    const info = await transporter.sendMail(mailOptions);
    console.log(
      "sendVerificationEmail -> sendMail info:",
      JSON.stringify(info, null, 2)
    );

    return res.json({ ok: true, info });
  } catch (err) {
    console.error("sendVerificationEmail -> ERRO:", err);
    return res.json({
      ok: false,
      error: "Falha ao enviar email.",
      detail: err.message,
    });
  }
}
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

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verificar-email?token=${token}`;

    console.log("sendVerificationEmail -> START", { email, userId, verifyUrl });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: (process.env.SMTP_SECURE === "true") || true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // log do transporte (verifica conexão)
    const verifyResult = await transporter.verify();
    console.log("sendVerificationEmail -> transporter.verify:", verifyResult);

    const mailOptions = {
      from: `"Bem Concreto" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Confirme seu e-mail ✔",
      html: `<h2>Confirme seu e-mail</h2>
             <p>Clique no link:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
      envelope: {
        from: process.env.SMTP_USER,
        to: email
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("sendVerificationEmail -> sendMail info:", JSON.stringify(info, null, 2));

    // Ex.: info.accepted, info.rejected, info.messageId
    return res.json({ ok: true, info });
  } catch (err) {
    console.error("sendVerificationEmail -> ERRO:", err);
    return res.json({ ok: false, error: "Falha ao enviar email.", detail: err.message });
  }
}
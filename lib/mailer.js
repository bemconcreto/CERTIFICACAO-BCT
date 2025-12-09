import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function sendVerificationEmail(email, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verificar-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.verify(); // testa conexão

  const info = await transporter.sendMail({
    from: `"Bem Concreto" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Confirme seu e-mail ✔",
    html: `
      <h2>Confirme seu e-mail</h2>
      <p>Clique no link abaixo para confirmar seu e-mail:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });

  return info;
}
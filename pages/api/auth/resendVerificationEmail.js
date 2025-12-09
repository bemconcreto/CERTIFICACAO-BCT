import pool from "../../../lib/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método não permitido" });

  console.log("🔄 Reenvio solicitado");

  try {
    const { email } = req.body;

    console.log("📩 Email recebido:", email);

    if (!email) {
      return res.json({ ok: false, error: "Email obrigatório." });
    }

    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("❌ Usuário não encontrado");
      return res.json({ ok: false, error: "Usuário não encontrado." });
    }

    const userId = result.rows[0].id;
    console.log("👤 userId encontrado:", userId);

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verificar-email?token=${token}`;
    console.log("🔗 verifyUrl:", verifyUrl);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("🔍 Testando conexão com SMTP...");

    await transporter.verify()
      .then(() => console.log("✔ SMTP OK"))
      .catch(err => console.log("❌ SMTP ERROR:", err));

    console.log("📨 Enviando email...");

    const info = await transporter.sendMail({
      from: `"Bem Concreto" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Confirme seu e-mail ✔",
      html: `
        <h2>Confirme seu e-mail</h2>
        <p>Clique no link abaixo:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
    });

    console.log("📤 Email enviado:", info);

    return res.json({ ok: true });

  } catch (err) {
    console.log("💥 ERRO AO ENVIAR EMAIL:", err);
    return res.json({ ok: false, error: "Falha ao enviar e-mail." });
  }
}
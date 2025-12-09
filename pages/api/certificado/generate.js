import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido");
  }

  try {
    const { userId, html } = req.body;

    if (!userId || !html) {
      return res.status(400).send("Dados incompletos");
    }

    // Atualiza certificado no banco
    await pool.query(
      "UPDATE users SET is_certified = TRUE WHERE id = $1",
      [userId]
    );

    const executablePath = await chromium.executablePath();

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificado.pdf"
    );
    return res.send(pdf);

  } catch (err) {
    console.error("❌ ERRO AO GERAR PDF:", err);
    return res.status(500).send("Erro ao gerar PDF");
  }
}
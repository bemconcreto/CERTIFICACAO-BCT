import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import pool from "../../../lib/db";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Método não permitido" });

    const { userId, html } = req.body;
    if (!userId || !html) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // ⚠️ 1 - Converte as imagens do public para Base64
    function imgToBase64(filename) {
      const filePath = path.join(process.cwd(), "public", filename);
      const fileData = fs.readFileSync(filePath);
      const base64 = Buffer.from(fileData).toString("base64");
      const ext = filename.split(".").pop();
      return `data:image/${ext};base64,${base64}`;
    }

    const seloBase64 = imgToBase64("selo.png");
    const assinaturaBase64 = imgToBase64("assinatura.png");

    // Substitui no HTML
    const finalHtml = html
      .replace('/selo.png', seloBase64)
      .replace('/assinatura.png', assinaturaBase64);

    // ⚠️ 2 - Atualiza no banco (certificação)
    await pool.query(
      "UPDATE users SET is_certified = TRUE WHERE id = $1",
      [userId]
    );

    // ⚠️ 3 - Chrome Serverless
    const executablePath = await chromium.executablePath;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setContent(finalHtml, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=certificado.pdf");
    res.send(pdfBuffer);

  } catch (err) {
    console.error("❌ ERRO AO GERAR PDF:", err);
    res.status(500).json({ error: "Erro ao gerar PDF", detail: err.message });
  }
}
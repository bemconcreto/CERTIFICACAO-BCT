export const runtime = "nodejs";

import puppeteer from "puppeteer";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Buscar usuário
    const userRes = await fetch(`${baseUrl}/api/usuario?id=${id}`);
    const dataUser = await userRes.json();

    if (!dataUser.ok) {
      return res.status(404).send("Usuário não encontrado");
    }

    const nome = dataUser.usuario.name;
    const cpf = dataUser.usuario.cpf;
    const data = new Date().toLocaleDateString("pt-BR");

    // Abrir navegador
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // URL do template
    const url = `${baseUrl}/certificacao/pdf-template?nome=${encodeURIComponent(
      nome
    )}&cpf=${encodeURIComponent(cpf)}&data=${encodeURIComponent(data)}`;

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", left: "0mm", right: "0mm", bottom: "0mm" },
    });

    await browser.close();

    // Headers corretos para PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="certificado-bct.pdf"'
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    // Enviar o PDF corretamente
    res.end(pdfBuffer);

  } catch (e) {
    console.error("❌ ERRO AO GERAR PDF:", e);
    return res.status(500).send("Erro ao gerar PDF");
  }
}
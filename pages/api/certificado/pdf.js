import PDFDocument from "pdfkit";
import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ ok: false, error: "ID não fornecido." });
    }

    // ---- Buscar usuário no banco ----
    const result = await pool.query(
      "SELECT id, name, cpf, email FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Usuário não encontrado." });
    }

    const user = result.rows[0];

    // ---- CONFIGURAR RESPOSTA COMO PDF ----
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificado-${user.id}.pdf`
    );

    // ---- Criar documento PDF ----
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    doc.pipe(res);

    // ---- Bordas ----
    doc.rect(20, 20, 555, 800).stroke("#624b43");

    // ---- Título ----
    doc
      .fontSize(26)
      .fillColor("#101820")
      .font("Helvetica-Bold")
      .text("BEM CONCRETO TOKEN", { align: "center" });

    doc
      .fontSize(12)
      .fillColor("#624b43")
      .text("CONSULTOR CERTIFICADO", {
        align: "center",
        letterSpacing: 3
      });

    doc.moveDown(2);

    // ---- SELO (se existir no /public) ----
    const seloPath = "./public/selo.png";
    try {
      doc.image(seloPath, 230, 150, { width: 150 });
    } catch (e) {
      console.log("Selo não encontrado, seguindo sem imagem.");
    }

    doc.moveDown(6);

    // ---- Texto principal ----
    doc
      .fontSize(18)
      .fillColor("#000")
      .font("Helvetica")
      .text("Certificamos que", { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .fillColor("#101820")
      .text(user.name, { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(16)
      .fillColor("#444")
      .text(`Portador do CPF: ${user.cpf}`, { align: "center" });

    doc.moveDown(2);

    doc
      .fontSize(16)
      .fillColor("#333")
      .text(
        `Concluiu oficialmente todos os 11 módulos da Certificação do Consultor BCT, adquirindo direito de atuar com comissão de 4%.`,
        {
          align: "center",
          width: 450
        }
      );

    doc.moveDown(3);

    // ---- Data ----
    const dataHoje = new Date().toLocaleDateString("pt-BR");

    doc
      .fontSize(16)
      .fillColor("#624b43")
      .text(`Emitido em: ${dataHoje}`, { align: "center" });

    doc.moveDown(3);

    // ---- Assinatura (se existir no public) ----
    const assinaturaPath = "./public/assinatura.png";
    try {
      doc.image(assinaturaPath, 200, 600, { width: 200 });
    } catch (e) {
      console.log("Assinatura não encontrada.");
    }

    doc
      .moveDown(5)
      .fontSize(12)
      .fillColor("#624b43")
      .text("Bem Concreto Negócios Imobiliário", {
        align: "center"
      });

    doc.end();
  } catch (err) {
    console.log("Erro no PDF:", err);
    return res.status(500).json({ ok: false, error: "Erro ao gerar PDF." });
  }
}
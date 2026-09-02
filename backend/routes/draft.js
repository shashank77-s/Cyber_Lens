import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

router.post("/pdf", (req, res) => {
  const { englishText, classification, entities, legalInfo, complainantName } = req.body;

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=cybercrime_complaint_draft.pdf");
  doc.pipe(res);

  doc.fontSize(18).font("Helvetica-Bold").text("Cybercrime Complaint — Draft", { align: "center" });
  doc.moveDown(1.5);

  doc.fontSize(11).font("Helvetica-Bold").text("Complainant Name: ", { continued: true })
    .font("Helvetica").text(complainantName || "____________________");
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Classified Incident Type: ", { continued: true })
    .font("Helvetica").text(`${classification.predictedType} (confidence: ${(classification.confidence * 100).toFixed(0)}%)`);
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Incident Description:");
  doc.font("Helvetica").text(englishText, { align: "justify" });
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Extracted Details:");
  doc.font("Helvetica");
  doc.text(`• Amount(s): ${entities.amounts.join(", ") || "Not detected — please add manually"}`);
  doc.text(`• Date(s): ${entities.dates.join(", ") || "Not detected — please add manually"}`);
  doc.text(`• UPI ID(s): ${entities.upiIds.join(", ") || "Not detected — please add manually"}`);
  doc.text(`• Phone Number(s): ${entities.phoneNumbers.join(", ") || "Not detected — please add manually"}`);
  doc.text(`• Transaction Reference(s): ${entities.transactionRefs.join(", ") || "Not detected — please add manually"}`);
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Suggested Applicable Sections (verify with an advocate/portal):");
  doc.font("Helvetica");
  legalInfo.sections.forEach((s) => doc.text(`• ${s}`));
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Evidence Checklist:");
  doc.font("Helvetica");
  legalInfo.evidence.forEach((e) => doc.text(`☐ ${e}`));
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Immediate Guidance:");
  doc.font("Helvetica").text(legalInfo.guidance, { align: "justify" });
  doc.moveDown(1.2);

  doc.fontSize(9).font("Helvetica-Oblique").fillColor("gray").text(
    "Disclaimer: This is an auto-generated drafting aid, not legal advice. Please verify all details and applicable sections with a cyber law advocate or directly on cybercrime.gov.in before final submission.",
    { align: "justify" }
  );

  doc.end();
});

export default router;

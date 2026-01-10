import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFReport = (results) => {
    const doc = new jsPDF();

    // Colors
    const primaryColor = [37, 99, 235]; // Blue
    const textColor = [15, 23, 42]; // Dark slate
    const lightGray = [148, 163, 184];

    // Header
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Evalyn', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Interview Performance Report', 20, 28);

    // Candidate Info
    let yPos = 50;
    doc.setTextColor(...textColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Interview Summary', 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightGray);
    doc.text(`${results.candidate.role} • Candidate ID ${results.candidate.id}`, 20, yPos);

    // Confidence Score Box
    yPos += 15;
    doc.setFillColor(...primaryColor);
    doc.roundedRect(20, yPos, 50, 30, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`${results.executiveSummary.score}%`, 45, yPos + 20, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('CONFIDENCE SCORE', 45, yPos + 26, { align: 'center' });

    // Executive Summary
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(results.executiveSummary.recommendation, 80, yPos + 10);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(results.executiveSummary.description, 110);
    doc.text(summaryLines, 80, yPos + 18);

    // Key Takeaways
    yPos += 50;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Key Takeaways', 20, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    results.keyTakeaways.forEach((takeaway, index) => {
        const lines = doc.splitTextToSize(`• ${takeaway}`, 170);
        doc.text(lines, 20, yPos);
        yPos += lines.length * 5 + 2;
    });

    // Score Breakdown Table - using autoTable
    yPos += 10;
    autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Score']],
        body: results.scoreBreakdown.map(item => [item.category, `${item.score}%`]),
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9,
            textColor: textColor
        },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 30, halign: 'center' }
        },
        margin: { left: 20, right: 20 }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Top Highlights
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Highlights', 20, yPos);

    yPos += 8;
    results.topHighlights.forEach((highlight, index) => {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(34, 197, 94); // Green
        doc.roundedRect(20, yPos - 3, 20, 5, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(highlight.level, 30, yPos, { align: 'center' });

        yPos += 8;
        doc.setFontSize(10);
        doc.setTextColor(...textColor);
        doc.text(highlight.title, 20, yPos);

        yPos += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...lightGray);
        const descLines = doc.splitTextToSize(highlight.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 8;
    });

    // New Page for Growth Opportunities
    doc.addPage();
    yPos = 20;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Growth Opportunities', 20, yPos);

    yPos += 10;
    results.growthOpportunities.forEach((opportunity, index) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(opportunity.title, 20, yPos);

        yPos += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...lightGray);
        const oppLines = doc.splitTextToSize(opportunity.description, 170);
        doc.text(oppLines, 20, yPos);
        yPos += oppLines.length * 5 + 8;
    });

    // Resume Sync
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Resume Sync', 20, yPos);

    yPos += 8;
    results.resumeSync.forEach((item, index) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`✓ ${item.title}`, 20, yPos);

        yPos += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...lightGray);
        doc.text(item.description, 25, yPos);
        yPos += 8;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.text(
            `Evalyn © 2025 • Professional Edition • Page ${i} of ${pageCount}`,
            105,
            285,
            { align: 'center' }
        );
    }

    // Save PDF
    const fileName = `Interview_Report_${results.candidate.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
};

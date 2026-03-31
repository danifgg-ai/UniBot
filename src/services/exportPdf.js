import { jsPDF } from 'jspdf';

export function exportChatToPdf(session) {
  if (!session || !session.messages?.length) return;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const green = [26, 154, 96];
  const gold = [234, 172, 36];
  const darkText = [30, 30, 30];
  const grayText = [120, 120, 120];

  function checkNewPage(needed) {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  // Header bar
  doc.setFillColor(...green);
  doc.rect(0, 0, pageWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('UniBot - Cooperativa Universitaria', margin, 12);
  y = 28;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkText);
  doc.text(session.title || 'Conversacion', margin, y);
  y += 7;

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayText);
  const date = new Date(session.createdAt || Date.now());
  doc.text(`Exportado: ${date.toLocaleDateString('es')} ${date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`, margin, y);
  y += 4;

  // Separator
  doc.setDrawColor(...green);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Messages
  for (const msg of session.messages) {
    const isUser = msg.role === 'user';
    const sender = isUser ? 'Tu' : 'UniBot';
    const time = msg.timestamp
      ? new Date(msg.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
      : '';

    // Sender label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...(isUser ? gold : green));
    const label = time ? `${sender}  (${time})` : sender;

    checkNewPage(16);
    doc.text(label, margin, y);
    y += 5;

    // Message content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...darkText);

    const lines = doc.splitTextToSize(msg.content, contentWidth);
    for (const line of lines) {
      checkNewPage(6);
      doc.text(line, margin, y);
      y += 5;
    }

    y += 4;
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text(
      `Pagina ${i} de ${totalPages}  |  UniBot - Cooperativa Universitaria`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' },
    );
  }

  const fileName = `UniBot_${(session.title || 'chat').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}.pdf`;
  doc.save(fileName);
}

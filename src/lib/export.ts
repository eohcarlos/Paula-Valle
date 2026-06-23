import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export interface ReportRow {
  [key: string]: string | number
}

export function exportToPDF(title: string, subtitle: string, columns: string[], rows: (string | number)[][]) {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.setTextColor(176, 138, 69)
  doc.text(title, 14, 20)
  doc.setFontSize(10)
  doc.setTextColor(120, 113, 108)
  doc.text(subtitle, 14, 27)

  autoTable(doc, {
    startY: 33,
    head: [columns],
    body: rows,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [201, 163, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [250, 246, 239] },
  })

  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`)
}

export function exportToExcel(sheetName: string, rows: ReportRow[]) {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31))
  XLSX.writeFile(wb, `${sheetName.replace(/\s+/g, '_').toLowerCase()}.xlsx`)
}

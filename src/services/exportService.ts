import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense, PettyCashFund, CashReconciliation } from '../types/cajaMenor';
import { formatCOP } from './storageService';

export function exportWeeklyReportToExcel(
  fund: PettyCashFund,
  expenses: Expense[],
  reconciliation: CashReconciliation | null,
  weekNumber: number,
  year: number
): void {
  const wb = XLSX.utils.book_new();

  // 1. Sheet: Movimientos
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const theoreticalBalance = fund.fixedFundAmount - totalExpenses;
  const counted = reconciliation ? reconciliation.countedBalance : theoreticalBalance;
  const diff = reconciliation ? reconciliation.difference : 0;

  const summaryData = [
    ['VIAJA CON ADRI S.A.S. - INFORME SEMANAL DE CAJA MENOR'],
    ['NIT: ' + fund.nit, 'CIUDAD: ' + fund.city],
    ['RESPONSABLE: ' + fund.responsibleName, 'CARGO: ' + fund.responsibleRole],
    ['SEMANA N°: ' + weekNumber + ' - AÑO ' + year, 'FECHA DE ENTREGA A CONTABILIDAD: Cada Viernes'],
    [],
    ['RESUMEN FINANCIERO', 'VALOR (COP)'],
    ['Fondo Fijo Asignado', fund.fixedFundAmount],
    ['Total Gastos de la Semana', totalExpenses],
    ['Saldo Teórico en Libros', theoreticalBalance],
    ['Saldo Físico Contado en Arqueo', counted],
    ['Diferencia (Sobrante/Faltante)', diff],
    ['Porcentaje de Ejecución del Fondo', `${((totalExpenses / fund.fixedFundAmount) * 100).toFixed(1)}%`],
    ['¿Requiere Reembolso?', totalExpenses >= fund.fixedFundAmount * (fund.reimbursementThresholdPercent / 100) ? 'SÍ (Supera ' + fund.reimbursementThresholdPercent + '%)' : 'NO'],
    [],
    ['RELACIÓN DETALLADA DE GASTOS Y SOPORTES'],
    [
      'N°',
      'Fecha',
      'Concepto / Descripción',
      'Categoría',
      'Responsable',
      'Dependencia',
      'Proveedor',
      'NIT / C.C.',
      'Tipo de Soporte',
      'N° Soporte / CUFE',
      'Valor (COP)',
      'Estado Soporte',
      'Observaciones'
    ]
  ];

  expenses.forEach((e, idx) => {
    summaryData.push([
      (idx + 1).toString(),
      e.date,
      e.description,
      e.category.replace(/_/g, ' '),
      e.responsiblePerson,
      e.department.replace(/_/g, ' '),
      e.providerName,
      e.providerNit || 'N/A',
      e.supportType.replace(/_/g, ' '),
      e.supportNumber,
      e.amount.toString(),
      e.supportStatus,
      e.observations || ''
    ]);
  });

  const wsMovimientos = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsMovimientos, 'Movimientos_Caja');

  // 2. Sheet: Arqueo de Denominaciones
  if (reconciliation) {
    const denomData = [
      ['VIAJA CON ADRI S.A.S. - ACTA DE ARQUEO FÍSICO DE CAJA MENOR'],
      ['Fecha del Arqueo:', reconciliation.date],
      ['Responsable de Caja:', reconciliation.responsibleName],
      ['Auditor / Verificador:', reconciliation.auditorName],
      ['Estado del Arqueo:', reconciliation.status],
      [],
      ['DENOMINACIÓN', 'TIPO', 'CANTIDAD', 'SUBTOTAL (COP)'],
      ['$100.000', 'Billete', reconciliation.denominations.bills[100000], reconciliation.denominations.bills[100000] * 100000],
      ['$50.000', 'Billete', reconciliation.denominations.bills[50000], reconciliation.denominations.bills[50000] * 50000],
      ['$20.000', 'Billete', reconciliation.denominations.bills[20000], reconciliation.denominations.bills[20000] * 20000],
      ['$10.000', 'Billete', reconciliation.denominations.bills[10000], reconciliation.denominations.bills[10000] * 10000],
      ['$5.000', 'Billete', reconciliation.denominations.bills[5000], reconciliation.denominations.bills[5000] * 5000],
      ['$2.000', 'Billete', reconciliation.denominations.bills[2000], reconciliation.denominations.bills[2000] * 2000],
      ['$1.000', 'Moneda', reconciliation.denominations.coins[1000], reconciliation.denominations.coins[1000] * 1000],
      ['$500', 'Moneda', reconciliation.denominations.coins[500], reconciliation.denominations.coins[500] * 500],
      ['$200', 'Moneda', reconciliation.denominations.coins[200], reconciliation.denominations.coins[200] * 200],
      ['$100', 'Moneda', reconciliation.denominations.coins[100], reconciliation.denominations.coins[100] * 100],
      ['$50', 'Moneda', reconciliation.denominations.coins[50], reconciliation.denominations.coins[50] * 50],
      [],
      ['TOTAL EFECTIVO CONTADO:', '', '', reconciliation.countedBalance],
      ['SALDO TEÓRICO EN LIBROS:', '', '', reconciliation.theoreticalBalance],
      ['DIFERENCIA (FALTANTE/SOBRANTE):', '', '', reconciliation.difference],
      [],
      ['NOTAS / JUSTIFICACIÓN:', reconciliation.notes || 'Arqueo sin novedades. Saldos verificados.']
    ];
    const wsArqueo = XLSX.utils.aoa_to_sheet(denomData);
    XLSX.utils.book_append_sheet(wb, wsArqueo, 'Arqueo_Fisico');
  }

  // 3. Sheet: Marco Normativo y Firmas
  const complianceData = [
    ['CUMPLIMIENTO NORMATIVO Y LEGALIZACIÓN (COLOMBIA)'],
    ['Empresa: VIAJA CON ADRI S.A.S. - Sector Privado'],
    ['1. Estatuto Tributario Arts. 615 y 771-2: Facturas electrónicas para procedencia de costos y deducciones.'],
    ['2. Resolución DIAN 000167 de 2021: Documento Soporte electrónico en compras a no obligados a facturar.'],
    ['3. Decreto 1625 de 2016 DURT: Validación de requisitos formales de soportes.'],
    ['4. Ley 1314 de 2009: Principios contables y conciliación oportuna de efectivo.'],
    [],
    ['CONTROL DE FIRMAS Y ENTREGA'],
    ['ENTREGADO POR (Custodio Caja Menor):', fund.responsibleName],
    ['REVISADO POR (Contador Público):', fund.accountantName],
    ['APROBADO POR (Gerencia General):', 'Adriana Morales - Representante Legal']
  ];
  const wsNorm = XLSX.utils.aoa_to_sheet(complianceData);
  XLSX.utils.book_append_sheet(wb, wsNorm, 'Legalizacion_Firmas');

  const filename = `CajaMenor_ViajaConAdri_Semana${weekNumber}_${year}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportWeeklyReportToPDF(
  fund: PettyCashFund,
  expenses: Expense[],
  reconciliation: CashReconciliation | null,
  weekNumber: number,
  year: number
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const theoreticalBalance = fund.fixedFundAmount - totalExpenses;
  const counted = reconciliation ? reconciliation.countedBalance : theoreticalBalance;
  const diff = reconciliation ? reconciliation.difference : 0;
  const pendingSupports = expenses.filter(e => e.supportStatus !== 'VERIFICADO').length;

  // Header background
  doc.setFillColor(15, 44, 89); // Deep corporate navy
  doc.rect(0, 0, 210, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VIAJA CON ADRI S.A.S.', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIT: ${fund.nit} | Agencia de Viajes y Turismo | ${fund.city}`, 14, 17);
  doc.text(`INFORME SEMANAL DE CAJA MENOR - CIERRE VIERNES (Semana ${weekNumber} / ${year})`, 14, 23);

  // Metadata block
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8.5);
  doc.text(`Responsable Custodio: ${fund.responsibleName} (${fund.responsibleRole})`, 14, 34);
  doc.text(`Contador Revisor: ${fund.accountantName}`, 14, 39);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 125, 34);
  doc.text(`Tope Máx. por Recibo: ${formatCOP(fund.maxExpensePerReceipt)}`, 125, 39);

  // Financial summary boxes
  // Box 1: Fondo Total
  doc.setFillColor(243, 246, 252);
  doc.roundedRect(14, 44, 42, 18, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 100, 115);
  doc.text('FONDO ASIGNADO', 17, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 44, 89);
  doc.text(formatCOP(fund.fixedFundAmount), 17, 58);

  // Box 2: Total Gastos
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(61, 44, 42, 18, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(153, 27, 27);
  doc.text('TOTAL GASTOS SEMANA', 64, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text(formatCOP(totalExpenses), 64, 58);

  // Box 3: Saldo Disponible
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(108, 44, 42, 18, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52);
  doc.text('SALDO DISPONIBLE', 111, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text(formatCOP(theoreticalBalance), 111, 58);

  // Box 4: Estado Arqueo
  doc.setFillColor(reconciliation && diff !== 0 ? 254 : 248, reconciliation && diff !== 0 ? 243 : 250, reconciliation && diff !== 0 ? 199 : 252);
  doc.roundedRect(155, 44, 42, 18, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('ARQUEO FÍSICO', 158, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  if (reconciliation) {
    if (diff === 0) {
      doc.setTextColor(21, 128, 61);
      doc.text(`CUADRADO ($0)`, 158, 58);
    } else if (diff < 0) {
      doc.setTextColor(220, 38, 38);
      doc.text(`FALTANTE: ${formatCOP(Math.abs(diff))}`, 158, 58);
    } else {
      doc.setTextColor(37, 99, 235);
      doc.text(`SOBRANTE: ${formatCOP(diff)}`, 158, 58);
    }
  } else {
    doc.setTextColor(180, 83, 9);
    doc.text('PENDIENTE CONTEO', 158, 58);
  }

  // Warning banner if pending supports exist
  let tableStartY = 66;
  if (pendingSupports > 0) {
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(14, 65, 182, 8, 1.5, 1.5, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14);
    doc.text(`ADVERTENCIA: Existen ${pendingSupports} gasto(s) con soporte pendiente u observado. Debe regularizarse ante contabilidad.`, 18, 70.5);
    tableStartY = 76;
  }

  // Expenses Table
  const tableRows = expenses.map((e, index) => [
    (index + 1).toString(),
    e.date,
    e.description.length > 38 ? e.description.substring(0, 35) + '...' : e.description,
    e.responsiblePerson,
    e.supportType === 'FACTURA_ELECTRONICA' ? 'Fact. Electrónica' :
    e.supportType === 'DOCUMENTO_SOPORTE_DIAN' ? 'Doc. Soporte DIAN' :
    e.supportType === 'TIQUETE_POS' ? 'Tiquete POS' : 'Recibo Provisional',
    e.supportNumber,
    formatCOP(e.amount),
    e.supportStatus === 'VERIFICADO' ? 'Verificado' : e.supportStatus === 'OBSERVADO' ? 'Observado' : 'Pendiente'
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [['#', 'Fecha', 'Concepto / Descripción', 'Responsable', 'Soporte', 'N° Doc.', 'Valor COP', 'Estado']],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [15, 44, 89],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 18 },
      2: { cellWidth: 64 },
      3: { cellWidth: 26 },
      4: { cellWidth: 26 },
      5: { cellWidth: 18 },
      6: { cellWidth: 22, halign: 'right' },
      7: { cellWidth: 18, halign: 'center' },
    },
    foot: [
      ['', '', 'TOTAL GASTOS LEGALIZADOS', '', '', '', formatCOP(totalExpenses), '']
    ],
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 44, 89],
      fontStyle: 'bold',
      halign: 'right',
    }
  });

  // Get table end position
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 160;

  // Physical Arqueo Breakdown
  let currentY = finalY + 7;
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.rect(14, currentY, 182, 28, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, currentY, 182, 28, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 44, 89);
  doc.text('CONCILIACIÓN FÍSICA Y ARQUEO DE EFECTIVO (VIERNES)', 18, currentY + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  if (reconciliation) {
    const bills = reconciliation.denominations.bills;
    const coins = reconciliation.denominations.coins;
    doc.text(`Billetes: 100k (${bills[100000]}) | 50k (${bills[50000]}) | 20k (${bills[20000]}) | 10k (${bills[10000]}) | 5k (${bills[5000]}) | 2k (${bills[2000]})`, 18, currentY + 12);
    doc.text(`Monedas: 1k (${coins[1000]}) | 500 (${coins[500]}) | 200 (${coins[200]}) | 100 (${coins[100]}) | 50 (${coins[50]})`, 18, currentY + 17);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Efectivo: ${formatCOP(reconciliation.countedBalance)} | Saldo en Libros: ${formatCOP(reconciliation.theoreticalBalance)} | Diferencia: ${formatCOP(reconciliation.difference)} (${reconciliation.status})`, 18, currentY + 23);
  } else {
    doc.text('Arqueo físico semanal aún no ejecutado. Debe realizarse previo a la firma del contador.', 18, currentY + 14);
  }

  // Legal notes
  const notesY = currentY + 34;
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(110, 110, 110);
  doc.text(
    'Certificación Legal: Los desembolsos cumplen las normas de deducción tributaria (Estatuto Tributario arts. 615, 771-2 y Res. DIAN 000167/2021).',
    14,
    notesY
  );
  doc.text(
    'Los soportes originales reposan en la carpeta de archivo físico semanal de VIAJA CON ADRI S.A.S. para revisión y auditoría.',
    14,
    notesY + 4
  );

  // Signatures
  const signY = notesY + 18;
  doc.setDrawColor(180, 180, 180);
  
  // Custodio
  doc.line(16, signY, 66, signY);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(fund.responsibleName, 16, signY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text('Custodio de Caja Menor', 16, signY + 8);

  // Revisor Contable
  doc.line(78, signY, 128, signY);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(fund.accountantName, 78, signY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text('Contabilidad / Revisión', 78, signY + 8);

  // Gerencia
  doc.line(140, signY, 190, signY);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Adriana Morales', 140, signY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text('Gerencia General / Aprobador', 140, signY + 8);

  const filename = `Informe_CajaMenor_ViajaConAdri_Semana${weekNumber}_${year}.pdf`;
  doc.save(filename);
}

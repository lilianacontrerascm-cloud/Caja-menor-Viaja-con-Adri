import React, { useState } from 'react';
import { 
  CalendarCheck, 
  FileSpreadsheet, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  Coins, 
  User, 
  Mail,
  Printer,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PettyCashFund, Expense, CashReconciliation, WeeklyClosing } from '../types/cajaMenor';
import { formatCOP, saveWeeklyClosing } from '../services/storageService';
import { exportWeeklyReportToExcel, exportWeeklyReportToPDF } from '../services/exportService';

interface WeeklyReportViewProps {
  fund: PettyCashFund;
  expenses: Expense[];
  reconciliation: CashReconciliation | null;
  onGoToReconciliation: () => void;
  onGoToExpenses: () => void;
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({
  fund,
  expenses,
  reconciliation,
  onGoToReconciliation,
  onGoToExpenses,
}) => {
  const currentWeekNumber = 43;
  const currentYear = 2026;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const theoreticalBalance = fund.fixedFundAmount - totalExpenses;
  const pendingSupports = expenses.filter(e => e.supportStatus !== 'VERIFICADO');
  const spentPercent = ((totalExpenses / fund.fixedFundAmount) * 100).toFixed(1);

  const [deliveryStatus, setDeliveryStatus] = useState<'BORRADOR' | 'LISTO' | 'ENTREGADO'>('LISTO');
  const [deliveredAt, setDeliveredAt] = useState<string | null>(null);

  // Pre-closing checks
  const checkSupports = pendingSupports.length === 0;
  const checkArqueo = reconciliation !== null;
  const checkCuadrado = reconciliation ? reconciliation.difference === 0 : false;
  const checkThreshold = totalExpenses <= fund.fixedFundAmount;

  const allChecksPassed = checkSupports && checkArqueo && checkCuadrado;

  const handleExportExcel = () => {
    exportWeeklyReportToExcel(fund, expenses, reconciliation, currentWeekNumber, currentYear);
  };

  const handleExportPDF = () => {
    exportWeeklyReportToPDF(fund, expenses, reconciliation, currentWeekNumber, currentYear);
  };

  const handleMarkAsDelivered = () => {
    const now = new Date().toLocaleString('es-CO');
    setDeliveryStatus('ENTREGADO');
    setDeliveredAt(now);

    const closing: WeeklyClosing = {
      id: `closing-${currentYear}-W${currentWeekNumber}`,
      weekNumber: currentWeekNumber,
      year: currentYear,
      startDate: '2026-10-26',
      endDate: '2026-10-30',
      initialFund: fund.fixedFundAmount,
      totalExpenses,
      finalTheoreticalBalance: theoreticalBalance,
      reconciliation: reconciliation || undefined,
      status: 'ENTREGADO_A_CONTABILIDAD',
      deliveredAt: now,
      deliveredBy: fund.responsibleName,
      receivedByAccountant: fund.accountantName,
      notes: 'Entrega formal de viernes con soportes y acta de arqueo digital.'
    };

    saveWeeklyClosing(closing);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Friday Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-700/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
                <CalendarCheck className="w-3.5 h-3.5" />
                Entrega Obligatoria: Cada Viernes
              </span>
              <span className="text-xs text-slate-300">
                Semana N° {currentWeekNumber} • Año {currentYear}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              Informe Semanal de Caja Menor para Contabilidad
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Cumpliendo el procedimiento interno de <strong>VIAJA CON ADRI</strong>, este informe se radica a la oficina de contabilidad (<strong>{fund.accountantName}</strong>) cada viernes al finalizar la jornada para su revisión, validación tributaria DIAN y reembolso de fondos.
            </p>
          </div>

          {/* Action Export Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Descargar Excel (.xlsx)
            </button>

            <button
              onClick={handleExportPDF}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <FileText className="w-4 h-4" />
              Descargar PDF Oficial
            </button>
          </div>
        </div>
      </div>

      {/* Checklist Pre-Cierre */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-600" />
            Checklist de Validación Previo al Cierre de Viernes
          </h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            allChecksPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {allChecksPassed ? 'Listo para entrega formal' : 'Observaciones pendientes'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Check 1: Soportes */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            checkSupports ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-rose-50/80 border-rose-200 text-rose-900'
          }`}>
            <div className={`mt-0.5 ${checkSupports ? 'text-emerald-600' : 'text-rose-600'}`}>
              {checkSupports ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-bold block">1. Soportes DIAN Verificados</span>
              <p className="text-[11px] mt-0.5 opacity-90">
                {checkSupports 
                  ? 'Todos los gastos cuentan con factura o documento soporte válido.' 
                  : `Hay ${pendingSupports.length} gasto(s) sin soporte completo. Debe subsanarse antes de entregar.`}
              </p>
              {!checkSupports && (
                <button 
                  onClick={onGoToExpenses}
                  className="mt-1.5 text-[10px] font-bold text-rose-700 underline"
                >
                  Ver gastos observados →
                </button>
              )}
            </div>
          </div>

          {/* Check 2: Arqueo ejecutado */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            checkArqueo ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <div className={`mt-0.5 ${checkArqueo ? 'text-emerald-600' : 'text-amber-600'}`}>
              {checkArqueo ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-bold block">2. Arqueo Físico de Billetes</span>
              <p className="text-[11px] mt-0.5 opacity-90">
                {checkArqueo 
                  ? `Arqueo realizado por ${reconciliation?.auditorName}.` 
                  : 'Falta ejecutar el conteo de billetes y monedas de la semana.'}
              </p>
              {!checkArqueo && (
                <button 
                  onClick={onGoToReconciliation}
                  className="mt-1.5 text-[10px] font-bold text-amber-800 underline"
                >
                  Ir al módulo de arqueo →
                </button>
              )}
            </div>
          </div>

          {/* Check 3: Conciliación sin descuadre */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            checkCuadrado ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className={`mt-0.5 ${checkCuadrado ? 'text-emerald-600' : 'text-slate-400'}`}>
              {checkCuadrado ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-bold block">3. Conciliación Exacta ($0)</span>
              <p className="text-[11px] mt-0.5 opacity-90">
                {checkCuadrado 
                  ? 'Caja cuadrada con $0 diferencia entre libros y efectivo.' 
                  : reconciliation 
                  ? `Diferencia registrada: ${formatCOP(reconciliation.difference)} (${reconciliation.status})`
                  : 'Pendiente confirmación de saldos.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Report Document (Previsualización de Liquidación Semanal) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6 text-slate-800">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              VIAJA CON ADRI S.A.S.
            </h1>
            <p className="text-xs text-slate-600">
              NIT 901.458.721-3 • Registro Nacional de Turismo • Bogotá D.C., Colombia
            </p>
            <p className="text-xs font-semibold text-cyan-800 mt-1 uppercase tracking-wider">
              PLANILLA DE LEGALIZACIÓN Y RENDICIÓN DE CUENTAS DE CAJA MENOR
            </p>
          </div>

          <div className="text-left md:text-right text-xs space-y-0.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div><strong>Semana:</strong> N° {currentWeekNumber} ({currentYear})</div>
            <div><strong>Corte:</strong> Viernes, 30 de Octubre de 2026</div>
            <div><strong>Custodio:</strong> {fund.responsibleName}</div>
            <div><strong>Revisor:</strong> {fund.accountantName}</div>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fondo Fijo</span>
            <span className="text-base font-bold text-slate-900">{formatCOP(fund.fixedFundAmount)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Gastos</span>
            <span className="text-base font-bold text-rose-600">{formatCOP(totalExpenses)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Saldo Disponible</span>
            <span className="text-base font-bold text-emerald-600">{formatCOP(theoreticalBalance)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">% Ejecutado</span>
            <span className="text-base font-bold text-slate-800">{spentPercent}%</span>
          </div>
        </div>

        {/* Table of Movements */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-900 text-white text-[11px]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Concepto</th>
                <th className="py-2.5 px-3">Responsable</th>
                <th className="py-2.5 px-3">Proveedor / NIT</th>
                <th className="py-2.5 px-3">Soporte</th>
                <th className="py-2.5 px-3 text-right">Valor COP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((e, idx) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2 px-3 whitespace-nowrap text-slate-600">{e.date}</td>
                  <td className="py-2 px-3 font-medium text-slate-900">{e.description}</td>
                  <td className="py-2 px-3 whitespace-nowrap text-slate-700">{e.responsiblePerson}</td>
                  <td className="py-2 px-3 text-slate-600">{e.providerName}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className="font-mono text-[11px] text-slate-800">{e.supportNumber}</span>
                    <span className={`block text-[10px] font-semibold ${
                      e.supportStatus === 'VERIFICADO' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {e.supportType === 'FACTURA_ELECTRONICA' ? 'Factura Electrónica' : 'Doc. Soporte DIAN'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                    {formatCOP(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-bold border-t border-slate-200">
              <tr>
                <td colSpan={6} className="py-2.5 px-3 text-right text-slate-700">
                  TOTAL GASTOS DE LA SEMANA A REEMBOLSAR:
                </td>
                <td className="py-2.5 px-3 text-right text-rose-600 text-sm">
                  {formatCOP(totalExpenses)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Arqueo Summary in report */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-900 block">Arqueo Físico en Custodia</span>
            <span className="text-slate-600">
              {reconciliation 
                ? `Total contado: ${formatCOP(reconciliation.countedBalance)} • Diferencia: ${formatCOP(reconciliation.difference)} (${reconciliation.status})` 
                : 'Arqueo físico no registrado en el sistema.'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Fecha de entrega formal: Cada viernes al cierre laboral
          </span>
        </div>

        {/* Legal Certification Statement */}
        <div className="p-3 bg-slate-100/70 rounded-xl text-[11px] text-slate-600 border border-slate-200">
          <p className="font-semibold text-slate-800 mb-0.5">Certificación Contable y Tributaria (Colombia):</p>
          <p>
            Certifico que los gastos aquí relacionados corresponden a compras y servicios estrictamente necesarios y urgentes para la operatividad de la agencia de viajes <strong>VIAJA CON ADRI S.A.S.</strong>, y que sus soportes físicos y electrónicos se encuentran a disposición del área contable para su archivo legal conforme con los Artículos 615 y 771-2 del Estatuto Tributario y la Resolución DIAN 000167 de 2021.
          </p>
        </div>

        {/* Signatures Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-xs">
          <div className="text-center">
            <div className="h-10 border-b border-slate-400 mb-2 flex items-end justify-center pb-1 font-serif italic text-slate-600">
              {fund.responsibleName}
            </div>
            <strong className="block text-slate-900">{fund.responsibleName}</strong>
            <span className="text-slate-500 text-[11px]">{fund.responsibleRole}</span>
          </div>

          <div className="text-center">
            <div className="h-10 border-b border-slate-400 mb-2 flex items-end justify-center pb-1 font-serif italic text-slate-600">
              {fund.accountantName}
            </div>
            <strong className="block text-slate-900">{fund.accountantName}</strong>
            <span className="text-slate-500 text-[11px]">Contador Público (T.P. 184521-T)</span>
          </div>

          <div className="text-center">
            <div className="h-10 border-b border-slate-400 mb-2 flex items-end justify-center pb-1 font-serif italic text-slate-600">
              Adriana Morales
            </div>
            <strong className="block text-slate-900">Adriana Morales</strong>
            <span className="text-slate-500 text-[11px]">Gerente General / Aprobador</span>
          </div>
        </div>

        {/* Final Delivery Action Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {deliveryStatus === 'ENTREGADO' ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Informe entregado a contabilidad el {deliveredAt}
              </span>
            ) : (
              <span>Estado: <strong className="text-slate-700">Listo para entrega de viernes</strong></span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Imprimir Planilla
            </button>

            {deliveryStatus !== 'ENTREGADO' ? (
              <button
                onClick={handleMarkAsDelivered}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                Marcar como Entregado a Contabilidad
              </button>
            ) : (
              <span className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-xl border border-emerald-300">
                ✅ Radicado Exitosamente
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

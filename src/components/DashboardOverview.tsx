import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Trash2, 
  Edit3, 
  FileCheck, 
  Eye, 
  Download, 
  HelpCircle,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { Expense, PettyCashFund, ExpenseCategory, Department, SupportStatus } from '../types/cajaMenor';
import { formatCOP } from '../services/storageService';

interface DashboardOverviewProps {
  fund: PettyCashFund;
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onGoToReconciliation: () => void;
  onGoToWeeklyReport: () => void;
  onGoToRegulations: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  fund,
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onGoToReconciliation,
  onGoToWeeklyReport,
  onGoToRegulations,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedExpenseForDetail, setSelectedExpenseForDetail] = useState<Expense | null>(null);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const availableBalance = fund.fixedFundAmount - totalExpenses;
  const spentPercent = Math.min(100, Math.round((totalExpenses / fund.fixedFundAmount) * 100));

  const verifiedCount = expenses.filter(e => e.supportStatus === 'VERIFICADO').length;
  const pendingCount = expenses.filter(e => e.supportStatus === 'PENDIENTE').length;
  const observedCount = expenses.filter(e => e.supportStatus === 'OBSERVADO').length;
  const hasIssues = pendingCount > 0 || observedCount > 0;

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = 
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.supportNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchesDept = departmentFilter === 'ALL' || e.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || e.supportStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesDept && matchesStatus;
  });

  const getCategoryLabel = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'PAPELERIA_UTILES': return 'Papelería y Útiles';
      case 'TRANSPORTE_TAXIS': return 'Transporte / Taxis';
      case 'ASEO_CAFETERIA': return 'Aseo y Cafetería';
      case 'REPARACIONES_LOCATIVAS': return 'Reparaciones Menores';
      case 'ENVIOS_MENSAJERIA': return 'Mensajería y Envíos';
      case 'REFRIGERIOS_CLIENTES': return 'Atención a Clientes';
      case 'TRAMITES_CONSOLARES': return 'Trámites Consulares';
      case 'IMPREVISTOS': return 'Imprevistos Operativos';
      default: return cat;
    }
  };

  const getDeptLabel = (dept: Department) => {
    switch (dept) {
      case 'OPERACIONES_TURISTICAS': return 'Operaciones Turísticas';
      case 'MOSTRADOR_VENTAS': return 'Mostrador y Ventas';
      case 'ADMINISTRACION_FINANZAS': return 'Administración y Finanzas';
      case 'MARKETING_DIGITAL': return 'Marketing Digital';
      case 'GERENCIA': return 'Gerencia General';
      default: return dept;
    }
  };

  const getSupportBadge = (status: SupportStatus) => {
    switch (status) {
      case 'VERIFICADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verificado
          </span>
        );
      case 'OBSERVADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Con Observación
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
            <Clock className="w-3 h-3 text-rose-600" /> Pendiente Soporte
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Friday Submission & Health Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        hasIssues 
          ? 'bg-amber-50/90 border-amber-300 text-amber-900' 
          : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${hasIssues ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'}`}>
            {hasIssues ? <AlertTriangle className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="font-semibold text-sm">
              {hasIssues 
                ? 'Atención para el Informe de Viernes a Contabilidad' 
                : 'Caja Menor al día para entrega de Viernes'}
            </h2>
            <p className="text-xs mt-0.5 opacity-90">
              {hasIssues 
                ? `Existen ${pendingCount + observedCount} gasto(s) sin soporte completo o con observaciones DIAN. Se deben subsanar antes de entregar el informe semanal a ${fund.accountantName}.`
                : `Todos los soportes (${verifiedCount}) están verificados conforme a la normativa colombiana (DIAN). Listo para exportar informe en Excel o PDF.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onGoToRegulations}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 font-medium transition"
          >
            Revisar Normativa DIAN
          </button>
          <button
            onClick={onGoToWeeklyReport}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition"
          >
            Ver Informe de Viernes
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fondo Fijo Total */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Fondo Asignado</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCOP(fund.fixedFundAmount)}</div>
          <p className="text-xs text-slate-500 mt-1">Custodia: <span className="font-medium text-slate-700">{fund.responsibleName}</span></p>
          <div className="mt-3 text-[11px] text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
            Tope máx. por compra: <strong className="text-slate-600">{formatCOP(fund.maxExpensePerReceipt)}</strong>
          </div>
        </div>

        {/* Total Gastos */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Gastado</span>
            <Receipt className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{formatCOP(totalExpenses)}</div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>{expenses.length} movimientos</span>
            <span className="font-semibold text-slate-700">{spentPercent}% del fondo</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                spentPercent >= fund.reimbursementThresholdPercent ? 'bg-amber-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${spentPercent}%` }}
            />
          </div>
        </div>

        {/* Saldo Disponible en Efectivo */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Disponible</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className={`text-2xl font-bold ${availableBalance < fund.fixedFundAmount * 0.3 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {formatCOP(availableBalance)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {spentPercent >= fund.reimbursementThresholdPercent ? (
              <span className="text-amber-600 font-semibold">⚠️ Requiere tramitar reembolso</span>
            ) : (
              <span className="text-emerald-700 font-medium">Capacidad operativa óptima</span>
            )}
          </p>
          <button 
            onClick={onGoToReconciliation}
            className="mt-3 w-full text-center text-[11px] font-semibold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100/80 py-1 rounded-md transition"
          >
            Hacer Arqueo Físico de Billetes →
          </button>
        </div>

        {/* Verificación de Soportes */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Control de Soportes</span>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{verifiedCount}</span>
            <span className="text-xs text-slate-500">de {expenses.length} válidos</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="text-emerald-600 font-medium">{verifiedCount} OK</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 font-medium">{observedCount} Observ.</span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600 font-medium">{pendingCount} Pend.</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md flex items-center justify-between">
            <span>Estatuto Trib. Art. 771-2</span>
            <span className="font-semibold text-slate-700">DIAN</span>
          </div>
        </div>
      </div>

      {/* Main Expense Table Header & Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-600" />
              Movimientos de Caja Menor - Semana Actual
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro obligatorio de cada desembolso con fecha, concepto, valor en COP, responsable y soporte legalizable.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddExpense}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-cyan-600/30 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Registrar Gasto
            </button>
            <button
              onClick={onGoToWeeklyReport}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Informe Viernes
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por concepto, responsable, proveedor, # factura..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Filter Category */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="PAPELERIA_UTILES">Papelería y Útiles</option>
              <option value="TRANSPORTE_TAXIS">Transporte / Taxis</option>
              <option value="ASEO_CAFETERIA">Aseo y Cafetería</option>
              <option value="REPARACIONES_LOCATIVAS">Reparaciones Menores</option>
              <option value="ENVIOS_MENSAJERIA">Mensajería y Envíos</option>
              <option value="REFRIGERIOS_CLIENTES">Atención a Clientes</option>
              <option value="IMPREVISTOS">Imprevistos</option>
            </select>

            {/* Filter Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="VERIFICADO">Soporte Verificado</option>
              <option value="OBSERVADO">Con Observación</option>
              <option value="PENDIENTE">Soporte Pendiente</option>
            </select>

            {/* Filter Dept */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="ALL">Todas las Áreas</option>
              <option value="OPERACIONES_TURISTICAS">Operaciones</option>
              <option value="MOSTRADOR_VENTAS">Ventas</option>
              <option value="ADMINISTRACION_FINANZAS">Administración</option>
            </select>
          </div>
        </div>

        {/* Expenses List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Concepto / Justificación</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Responsable / Área</th>
                <th className="py-3 px-4">Tipo Soporte & N°</th>
                <th className="py-3 px-4 text-right">Valor (COP)</th>
                <th className="py-3 px-4 text-center">Estado Soporte</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    No se encontraron gastos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-medium">
                      {expense.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 max-w-xs line-clamp-2">
                        {expense.description}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{expense.providerName}</span>
                        {expense.providerNit && (
                          <>
                            <span>•</span>
                            <span>{expense.providerNit}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{expense.responsiblePerson}</div>
                      <div className="text-[10px] text-slate-400">{getDeptLabel(expense.department)}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-mono text-[11px]">
                        {expense.supportNumber || 'Sin consecutivo'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {expense.supportType === 'FACTURA_ELECTRONICA' && 'Factura Electrónica (DIAN)'}
                        {expense.supportType === 'DOCUMENTO_SOPORTE_DIAN' && 'Doc. Soporte Electrónico Res. 167'}
                        {expense.supportType === 'RECIBO_CAJA_MENOR' && 'Recibo de Caja Menor'}
                        {expense.supportType === 'TIQUETE_POS' && 'Tiquete POS / Guía'}
                        {expense.supportType === 'SIN_SOPORTE' && '⚠️ Sin Soporte (Inadmisible)'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatCOP(expense.amount)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {getSupportBadge(expense.supportStatus)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedExpenseForDetail(expense)}
                          title="Ver detalle y soporte"
                          className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditExpense(expense)}
                          title="Editar gasto"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          title="Eliminar gasto"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer with Summary */}
            <tfoot className="bg-slate-50/80 border-t border-slate-200 text-xs font-semibold text-slate-700">
              <tr>
                <td colSpan={5} className="py-3.5 px-4 text-right text-slate-600">
                  Total Gastos Filtrados ({filteredExpenses.length} items):
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-rose-600 text-sm">
                  {formatCOP(filteredExpenses.reduce((s, e) => s + e.amount, 0))}
                </td>
                <td colSpan={2} className="py-3.5 px-4 text-slate-400 text-[11px] text-right">
                  Saldo en Caja: <strong className="text-emerald-600 font-bold">{formatCOP(availableBalance)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Expense Detail Modal */}
      {selectedExpenseForDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
                  Detalle del Gasto & Soporte
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {selectedExpenseForDetail.supportNumber || 'Comprobante de Caja'}
                </h4>
              </div>
              <button
                onClick={() => setSelectedExpenseForDetail(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Concepto</label>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedExpenseForDetail.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Valor Total</span>
                  <span className="text-base font-bold text-slate-900">{formatCOP(selectedExpenseForDetail.amount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Fecha</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedExpenseForDetail.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Responsable</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedExpenseForDetail.responsiblePerson}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Dependencia</span>
                  <span className="text-xs font-semibold text-slate-800">{getDeptLabel(selectedExpenseForDetail.department)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Proveedor:</span>
                  <span className="font-semibold text-slate-800">{selectedExpenseForDetail.providerName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">NIT / Identificación:</span>
                  <span className="font-semibold text-slate-800">{selectedExpenseForDetail.providerNit || 'Sin registrar'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Tipo de Soporte Fiscal:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedExpenseForDetail.supportType.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Estado del Soporte:</span>
                  <div>{getSupportBadge(selectedExpenseForDetail.supportStatus)}</div>
                </div>
              </div>

              {selectedExpenseForDetail.observations && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-semibold text-amber-900 block mb-0.5">Observaciones Contables:</span>
                  <p className="text-amber-800">{selectedExpenseForDetail.observations}</p>
                </div>
              )}

              {selectedExpenseForDetail.attachmentName && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Receipt className="w-4 h-4 text-cyan-600" />
                    <span className="font-mono text-[11px]">{selectedExpenseForDetail.attachmentName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Adjunto en legajador
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedExpenseForDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

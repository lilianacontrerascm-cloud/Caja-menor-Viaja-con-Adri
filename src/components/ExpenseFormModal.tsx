import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  AlertTriangle, 
  Receipt, 
  Paperclip, 
  CheckCircle2, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { 
  Expense, 
  PettyCashFund, 
  ExpenseCategory, 
  Department, 
  SupportType, 
  SupportStatus 
} from '../types/cajaMenor';
import { formatCOP } from '../services/storageService';

interface ExpenseFormModalProps {
  fund: PettyCashFund;
  expenseToEdit?: Expense | null;
  onSave: (expenseData: Omit<Expense, 'id' | 'createdAt'>, id?: string) => void;
  onClose: () => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  fund,
  expenseToEdit,
  onSave,
  onClose,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('PAPELERIA_UTILES');
  const [amount, setAmount] = useState<number | ''>('');
  const [responsiblePerson, setResponsiblePerson] = useState<string>(fund.responsibleName);
  const [department, setDepartment] = useState<Department>('OPERACIONES_TURISTICAS');
  const [supportType, setSupportType] = useState<SupportType>('FACTURA_ELECTRONICA');
  const [supportNumber, setSupportNumber] = useState<string>('');
  const [providerName, setProviderName] = useState<string>('');
  const [providerNit, setProviderNit] = useState<string>('');
  const [supportStatus, setSupportStatus] = useState<SupportStatus>('VERIFICADO');
  const [observations, setObservations] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');

  useEffect(() => {
    if (expenseToEdit) {
      setDate(expenseToEdit.date);
      setDescription(expenseToEdit.description);
      setCategory(expenseToEdit.category);
      setAmount(expenseToEdit.amount);
      setResponsiblePerson(expenseToEdit.responsiblePerson);
      setDepartment(expenseToEdit.department);
      setSupportType(expenseToEdit.supportType);
      setSupportNumber(expenseToEdit.supportNumber);
      setProviderName(expenseToEdit.providerName);
      setProviderNit(expenseToEdit.providerNit || '');
      setSupportStatus(expenseToEdit.supportStatus);
      setObservations(expenseToEdit.observations || '');
      setAttachmentName(expenseToEdit.attachmentName || '');
    }
  }, [expenseToEdit]);

  const numAmount = typeof amount === 'number' ? amount : 0;
  const exceedsMax = numAmount > fund.maxExpensePerReceipt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || numAmount <= 0 || !responsiblePerson) {
      alert('Por favor complete la descripción, el valor en pesos y el responsable.');
      return;
    }

    const payload: Omit<Expense, 'id' | 'createdAt'> = {
      date,
      description,
      category,
      amount: numAmount,
      responsiblePerson,
      department,
      supportType,
      supportNumber: supportNumber.trim() || 'S/N',
      providerName: providerName.trim() || 'Comercio Local',
      providerNit: providerNit.trim() || undefined,
      supportStatus: supportType === 'SIN_SOPORTE' ? 'PENDIENTE' : supportStatus,
      observations: observations.trim() || undefined,
      attachmentName: attachmentName.trim() || (supportType !== 'SIN_SOPORTE' ? `soporte_${Date.now().toString().slice(-4)}.pdf` : undefined),
      weekNumber: 43,
      weekYear: 2026,
    };

    onSave(payload, expenseToEdit ? expenseToEdit.id : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {expenseToEdit ? 'Modificar Gasto de Caja Menor' : 'Registrar Nuevo Gasto de Caja Menor'}
              </h3>
              <p className="text-xs text-slate-300">
                Viaja con Adri • Control administrativo y tributario (Colombia)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Warning Banner if amount exceeds receipt limit */}
          {exceedsMax && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[11px]">Tope Máximo Excedido ({formatCOP(fund.maxExpensePerReceipt)})</strong>
                <span>
                  El valor ingresado ({formatCOP(numAmount)}) supera el límite habitual autorizado por recibo para caja menor. Requiere visto bueno explícito de Gerencia General.
                </span>
              </div>
            </div>
          )}

          {/* Row 1: Fecha & Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Fecha del Gasto *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Categoría del Gasto *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-800 bg-white"
              >
                <option value="PAPELERIA_UTILES">Papelería y Útiles de Oficina</option>
                <option value="TRANSPORTE_TAXIS">Transporte Urgente / Taxis Autorizados</option>
                <option value="ASEO_CAFETERIA">Aseo, Limpieza y Cafetería</option>
                <option value="REPARACIONES_LOCATIVAS">Reparaciones Menores Locativas</option>
                <option value="ENVIOS_MENSAJERIA">Envíos de Documentos / Mensajería</option>
                <option value="REFRIGERIOS_CLIENTES">Atención y Refrigerios a Clientes VIP</option>
                <option value="TRAMITES_CONSOLARES">Trámites Consulares / Notaría</option>
                <option value="IMPREVISTOS">Otros Imprevistos Menores</option>
              </select>
            </div>
          </div>

          {/* Row 2: Descripción Detallada */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
              Concepto / Descripción del Gasto *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Resma de papel y carpetas para expedientes de visados..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-800 bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Describe claramente el destino del dinero para que sea fácilmente comprensible por contabilidad.
            </span>
          </div>

          {/* Row 3: Valor en COP & Responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Valor Total (Pesos Colombianos - COP) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  required
                  min="100"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej: 45000"
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-800 font-bold text-sm bg-white"
                />
              </div>
              {numAmount > 0 && (
                <span className="text-[10px] text-cyan-700 font-medium mt-1 block">
                  {formatCOP(numAmount)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Responsable del Desembolso *
              </label>
              <input
                type="text"
                required
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                placeholder="Nombre del colaborador"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-800 bg-white"
              />
            </div>
          </div>

          {/* Row 4: Dependencia */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
              Dependencia / Área Solicitante *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-800 bg-white"
            >
              <option value="OPERACIONES_TURISTICAS">Operaciones Turísticas</option>
              <option value="MOSTRADOR_VENTAS">Mostrador y Ventas</option>
              <option value="ADMINISTRACION_FINANZAS">Administración y Finanzas</option>
              <option value="MARKETING_DIGITAL">Marketing Digital y Publicidad</option>
              <option value="GERENCIA">Gerencia General</option>
            </select>
          </div>

          {/* Section: Soportes y Validez Fiscal DIAN */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-600" />
                Información Tributaria y Soporte Legal
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                Estatuto Trib. Art. 771-2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                  Tipo de Soporte Fiscal *
                </label>
                <select
                  value={supportType}
                  onChange={(e) => {
                    const newType = e.target.value as SupportType;
                    setSupportType(newType);
                    if (newType === 'SIN_SOPORTE') {
                      setSupportStatus('PENDIENTE');
                    }
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                >
                  <option value="FACTURA_ELECTRONICA">Factura Electrónica (con CUFE)</option>
                  <option value="DOCUMENTO_SOPORTE_DIAN">Documento Soporte Electrónico (Res. 167)</option>
                  <option value="TIQUETE_POS">Tiquete POS / Guía de Transporte</option>
                  <option value="RECIBO_CAJA_MENOR">Recibo / Vale Provisional de Caja</option>
                  <option value="SIN_SOPORTE">⚠️ Sin Soporte (Gasto observado)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                  Número de Soporte / Factura / CUFE
                </label>
                <input
                  type="text"
                  value={supportNumber}
                  onChange={(e) => setSupportNumber(e.target.value)}
                  placeholder="Ej: FE-10492 o DS-0145"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                  Nombre del Proveedor / Establecimiento
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="Ej: Éxito, Servientrega, Papelería San Victorino..."
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                  NIT o Cédula del Proveedor
                </label>
                <input
                  type="text"
                  value={providerNit}
                  onChange={(e) => setProviderNit(e.target.value)}
                  placeholder="Ej: 900.123.456-7 o C.C. 19.458.201"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                />
              </div>
            </div>

            {/* Support Status */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                Estado de Verificación del Soporte
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSupportStatus('VERIFICADO')}
                  className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                    supportStatus === 'VERIFICADO'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verificado OK</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSupportStatus('OBSERVADO')}
                  className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                    supportStatus === 'OBSERVADO'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Con Observación</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSupportStatus('PENDIENTE')}
                  className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                    supportStatus === 'PENDIENTE'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Soporte Pendiente</span>
                </button>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
              Observaciones Contables / Notas Adicionales
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ej: Se solicitó copia de RUT al proveedor para emitir documento soporte electrónico..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-800 bg-white"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              {expenseToEdit ? 'Actualizar Gasto' : 'Guardar en Caja Menor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Save, Settings, Building2, User, Mail, DollarSign } from 'lucide-react';
import { PettyCashFund } from '../types/cajaMenor';
import { formatCOP } from '../services/storageService';

interface FundSettingsModalProps {
  fund: PettyCashFund;
  onSave: (fund: PettyCashFund) => void;
  onClose: () => void;
}

export const FundSettingsModal: React.FC<FundSettingsModalProps> = ({
  fund,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<PettyCashFund>({ ...fund });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center">
              <Settings className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configuración del Fondo Fijo</h3>
              <p className="text-xs text-slate-300">VIAJA CON ADRI • Parámetros de Operación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Montos y Topes */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
              Parámetros Financieros (COP)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Monto Fondo Fijo Total *
                </label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={formData.fixedFundAmount}
                  onChange={(e) => setFormData({ ...formData, fixedFundAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-cyan-700 block mt-0.5">{formatCOP(formData.fixedFundAmount)}</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Tope Máx. por Recibo *
                </label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={formData.maxExpensePerReceipt}
                  onChange={(e) => setFormData({ ...formData, maxExpensePerReceipt: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-cyan-700 block mt-0.5">{formatCOP(formData.maxExpensePerReceipt)}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Umbral para Alerta de Reembolso (% de Gasto)
              </label>
              <input
                type="number"
                min="10"
                max="95"
                required
                value={formData.reimbursementThresholdPercent}
                onChange={(e) => setFormData({ ...formData, reimbursementThresholdPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Al llegar a este porcentaje de gasto, el sistema solicitará formalmente la reposición del dinero.
              </span>
            </div>
          </div>

          {/* Responsables */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
              Custodia y Responsables
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Custodio Titular de Caja *
                </label>
                <input
                  type="text"
                  required
                  value={formData.responsibleName}
                  onChange={(e) => setFormData({ ...formData, responsibleName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Cargo del Custodio
                </label>
                <input
                  type="text"
                  value={formData.responsibleRole}
                  onChange={(e) => setFormData({ ...formData, responsibleRole: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Contador Público Revisor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountantName}
                  onChange={(e) => setFormData({ ...formData, accountantName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Correo de Contabilidad para Envíos de Viernes
                </label>
                <input
                  type="email"
                  value={formData.accountantEmail}
                  onChange={(e) => setFormData({ ...formData, accountantEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

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
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

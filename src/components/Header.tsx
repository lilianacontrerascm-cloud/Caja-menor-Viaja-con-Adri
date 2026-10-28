import React from 'react';
import { 
  Building2, 
  Coins, 
  CalendarCheck, 
  FileText, 
  HelpCircle, 
  GitFork, 
  Settings, 
  AlertTriangle,
  RotateCcw,
  Plane
} from 'lucide-react';
import { PettyCashFund, Expense } from '../types/cajaMenor';
import { formatCOP } from '../services/storageService';

interface HeaderProps {
  fund: PettyCashFund;
  expenses: Expense[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fund,
  expenses,
  activeTab,
  setActiveTab,
  onOpenSettings,
  onResetDemo,
}) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const availableBalance = fund.fixedFundAmount - totalExpenses;
  const spentPercent = Math.min(100, Math.round((totalExpenses / fund.fixedFundAmount) * 100));
  const pendingSupports = expenses.filter(e => e.supportStatus !== 'VERIFICADO').length;

  const tabs = [
    { id: 'dashboard', label: 'Tablero & Gastos', icon: Building2 },
    { id: 'reconciliation', label: 'Arqueo de Efectivo', icon: Coins },
    { id: 'weekly-report', label: 'Informe Viernes (Excel/PDF)', icon: CalendarCheck, badge: pendingSupports > 0 ? pendingSupports : undefined },
    { id: 'flowchart', label: 'Flujograma (10 Pasos)', icon: GitFork },
    { id: 'regulations', label: 'Normatividad Colombia', icon: FileText },
    { id: 'assistant', label: 'Asistente Contable', icon: HelpCircle },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-30 border-b border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand Info */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-2 ring-white/10">
              <Plane className="w-6 h-6 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  VIAJA CON ADRI
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    Caja Menor
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>NIT: {fund.nit}</span>
                <span>•</span>
                <span>Agencia de Viajes y Turismo</span>
                <span>•</span>
                <span className="text-slate-400">Bogotá D.C., Colombia</span>
              </p>
            </div>
          </div>

          {/* Key Metrics Header Badges */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Balance Badge */}
            <div className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2.5">
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                  Saldo en Efectivo
                </span>
                <span className={`text-sm font-bold ${availableBalance < fund.fixedFundAmount * 0.3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {formatCOP(availableBalance)}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-700/60 flex items-center justify-center">
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Spent & Threshold alert */}
            <div className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                  Consumo ({spentPercent}%)
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {spentPercent >= fund.reimbursementThresholdPercent ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 inline" /> Reembolso sugerido
                    </span>
                  ) : (
                    <span className="text-slate-300">{formatCOP(totalExpenses)} gastado</span>
                  )}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenSettings}
                title="Configuración de Fondo y Responsables"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={onResetDemo}
                title="Restablecer Datos de Ejemplo"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="mt-4 flex space-x-1 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-900">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

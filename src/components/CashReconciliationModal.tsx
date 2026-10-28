import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  Banknote, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Save, 
  FileCheck, 
  Sparkles,
  Info,
  Calendar,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PettyCashFund, Expense, DenominationCount, CashReconciliation } from '../types/cajaMenor';
import { formatCOP } from '../services/storageService';

interface CashReconciliationModalProps {
  fund: PettyCashFund;
  expenses: Expense[];
  onSaveReconciliation: (recon: CashReconciliation) => void;
  savedReconciliations: CashReconciliation[];
}

export const CashReconciliationModal: React.FC<CashReconciliationModalProps> = ({
  fund,
  expenses,
  onSaveReconciliation,
  savedReconciliations,
}) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const theoreticalBalance = fund.fixedFundAmount - totalExpenses;

  // Bills state
  const [bills, setBills] = useState<{ [key: number]: number }>({
    100000: 5,
    50000: 3,
    20000: 3,
    10000: 3,
    5000: 2,
    2000: 1,
  });

  // Coins state
  const [coins, setCoins] = useState<{ [key: number]: number }>({
    1000: 2,
    500: 3,
    200: 4,
    100: 3,
    50: 0,
  });

  const [auditorName, setAuditorName] = useState<string>(fund.accountantName);
  const [notes, setNotes] = useState<string>('Arqueo ordinario de viernes. Verificación física de billetes y monedas en custodia de caja menor.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Bill & coin values
  const totalBills = useMemo(() => {
    return Object.entries(bills).reduce((sum, [denom, count]) => sum + (Number(denom) * count), 0);
  }, [bills]);

  const totalCoins = useMemo(() => {
    return Object.entries(coins).reduce((sum, [denom, count]) => sum + (Number(denom) * count), 0);
  }, [coins]);

  const totalCounted = totalBills + totalCoins;
  const difference = totalCounted - theoreticalBalance;

  let status: 'CUADRADO' | 'FALTANTE' | 'SOBRANTE' = 'CUADRADO';
  if (difference < 0) status = 'FALTANTE';
  if (difference > 0) status = 'SOBRANTE';

  const handleBillChange = (denom: number, val: number) => {
    setBills(prev => ({ ...prev, [denom]: Math.max(0, val || 0) }));
  };

  const handleCoinChange = (denom: number, val: number) => {
    setCoins(prev => ({ ...prev, [denom]: Math.max(0, val || 0) }));
  };

  // Helper to auto-balance denominations exactly to theoretical balance
  const autoBalanceExact = () => {
    let remainder = theoreticalBalance;
    const newBills: { [key: number]: number } = { 100000: 0, 50000: 0, 20000: 0, 10000: 0, 5000: 0, 2000: 0 };
    const newCoins: { [key: number]: number } = { 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0 };

    const billDenoms = [100000, 50000, 20000, 10000, 5000, 2000];
    billDenoms.forEach(d => {
      if (remainder >= d) {
        const count = Math.floor(remainder / d);
        newBills[d] = count;
        remainder -= count * d;
      }
    });

    const coinDenoms = [1000, 500, 200, 100, 50];
    coinDenoms.forEach(d => {
      if (remainder >= d) {
        const count = Math.floor(remainder / d);
        newCoins[d] = count;
        remainder -= count * d;
      }
    });

    setBills(newBills);
    setCoins(newCoins);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleSave = () => {
    const recon: CashReconciliation = {
      id: `recon-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      theoreticalBalance,
      countedBalance: totalCounted,
      difference,
      status,
      denominations: {
        bills: bills as DenominationCount['bills'],
        coins: coins as DenominationCount['coins']
      },
      responsibleName: fund.responsibleName,
      auditorName,
      notes,
    };

    onSaveReconciliation(recon);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);

    if (difference === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Paso 9 del Procedimiento • Control de Viernes
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Coins className="w-6 h-6 text-cyan-400" />
              Arqueo Físico y Conciliación de Efectivo
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Conteo minucioso de billetes y monedas en pesos colombianos bajo custodia de <strong>{fund.responsibleName}</strong>. 
              Garantiza la correspondencia exacta entre el dinero físico disponible y los registros en libros de VIAJA CON ADRI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={autoBalanceExact}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-medium rounded-xl transition shadow-sm"
              title="Calcular distribución exacta para cuadrar la caja"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Distribuir Efectivo Exacto
            </button>
          </div>
        </div>
      </div>

      {/* Summary Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Saldo en Libros */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Saldo Teórico en Libros
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCOP(theoreticalBalance)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fondo: {formatCOP(fund.fixedFundAmount)} - Gastos: {formatCOP(totalExpenses)}
          </p>
        </div>

        {/* Efectivo Contado */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Efectivo Físico Contado
          </span>
          <div className="text-2xl font-bold text-cyan-700 mt-1">
            {formatCOP(totalCounted)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Billetes: {formatCOP(totalBills)} + Monedas: {formatCOP(totalCoins)}
          </p>
        </div>

        {/* Diferencia */}
        <div className={`p-5 rounded-2xl border shadow-sm ${
          difference === 0 
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' 
            : difference < 0 
            ? 'bg-rose-50/90 border-rose-300 text-rose-950'
            : 'bg-blue-50/90 border-blue-300 text-blue-950'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Diferencia del Arqueo
            </span>
            {difference === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : difference < 0 ? (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div className="text-2xl font-bold mt-1">
            {difference === 0 ? '$ 0 (Cuadrada)' : formatCOP(difference)}
          </div>
          <p className="text-xs mt-1 font-medium">
            {difference === 0 && '✅ Caja perfectamente cuadrada. Sin faltantes ni sobrantes.'}
            {difference < 0 && `⚠️ Faltante de ${formatCOP(Math.abs(difference))}. Requiere justificación o reposición por el custodio.`}
            {difference > 0 && `ℹ️ Sobrante de ${formatCOP(difference)}. Registrar como ingreso para legalización.`}
          </p>
        </div>
      </div>

      {/* Denominations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billetes Colombianos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Billetes en Efectivo (COP)
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Total Billetes: {formatCOP(totalBills)}
            </span>
          </div>

          <div className="p-4 divide-y divide-slate-100 text-xs">
            {[100000, 50000, 20000, 10000, 5000, 2000].map((denom) => (
              <div key={denom} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 w-36">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                    $
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      {formatCOP(denom)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {denom === 100000 && 'Carlos Lleras'}
                      {denom === 50000 && 'Gabo'}
                      {denom === 20000 && 'Alfonso López'}
                      {denom === 10000 && 'Virginia G.'}
                      {denom === 5000 && 'José A. Silva'}
                      {denom === 2000 && 'Débora Arango'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBillChange(denom, (bills[denom] || 0) - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={bills[denom] ?? 0}
                    onChange={(e) => handleBillChange(denom, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-center font-bold text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleBillChange(denom, (bills[denom] || 0) + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right font-bold text-slate-800">
                  {formatCOP((bills[denom] || 0) * denom)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monedas Colombianas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              Monedas en Efectivo (COP)
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Total Monedas: {formatCOP(totalCoins)}
            </span>
          </div>

          <div className="p-4 divide-y divide-slate-100 text-xs">
            {[1000, 500, 200, 100, 50].map((denom) => (
              <div key={denom} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 w-36">
                  <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                    ¢
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      {formatCOP(denom)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {denom === 1000 && 'Tortuga caguama'}
                      {denom === 500 && 'Rana de cristal'}
                      {denom === 200 && 'Guacamaya'}
                      {denom === 100 && 'Frailejón'}
                      {denom === 50 && 'Oso de anteojos'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCoinChange(denom, (coins[denom] || 0) - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={coins[denom] ?? 0}
                    onChange={(e) => handleCoinChange(denom, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-center font-bold text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleCoinChange(denom, (coins[denom] || 0) + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right font-bold text-slate-800">
                  {formatCOP((coins[denom] || 0) * denom)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acta de Arqueo y Formalización */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-cyan-600" />
          Formalización del Arqueo y Acta de Cierre
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
              Custodio Responsable
            </label>
            <input
              type="text"
              readOnly
              value={`${fund.responsibleName} (${fund.responsibleRole})`}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
              Auditor / Revisor Contable *
            </label>
            <input
              type="text"
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              placeholder="Nombre del contador o auditor que realiza el arqueo"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
            Justificación / Notas de Novedad del Arqueo
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Si existió diferencia o justificación de algún vale provisional..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ¡Acta de arqueo guardada exitosamente! Se incorporará al informe semanal de entrega de los viernes.
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <Save className="w-4 h-4" />
            Guardar Acta de Arqueo
          </button>
        </div>
      </div>

      {/* Historical Arqueos */}
      {savedReconciliations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Historial Reciente de Arqueos
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            {savedReconciliations.map((rec) => (
              <div key={rec.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">{rec.date}</span>
                  <span className="text-slate-400 ml-2">Revisado por: {rec.auditorName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-medium">Contado: {formatCOP(rec.countedBalance)}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    rec.difference === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rec.status} ({formatCOP(rec.difference)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

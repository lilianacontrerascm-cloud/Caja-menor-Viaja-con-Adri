import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { CashReconciliationModal } from './components/CashReconciliationModal';
import { WeeklyReportView } from './components/WeeklyReportView';
import { NormativeGuideModal } from './components/NormativeGuideModal';
import { ProcessFlowchartModal } from './components/ProcessFlowchartModal';
import { AssistantAdvisor } from './components/AssistantAdvisor';
import { FundSettingsModal } from './components/FundSettingsModal';
import { 
  PettyCashFund, 
  Expense, 
  CashReconciliation 
} from './types/cajaMenor';
import { 
  getFundSettings, 
  saveFundSettings, 
  getExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense,
  getReconciliations,
  saveReconciliation,
  resetToDemoData,
  formatCOP
} from './services/storageService';

export default function App() {
  const [fund, setFund] = useState<PettyCashFund>(getFundSettings);
  const [expenses, setExpenses] = useState<Expense[]>(getExpenses);
  const [reconciliations, setReconciliations] = useState<CashReconciliation[]>(getReconciliations);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const latestReconciliation = reconciliations.length > 0 ? reconciliations[0] : null;

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (data: Omit<Expense, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      const updated = updateExpense(id, data);
      setExpenses(updated);
      showToast('Gasto actualizado correctamente.');
    } else {
      addExpense(data);
      setExpenses(getExpenses());
      showToast('Nuevo gasto registrado con éxito.');
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('¿Está seguro de eliminar este gasto de la caja menor?')) {
      const updated = deleteExpense(id);
      setExpenses(updated);
      showToast('Gasto eliminado de la caja menor.');
    }
  };

  const handleSaveReconciliation = (recon: CashReconciliation) => {
    saveReconciliation(recon);
    setReconciliations(getReconciliations());
    showToast(`Arqueo guardado: ${recon.status} (${formatCOP(recon.difference)})`);
  };

  const handleSaveFund = (newFund: PettyCashFund) => {
    saveFundSettings(newFund);
    setFund(newFund);
    showToast('Configuración del fondo actualizada.');
  };

  const handleResetDemo = () => {
    if (confirm('¿Desea restablecer los datos de ejemplo de VIAJA CON ADRI?')) {
      resetToDemoData();
      setFund(getFundSettings());
      setExpenses(getExpenses());
      setReconciliations(getReconciliations());
      showToast('Datos de ejemplo restablecidos.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          {toastMessage}
        </div>
      )}

      {/* Main Header */}
      <Header
        fund={fund}
        expenses={expenses}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            fund={fund}
            expenses={expenses}
            onAddExpense={handleOpenAddExpense}
            onEditExpense={handleOpenEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onGoToReconciliation={() => setActiveTab('reconciliation')}
            onGoToWeeklyReport={() => setActiveTab('weekly-report')}
            onGoToRegulations={() => setActiveTab('regulations')}
          />
        )}

        {activeTab === 'reconciliation' && (
          <CashReconciliationModal
            fund={fund}
            expenses={expenses}
            savedReconciliations={reconciliations}
            onSaveReconciliation={handleSaveReconciliation}
          />
        )}

        {activeTab === 'weekly-report' && (
          <WeeklyReportView
            fund={fund}
            expenses={expenses}
            reconciliation={latestReconciliation}
            onGoToReconciliation={() => setActiveTab('reconciliation')}
            onGoToExpenses={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'flowchart' && <ProcessFlowchartModal />}

        {activeTab === 'regulations' && <NormativeGuideModal />}

        {activeTab === 'assistant' && (
          <AssistantAdvisor
            fund={fund}
            expenses={expenses}
            reconciliation={latestReconciliation}
            onGoToExpenses={() => setActiveTab('dashboard')}
            onGoToReconciliation={() => setActiveTab('reconciliation')}
            onGoToWeeklyReport={() => setActiveTab('weekly-report')}
          />
        )}
      </main>

      {/* Modals */}
      {isExpenseModalOpen && (
        <ExpenseFormModal
          fund={fund}
          expenseToEdit={editingExpense}
          onSave={handleSaveExpense}
          onClose={() => {
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
          }}
        />
      )}

      {isSettingsModalOpen && (
        <FundSettingsModal
          fund={fund}
          onSave={handleSaveFund}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {/* App Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">VIAJA CON ADRI S.A.S.</span>
            <span>•</span>
            <span>NIT 901.458.721-3</span>
            <span>•</span>
            <span>Sistema Administrativo y Contable de Caja Menor</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Conforme a DIAN (Estatuto Tributario Arts. 615 / 771-2 & Res. 000167/2021) • Entrega Semanal los Viernes
          </div>
        </div>
      </footer>
    </div>
  );
}

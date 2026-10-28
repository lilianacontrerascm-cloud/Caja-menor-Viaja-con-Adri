export type SupportType = 
  | 'FACTURA_ELECTRONICA' 
  | 'DOCUMENTO_SOPORTE_DIAN' 
  | 'RECIBO_CAJA_MENOR' 
  | 'TIQUETE_POS' 
  | 'SIN_SOPORTE';

export type SupportStatus = 'VERIFICADO' | 'PENDIENTE' | 'OBSERVADO';

export type ExpenseCategory = 
  | 'PAPELERIA_UTILES'
  | 'TRANSPORTE_TAXIS'
  | 'ASEO_CAFETERIA'
  | 'REPARACIONES_LOCATIVAS'
  | 'ENVIOS_MENSAJERIA'
  | 'REFRIGERIOS_CLIENTES'
  | 'TRAMITES_CONSOLARES'
  | 'IMPREVISTOS';

export type Department = 
  | 'OPERACIONES_TURISTICAS'
  | 'MOSTRADOR_VENTAS'
  | 'ADMINISTRACION_FINANZAS'
  | 'MARKETING_DIGITAL'
  | 'GERENCIA';

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: ExpenseCategory;
  amount: number; // In Colombian Pesos (COP)
  responsiblePerson: string;
  department: Department;
  supportType: SupportType;
  supportNumber: string; // Factura #, CUFE o número de comprobante
  providerName: string;
  providerNit?: string;
  supportStatus: SupportStatus;
  observations?: string;
  attachmentName?: string;
  weekNumber: number; // e.g. 43
  weekYear: number; // e.g. 2026
  createdAt: string;
}

export interface DenominationCount {
  bills: {
    100000: number;
    50000: number;
    20000: number;
    10000: number;
    5000: number;
    2000: number;
  };
  coins: {
    1000: number;
    500: number;
    200: number;
    100: number;
    50: number;
  };
}

export interface CashReconciliation {
  id: string;
  date: string;
  theoreticalBalance: number;
  countedBalance: number;
  difference: number; // countedBalance - theoreticalBalance
  status: 'CUADRADO' | 'FALTANTE' | 'SOBRANTE';
  denominations: DenominationCount;
  responsibleName: string;
  auditorName: string;
  notes?: string;
}

export interface PettyCashFund {
  agencyName: string;
  nit: string;
  address: string;
  city: string;
  phone: string;
  fixedFundAmount: number; // e.g., 1,000,000 COP
  reimbursementThresholdPercent: number; // e.g. 70%
  responsibleName: string;
  responsibleRole: string;
  substituteName: string;
  accountantName: string;
  accountantEmail: string;
  maxExpensePerReceipt: number; // e.g., 150,000 COP
}

export interface WeeklyClosing {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  initialFund: number;
  totalExpenses: number;
  finalTheoreticalBalance: number;
  reconciliation?: CashReconciliation;
  status: 'BORRADOR' | 'LISTO_PARA_ENTREGA' | 'ENTREGADO_A_CONTABILIDAD';
  deliveredAt?: string;
  deliveredBy?: string;
  receivedByAccountant?: string;
  notes?: string;
}

export interface LegalRegulation {
  id: string;
  norm: string;
  title: string;
  scope: 'PRIVADA' | 'PUBLICA' | 'AMBAS';
  relationToPettyCash: string;
  keyPoints: string[];
  articleReference?: string;
  dianRequirement?: string;
}

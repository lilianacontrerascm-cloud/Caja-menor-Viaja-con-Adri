import { Expense, PettyCashFund, CashReconciliation, WeeklyClosing } from '../types/cajaMenor';

const STORAGE_KEYS = {
  FUND: 'viaja_con_adri_petty_cash_fund',
  EXPENSES: 'viaja_con_adri_petty_cash_expenses',
  RECONCILIATIONS: 'viaja_con_adri_petty_cash_reconciliations',
  CLOSINGS: 'viaja_con_adri_petty_cash_closings',
};

export const DEFAULT_FUND: PettyCashFund = {
  agencyName: 'VIAJA CON ADRI S.A.S.',
  nit: '901.458.721-3',
  address: 'Calle 93B # 13-45, Oficina 402, Bogotá D.C.',
  city: 'Bogotá D.C., Colombia',
  phone: '+57 (601) 745-9820',
  fixedFundAmount: 1000000, // $1.000.000 COP
  reimbursementThresholdPercent: 70, // Al gastar el 70% ($700.000 COP) se debe solicitar reembolso
  responsibleName: 'Liliana Contreras',
  responsibleRole: 'Asistente Administrativa y Custodia de Caja',
  substituteName: 'Adriana Morales',
  accountantName: 'Carlos Eduardo Restrepo (T.P. 184521-T)',
  accountantEmail: 'contabilidad@viajaconadri.com',
  maxExpensePerReceipt: 150000, // Máximo por comprobante individual
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-001',
    date: '2026-10-26',
    description: 'Resma de papel carta y carpetas para expedientes de visas y paquetes turísticos',
    category: 'PAPELERIA_UTILES',
    amount: 58500,
    responsiblePerson: 'Liliana Contreras',
    department: 'OPERACIONES_TURISTICAS',
    supportType: 'FACTURA_ELECTRONICA',
    supportNumber: 'FE-9421',
    providerName: 'Papelería y Útiles del Norte S.A.S.',
    providerNit: '830.114.590-2',
    supportStatus: 'VERIFICADO',
    observations: 'Factura electrónica validada con CUFE a nombre de Viaja con Adri.',
    attachmentName: 'factura_fe9421_papeleria.pdf',
    weekNumber: 43,
    weekYear: 2026,
    createdAt: '2026-10-26T09:30:00Z',
  },
  {
    id: 'exp-002',
    date: '2026-10-26',
    description: 'Transporte en taxi autorizado para radicación urgente de pasaportes y visados en Cancillería',
    category: 'TRANSPORTE_TAXIS',
    amount: 28000,
    responsiblePerson: 'Mauricio Gómez',
    department: 'OPERACIONES_TURISTICAS',
    supportType: 'DOCUMENTO_SOPORTE_DIAN',
    supportNumber: 'DS-00142',
    providerName: 'Pedro José Alvarado (Conductor Taxi)',
    providerNit: 'C.C. 79.845.120',
    supportStatus: 'VERIFICADO',
    observations: 'Cuenta de cobro con planilla de recorrido; generado Documento Soporte Electrónico DIAN Res. 000167.',
    attachmentName: 'documento_soporte_taxi_ds142.pdf',
    weekNumber: 43,
    weekYear: 2026,
    createdAt: '2026-10-26T14:15:00Z',
  },
  {
    id: 'exp-003',
    date: '2026-10-27',
    description: 'Compra de café especial Juan Valdez, azúcar y servilletas para atención a clientes en sala de ventas',
    category: 'REFRIGERIOS_CLIENTES',
    amount: 46200,
    responsiblePerson: 'Adriana Morales',
    department: 'MOSTRADOR_VENTAS',
    supportType: 'FACTURA_ELECTRONICA',
    supportNumber: 'FE-8812',
    providerName: 'Procafecol S.A.',
    providerNit: '830.112.317-1',
    supportStatus: 'VERIFICADO',
    observations: 'Soporte fiscal electrónico conforme con Estatuto Tributario art. 771-2.',
    attachmentName: 'factura_cafe_vip.pdf',
    weekNumber: 43,
    weekYear: 2026,
    createdAt: '2026-10-27T10:00:00Z',
  },
  {
    id: 'exp-004',
    date: '2026-10-27',
    description: 'Artículos de aseo y desinfección para oficinas y baño de clientes (jabón, toallas de mano, limpiavidrios)',
    category: 'ASEO_CAFETERIA',
    amount: 37900,
    responsiblePerson: 'Liliana Contreras',
    department: 'ADMINISTRACION_FINANZAS',
    supportType: 'FACTURA_ELECTRONICA',
    supportNumber: 'FE-3390',
    providerName: 'Distribuidora Limpieza Total Ltda.',
    providerNit: '900.512.441-9',
    supportStatus: 'VERIFICADO',
    observations: 'Comprobante formal emitido y radicado en la carpeta de la semana.',
    attachmentName: 'factura_aseo_octubre.pdf',
    weekNumber: 43,
    weekYear: 2026,
    createdAt: '2026-10-27T16:40:00Z',
  },
  {
    id: 'exp-005',
    date: '2026-10-28',
    description: 'Reparación de cerradura de la puerta principal de la agencia y duplicado de 3 llaves de seguridad',
    category: 'REPARACIONES_LOCATIVAS',
    amount: 65000,
    responsiblePerson: 'Carlos Vargas',
    department: 'ADMINISTRACION_FINANZAS',
    supportType: 'DOCUMENTO_SOPORTE_DIAN',
    supportNumber: 'DS-00143',
    providerName: 'Cerrajería El Maestro (Víctor Ramos)',
    providerNit: 'C.C. 19.458.910',
    supportStatus: 'VERIFICADO',
    observations: 'Servicio prestado por no obligado a facturar; transmitido Documento Soporte a la DIAN.',
    attachmentName: 'recibo_cerrajeria_ds143.pdf',
    weekNumber: 43,
    weekYear: 2026,
    createdAt: '2026-10-28T11:20:00Z',
  },
  {
    id: 'exp-006',
    date: '2026-10-28',
    description: 'Envío urgente por mensajería Servientrega de contrato de paquetes a mayorista hotelero en Medellín',
    category: 'ENVIOS_MENSAJERIA',
    amount: 19800,
    responsiblePerson: 'Valentina Peña',
    department: 'MOSTRADOR_VENTAS',
    supportType: 'TIQUETE_POS',
    supportNumber: 'GUIA-889921',
    providerName: 'Servientrega S.A.',
    providerNit: '860.512.330-3',
    supportStatus: 'OBSERVADO',
    observations: 'Guía física de mensajería adjunta; pendiente solicitar a Servientrega la factura electrónica con NIT para deducibilidad.',
    attachmentName: 'guia_servientrega.jpg',
    weekNumber: 43,
    weekYear: 2026,
    createdAt: '2026-10-28T12:05:00Z',
  }
];

export function getFundSettings(): PettyCashFund {
  const stored = localStorage.getItem(STORAGE_KEYS.FUND);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.FUND, JSON.stringify(DEFAULT_FUND));
    return DEFAULT_FUND;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_FUND;
  }
}

export function saveFundSettings(fund: PettyCashFund): void {
  localStorage.setItem(STORAGE_KEYS.FUND, JSON.stringify(fund));
}

export function getExpenses(): Expense[] {
  const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    return INITIAL_EXPENSES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export function addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const current = getExpenses();
  const newExpense: Expense = {
    ...expense,
    id: `exp-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newExpense, ...current];
  saveExpenses(updated);
  return newExpense;
}

export function updateExpense(id: string, updates: Partial<Expense>): Expense[] {
  const current = getExpenses();
  const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
  saveExpenses(updated);
  return updated;
}

export function deleteExpense(id: string): Expense[] {
  const current = getExpenses();
  const updated = current.filter(item => item.id !== id);
  saveExpenses(updated);
  return updated;
}

export function getReconciliations(): CashReconciliation[] {
  const stored = localStorage.getItem(STORAGE_KEYS.RECONCILIATIONS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveReconciliation(recon: CashReconciliation): void {
  const all = getReconciliations();
  localStorage.setItem(STORAGE_KEYS.RECONCILIATIONS, JSON.stringify([recon, ...all]));
}

export function getWeeklyClosings(): WeeklyClosing[] {
  const stored = localStorage.getItem(STORAGE_KEYS.CLOSINGS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveWeeklyClosing(closing: WeeklyClosing): void {
  const all = getWeeklyClosings();
  const index = all.findIndex(c => c.id === closing.id);
  let updated: WeeklyClosing[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = closing;
  } else {
    updated = [closing, ...all];
  }
  localStorage.setItem(STORAGE_KEYS.CLOSINGS, JSON.stringify(updated));
}

export function resetToDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.FUND, JSON.stringify(DEFAULT_FUND));
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  localStorage.removeItem(STORAGE_KEYS.RECONCILIATIONS);
  localStorage.removeItem(STORAGE_KEYS.CLOSINGS);
}

export function formatCOP(val: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val);
}

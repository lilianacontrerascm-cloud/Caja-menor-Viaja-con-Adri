import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle, 
  XCircle, 
  ArrowDown, 
  ArrowRight, 
  Clock, 
  HelpCircle, 
  FileCheck, 
  Coins, 
  ShieldCheck, 
  ChevronRight,
  User,
  Users
} from 'lucide-react';
import { STEP_BY_STEP_PROCESS } from '../data/normativeData';

export const ProcessFlowchartModal: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'FLOWCHART' | 'STEPS'>('FLOWCHART');

  const flowchartNodes = [
    {
      id: 1,
      title: '1. Autorizar y constituir la caja',
      actor: 'Gerencia General',
      desc: 'Se define el monto ($1.000.000 COP), responsable titular, límites por recibo ($150.000 COP) y gastos permitidos.',
      type: 'process',
    },
    {
      id: 2,
      title: '2. Entregar dinero al custodio',
      actor: 'Tesorería / Gerencia',
      desc: 'Se desembolsa el efectivo inicial al encargado de la caja menor bajo acta formal de responsabilidad.',
      type: 'process',
    },
    {
      id: 3,
      title: '3. Recibir solicitud de gasto',
      actor: 'Colaborador Solicitante',
      desc: 'El empleado indica qué necesita comprar urgente (ej. papelería de visas, taxi o insumos) y cuánto dinero requiere.',
      type: 'process',
    },
    {
      id: 4,
      title: '4. ¿El gasto está autorizado?',
      actor: 'Encargado de Caja Menor',
      desc: 'Verifica si es urgente, permitido por política y si hay saldo disponible en efectivo.',
      type: 'decision',
      noBranch: 'Rechazar la solicitud y explicar el motivo al colaborador.',
      yesBranch: 'Entregar dinero bajo vale provisional de caja.',
    },
    {
      id: 5,
      title: '5. Realizar la compra autorizada',
      actor: 'Colaborador',
      desc: 'El colaborador compra el producto o servicio en el comercio y solicita factura electrónica a nombre de Viaja con Adri.',
      type: 'process',
    },
    {
      id: 6,
      title: '6. Recibir factura y soporte',
      actor: 'Encargado de Caja Menor',
      desc: 'El colaborador entrega factura/recibo y devuelta exacta de dinero dentro de las 24-48 horas siguientes.',
      type: 'process',
    },
    {
      id: 7,
      title: '7. ¿El soporte es correcto?',
      actor: 'Encargado de Caja Menor',
      desc: 'Revisa fecha, NIT de la agencia, concepto claro y desglose tributario según Estatuto Tributario art. 771-2.',
      type: 'decision',
      noBranch: 'Devolver al colaborador para que consiga la factura correcta o subsane.',
      yesBranch: 'Aceptar soporte y radicar en el legajador.',
    },
    {
      id: 8,
      title: '8. Registrar gasto en la plataforma',
      actor: 'Encargado de Caja Menor',
      desc: 'Ingresa fecha, concepto, valor, responsable y consecutivo del soporte. El sistema recalcula el saldo disponible.',
      type: 'process',
    },
    {
      id: 9,
      title: '9. Contar efectivo y arqueo físico',
      actor: 'Encargado y Auditor',
      desc: 'Conteo de billetes y monedas para comparar el dinero en efectivo contra el saldo teórico en libros.',
      type: 'process',
    },
    {
      id: 10,
      title: '10. ¿Los saldos coinciden?',
      actor: 'Custodio y Contabilidad',
      desc: 'Verificación de diferencia entre efectivo y libros.',
      type: 'decision',
      noBranch: 'Investigar diferencia: revisar comprobantes no registrados o justificar novedad en el acta.',
      yesBranch: 'Caja cuadrada exactamente ($0 diferencia).',
    },
    {
      id: 11,
      title: '11. ¿Se requiere reembolso? (> 70%)',
      actor: 'Contabilidad y Gerencia',
      desc: 'Si los gastos superan el 70% ($700.000) o es viernes de cierre semanal, se radica la legalización.',
      type: 'decision',
      yesBranch: 'Presentar gastos a contabilidad y reponer los fondos para restaurar $1.000.000 COP.',
      noBranch: 'Continuar con las operaciones ordinarias.',
    },
    {
      id: 12,
      title: '12. Cierre semanal (Viernes)',
      actor: 'Contabilidad / Gerencia',
      desc: 'Entrega digital del informe en Excel o PDF con firma del contador y archivo de soportes. Fin del ciclo semanal.',
      type: 'process',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Procedimiento Operativo Estandarizado (Página 7 del Manual)
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GitFork className="w-6 h-6 text-cyan-400" />
              Flujograma del Proceso de Caja Menor
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Control, organización y uso transparente de los recursos en la agencia <strong>VIAJA CON ADRI</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('FLOWCHART')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'FLOWCHART' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Diagrama Visual
            </button>
            <button
              onClick={() => setViewMode('STEPS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'STEPS' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Guía Paso a Paso (10 Pasos)
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'FLOWCHART' ? (
        /* Visual Flowchart Nodes */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ciclo Operativo de Caja Menor • Viaja con Adri
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-cyan-100 border border-cyan-400 inline-block" /> Proceso
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400 inline-block" /> Decisión / Control
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {flowchartNodes.map((node, index) => {
              const isDecision = node.type === 'decision';
              return (
                <div key={node.id} className="relative">
                  <div className={`p-4 rounded-xl border transition-all ${
                    isDecision
                      ? 'bg-amber-50/70 border-amber-300/80 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200/90'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isDecision ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-white'
                        }`}>
                          {node.id}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{node.title}</h4>
                          <span className="text-[10px] font-semibold text-cyan-700 block">
                            Responsable: {node.actor}
                          </span>
                        </div>
                      </div>

                      {isDecision && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 self-start sm:self-auto">
                          Punto de Control
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-2 pl-10 leading-relaxed">
                      {node.desc}
                    </p>

                    {/* Decision branches */}
                    {isDecision && (
                      <div className="mt-3 pl-10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                          <strong className="block text-[11px] text-emerald-700">✓ Si procede (SÍ):</strong>
                          <span>{node.yesBranch}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                          <strong className="block text-[11px] text-rose-700">✕ Si no cumple (NO):</strong>
                          <span>{node.noBranch}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {index < flowchartNodes.length - 1 && (
                    <div className="flex justify-center my-1.5 text-slate-300">
                      <ArrowDown className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 10 Step Detailed Guide */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEP_BY_STEP_PROCESS.map((item) => (
            <div 
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`p-5 rounded-2xl border transition cursor-pointer ${
                activeStep === item.step
                  ? 'bg-cyan-50/60 border-cyan-400 shadow-sm ring-1 ring-cyan-400'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  #{item.step}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {item.role}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-cyan-800 font-medium">
                💡 <strong>Recomendación:</strong> {item.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Scale, 
  Building2, 
  Landmark, 
  CheckCircle, 
  AlertOctagon, 
  FileCheck2, 
  HelpCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { COLOMBIAN_REGULATIONS, PROHIBITED_EXPENSES } from '../data/normativeData';

export const NormativeGuideModal: React.FC = () => {
  const [selectedScope, setSelectedScope] = useState<'TODAS' | 'PRIVADA' | 'PUBLICA'>('TODAS');

  const filteredRegulations = COLOMBIAN_REGULATIONS.filter(reg => {
    if (selectedScope === 'TODAS') return true;
    if (selectedScope === 'PRIVADA') return reg.scope === 'PRIVADA' || reg.scope === 'AMBAS';
    if (selectedScope === 'PUBLICA') return reg.scope === 'PUBLICA';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm border border-slate-700/80">
        <div className="space-y-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            Marco Legal Tributario y Contable en Colombia
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-cyan-400" />
            Normatividad Aplicable al Manejo de Caja Menor
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Es indispensable distinguir con precisión entre las obligaciones de una <strong>empresa privada</strong> (como la agencia de viajes <strong>VIAJA CON ADRI S.A.S.</strong>) y las <strong>entidades públicas</strong> del Estado colombiano, evitando errores tributarios ante la DIAN o rechazo de costos en la declaración de renta.
          </p>
        </div>
      </div>

      {/* Comparative Table: Privada vs Pública */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-600" />
              Cuadro Comparativo: Empresa Privada vs. Entidad Pública
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Diferenciación conceptual y operativa según la legislación colombiana vigente.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-1/4">Aspecto Clave</th>
                <th className="py-3 px-4 w-3/8 bg-cyan-50/60 text-cyan-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Building2 className="w-4 h-4 text-cyan-600" />
                    Empresa Privada (Viaja con Adri S.A.S.)
                  </div>
                </th>
                <th className="py-3 px-4 w-3/8 bg-slate-50 text-slate-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Landmark className="w-4 h-4 text-amber-700" />
                    Entidad Pública (Estado Colombiano)
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Marco Legal Principal
                </td>
                <td className="py-3 px-4 bg-cyan-50/30 text-slate-700">
                  • <strong>Estatuto Tributario</strong> (Arts. 615, 771-2)<br />
                  • <strong>Decreto 1625 de 2016</strong> (DUR Tributario)<br />
                  • <strong>Resolución DIAN 000167 de 2021</strong> (Doc. Soporte Electrónico)<br />
                  • <strong>Ley 1314 de 2009</strong> (NIIF para Pymes)
                </td>
                <td className="py-3 px-4 text-slate-600">
                  • <strong>Decreto 2768 de 2012</strong><br />
                  • <strong>Decreto 1068 de 2015</strong> (Título 5, Parte 8)<br />
                  • <strong>Estatuto Orgánico del Presupuesto</strong><br />
                  • Régimen de Contabilidad Pública (CGN)
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Constitución y Apertura
                </td>
                <td className="py-3 px-4 bg-cyan-50/30 text-slate-700">
                  Mediante política interna aprobada por <strong>Gerencia General</strong> o Junta Directiva. Fija monto, custodio y límites de gasto por recibo.
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Mediante <strong>Acto Administrativo formal</strong> (Resolución suscrita por el representante legal u ordenador del gasto).
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Custodio y Garantías
                </td>
                <td className="py-3 px-4 bg-cyan-50/30 text-slate-700">
                  Colaborador de confianza asignado por contrato de trabajo. Custodia personal de los dineros en efectivo.
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Funcionario público de planta designado, quien obligatoriamente debe constituir <strong>póliza de manejo y cumplimiento</strong>.
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Soportes Válidos para Deducción
                </td>
                <td className="py-3 px-4 bg-cyan-50/30 text-slate-700">
                  • <strong>Factura Electrónica de Venta</strong> (a nombre de la agencia con NIT 901.458.721-3).<br />
                  • <strong>Documento Soporte Electrónico</strong> para no obligados a facturar (taxis, cerrajeros, reparaciones menores).
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Facturas electrónicas asociadas a rubro presupuestal con Certificado de Disponibilidad (CDP) y Registro Presupuestal (RP).
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Rendición de Cuentas y Cierre
                </td>
                <td className="py-3 px-4 bg-cyan-50/30 text-slate-700">
                  <strong>Cada viernes</strong> entrega a contabilidad para legalización continua y oportuna solicitud de reembolso cuando el saldo consumido supere el 70%.
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Cierres reglados por cronograma presupuestal estatal. Cancelación y reintegro forzoso de saldos al Tesoro Público antes de finalizar la vigencia fiscal (31 dic).
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Consecuencias por Incumplimiento
                </td>
                <td className="py-3 px-4 bg-cyan-50/30 text-slate-700">
                  Rechazo de costos y deducciones por la DIAN (mayor impuesto de renta a pagar), sanciones por irregularidad contable y descuentos laborales al custodio en caso de faltantes injustificados.
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Responsabilidad fiscal ante la Contraloría, disciplinaria ante Procuraduría y penal ante la Fiscalía (peculado, detrimento patrimonial).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scope Filter for Regulations */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Filtrar Normas:</span>
        <button
          onClick={() => setSelectedScope('TODAS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedScope === 'TODAS' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todas las Normas
        </button>
        <button
          onClick={() => setSelectedScope('PRIVADA')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedScope === 'PRIVADA' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Empresas Privadas (Viaja con Adri)
        </button>
        <button
          onClick={() => setSelectedScope('PUBLICA')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedScope === 'PUBLICA' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Entidades Públicas (Decretos 2768 / 1068)
        </button>
      </div>

      {/* Regulations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRegulations.map((reg) => (
          <div key={reg.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  reg.scope === 'PUBLICA' 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                }`}>
                  {reg.scope === 'PUBLICA' ? 'Sector Público' : 'Sector Privado / DIAN'}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">{reg.norm}</h4>
                <p className="text-xs font-medium text-slate-600">{reg.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              <strong>Relación con Caja Menor:</strong> {reg.relationToPettyCash}
            </p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-800 block">Puntos Clave y Obligaciones:</span>
              <ul className="space-y-1 text-xs text-slate-600">
                {reg.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-600 shrink-0 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {reg.dianRequirement && (
              <div className="p-2.5 bg-cyan-50 rounded-lg text-[11px] text-cyan-950 font-medium border border-cyan-200">
                <strong>Requisito DIAN:</strong> {reg.dianRequirement}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prohibited Expenses Section */}
      <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950">
              Gastos Estrictamente Prohibidos por Caja Menor en Viaja con Adri
            </h3>
            <p className="text-xs text-rose-700">
              Bajo ninguna circunstancia el custodio ni los colaboradores deben desembolsar dinero de caja menor para estos conceptos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {PROHIBITED_EXPENSES.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-rose-900">
              <span className="text-rose-500 font-bold">✕</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

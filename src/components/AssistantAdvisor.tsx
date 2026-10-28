import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  FileQuestion, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Building2,
  Scale
} from 'lucide-react';
import { PettyCashFund, Expense, CashReconciliation } from '../types/cajaMenor';
import { formatCOP } from '../services/storageService';

interface AssistantAdvisorProps {
  fund: PettyCashFund;
  expenses: Expense[];
  reconciliation: CashReconciliation | null;
  onGoToExpenses: () => void;
  onGoToReconciliation: () => void;
  onGoToWeeklyReport: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    onClick: () => void;
  };
}

export const AssistantAdvisor: React.FC<AssistantAdvisorProps> = ({
  fund,
  expenses,
  reconciliation,
  onGoToExpenses,
  onGoToReconciliation,
  onGoToWeeklyReport,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `¡Hola! Soy tu **Asistente Administrativo y Contable Especializado en Caja Menor** para la agencia de viajes **VIAJA CON ADRI** en Colombia.\n\nEstoy aquí para orientarte en la normatividad tributaria (DIAN), verificación de facturas electrónicas, resolución de diferencias en arqueos, preparación de la entrega de los viernes a contabilidad y políticas de control interno.\n\n¿En qué te puedo asesorar hoy?`,
      timestamp: '13:00',
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const theoreticalBalance = fund.fixedFundAmount - totalExpenses;
  const pendingSupports = expenses.filter(e => e.supportStatus !== 'VERIFICADO');

  // Quick Preset Prompts
  const quickQuestions = [
    {
      title: 'Diagnóstico de mi caja actual',
      desc: 'Analizar saldos, soportes pendientes y estado para el viernes.',
      prompt: 'Realiza un diagnóstico completo del estado actual de la caja menor de Viaja con Adri.'
    },
    {
      title: '¿Cómo legalizar taxis o transporte sin factura?',
      desc: 'Aplicación del Documento Soporte Electrónico DIAN Res. 000167.',
      prompt: '¿Cómo debo legalizar los pagos de transporte y taxis de la agencia si el conductor no entrega factura electrónica?'
    },
    {
      title: '¿Qué hacer si hay faltante en el arqueo?',
      desc: 'Procedimiento contable y laboral en caso de descuadre.',
      prompt: '¿Qué procedimiento debo seguir si en el conteo físico de billetes tengo un faltante de dinero respecto a los libros?'
    },
    {
      title: 'Diferencia Empresa Privada vs Sector Público',
      desc: 'Por qué no aplica el Decreto 2768/2012 a Viaja con Adri.',
      prompt: '¿Qué diferencia las reglas de caja menor de Viaja con Adri (privada) frente a una entidad pública colombiana?'
    },
    {
      title: '¿Cuándo pedir reembolso a Gerencia?',
      desc: 'Umbrales del 70% y fecha límite de los viernes.',
      prompt: '¿Cuáles son los requisitos y el momento exacto para solicitar el reembolso de caja menor a Gerencia?'
    },
    {
      title: '¿Por qué un tiquete POS puede ser rechazado?',
      desc: 'Requisitos del Estatuto Tributario Art. 771-2 y la DIAN.',
      prompt: '¿Por qué un tiquete de caja registradora simple (POS) puede no ser aceptado por contabilidad para deducir renta?'
    }
  ];

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('diagnóstico') || q.includes('estado actual') || q.includes('analizar')) {
      const issuesText = pendingSupports.length > 0 
        ? `⚠️ **Atención:** Se identificaron ${pendingSupports.length} gasto(s) con soporte pendiente u observado:\n${pendingSupports.map(p => `• ${p.description} (${formatCOP(p.amount)}) - ${p.providerName}`).join('\n')}\nDebe solicitarse la factura electrónica o tramitar el documento soporte DIAN antes del viernes.`
        : '✅ **Excelente:** Todos los soportes registrados se encuentran formalmente verificados.';

      const reconText = reconciliation 
        ? `✅ **Arqueo registrado:** Contado ${formatCOP(reconciliation.countedBalance)} vs Libros ${formatCOP(reconciliation.theoreticalBalance)}. Diferencia: ${formatCOP(reconciliation.difference)} (${reconciliation.status}).`
        : '⚠️ **Arqueo pendiente:** Aún no has registrado el conteo físico de billetes y monedas de la semana.';

      const thresholdNotice = totalExpenses >= fund.fixedFundAmount * (fund.reimbursementThresholdPercent / 100)
        ? `🔔 **Alerta de Reembolso:** Has consumido el ${((totalExpenses / fund.fixedFundAmount) * 100).toFixed(1)}% del fondo. Supera el umbral del ${fund.reimbursementThresholdPercent}%, por lo que debes radicar hoy mismo la solicitud de reposición de fondos a Gerencia.`
        : `ℹ️ **Fondo operativo:** Consumo del ${((totalExpenses / fund.fixedFundAmount) * 100).toFixed(1)}%. Saldo disponible en efectivo: ${formatCOP(theoreticalBalance)}.`;

      return `### 📊 Diagnóstico en Tiempo Real - VIAJA CON ADRI S.A.S.\n\n` +
        `**1. Resumen de Cifras:**\n` +
        `• Fondo Asignado: **${formatCOP(fund.fixedFundAmount)}**\n` +
        `• Total Gastos Registrados: **${formatCOP(totalExpenses)}** (${expenses.length} movimientos)\n` +
        `• Saldo Disponible en Efectivo: **${formatCOP(theoreticalBalance)}**\n\n` +
        `**2. Estado de Soportes Tributarios:**\n${issuesText}\n\n` +
        `**3. Estado del Arqueo Semanal:**\n${reconText}\n\n` +
        `**4. Recomendación Operativa:**\n${thresholdNotice}\n\n` +
        `*Recuerda que el informe semanal en Excel y PDF se radica a contabilidad cada viernes al cierre de la jornada.*`;
    }

    if (q.includes('taxi') || q.includes('transporte') || q.includes('documento soporte') || q.includes('no obligados')) {
      return `### 🚕 Procedimiento para Legalizar Taxis y Transporte Urbano en VIAJA CON ADRI\n\n` +
        `De conformidad con la **Resolución DIAN 000167 de 2021** y el **Estatuto Tributario art. 771-2**:\n\n` +
        `1. **Naturaleza del proveedor:** Los taxistas y conductores de servicio público individual en Colombia son personas naturales no obligadas a expedir factura electrónica.\n` +
        `2. **Paso indispensable:** El colaborador debe solicitar o diligenciar un **recibo de transporte o cuenta de cobro** donde figure:\n` +
        `   • Fecha y hora del recorrido.\n` +
        `   • Origen y destino (ej. De la oficina a la Cancillería para trámite de pasaportes).\n` +
        `   • Placa del vehículo y nombre completo del conductor con su cédula.\n` +
        `   • Firma del colaborador y valor pagado.\n` +
        `3. **Generación del Documento Soporte Electrónico DIAN:** La agencia emite a través de su software contable o facturación DIAN el *Documento Soporte en adquisiciones efectuadas a sujetos no obligados a expedir factura o documento equivalente*.\n` +
        `4. **Validez Tributaria:** De este modo, el gasto es 100% deducible de renta para VIAJA CON ADRI S.A.S. sin riesgos de rechazo fiscal.`;
    }

    if (q.includes('faltante') || q.includes('descuadre') || q.includes('diferencia') || q.includes('sobrante')) {
      return `### 🔍 Procedimiento ante Diferencias en el Arqueo de Caja Menor\n\n` +
        `Cuando el conteo de billetes y monedas no coincide con el saldo en libros:\n\n` +
        `| Caso | Causa Probable | Acción Administrativa / Contable |\n` +
        `| :--- | :--- | :--- |\n` +
        `| **Faltante de Dinero** | Comprobante olvidado sin registrar, error en entrega de vueltas o pérdida física. | 1. Revisar los cajones y vales provisionales pendientes.<br>2. Si no aparece el soporte, el custodio de caja debe justificar la novedad en el acta.<br>3. Según la política interna, el custodio asume y repone el valor faltante antes de cerrar la semana. |\n` +
        `| **Sobrante de Dinero** | Vueltas entregadas de más o pago registrado por mayor valor al real. | 1. Recalcular suma de facturas.<br>2. Si persiste, no se debe ocultar: se registra contablemente como *Ingreso Extraordinario / Aprovechamiento* a favor de la empresa. |\n\n` +
        `*Importante:* Nunca modifiques ni inventes registros contables para forzar el cuadre. La transparencia es la regla de oro para la auditoría de los viernes.`;
    }

    if (q.includes('publica') || q.includes('privada') || q.includes('decreto 2768') || q.includes('decreto 1068')) {
      return `### ⚖️ Diferencia Vital: VIAJA CON ADRI S.A.S. (Privada) vs. Entidades Públicas\n\n` +
        `Es frecuente confundir las normas, pero sus marcos y responsabilidades son distintos:\n\n` +
        `1. **VIAJA CON ADRI S.A.S. (Sector Privado):**\n` +
        `   • **Marco:** Estatuto Tributario (Arts. 615 y 771-2), DURT 1625 de 2016, Ley 1314 de 2009 (NIIF para Pymes).\n` +
        `   • **Autorización:** Se rige por manuales internos fijados por Gerencia General.\n` +
        `   • **Objetivo tributario:** Evitar el rechazo de costos y deducciones por parte de la DIAN.\n` +
        `   • **Flexibilidad:** No requiere licitación ni certificados de disponibilidad presupuestal (CDP).\n\n` +
        `2. **Entidades Públicas (Alcaldías, Ministerios, Hospitales Estatales):**\n` +
        `   • **Marco:** Reguladas estrictamente por el **Decreto 2768 de 2012** y el **Decreto 1068 de 2015 (Título 5, Parte 8)**.\n` +
        `   • **Requisitos especiales:** Creación forzosa por resolución administrativa, póliza de manejo expedida por aseguradora para el funcionario, estricto apego al rubro presupuestal y cierre forzoso al 31 de diciembre con reintegro al Tesoro Nacional.\n` +
        `   • **Vigilancia:** Sujetas a control fiscal de la Contraloría General y disciplinario de la Procuraduría.\n\n` +
        `*Conclusión para la agencia:* VIAJA CON ADRI adopta los sanos principios de control del sector público como **buenas prácticas de control interno**, pero responde legalmente ante la DIAN y el régimen comercial privado.`;
    }

    if (q.includes('reembolso') || q.includes('70%') || q.includes('solicitar')) {
      return `### 💳 Política de Reembolso de Fondos de Caja Menor\n\n` +
        `Para garantizar que VIAJA CON ADRI nunca se quede sin efectivo para emergencias operativas, se aplican dos reglas:\n\n` +
        `1. **Regla del 70% de Consumo:** Tan pronto el total de gastos acumulados alcance el **70% del fondo fijo** (es decir, $700.000 COP de un fondo de $1.000.000 COP), el custodio debe tramitar de inmediato la solicitud de reembolso a Gerencia, sin esperar al viernes.\n` +
        `2. **Regla del Cierre Semanal de Viernes:** Cada viernes, al terminar la jornada laboral, se legalizan los gastos realizados durante la semana y se emite la orden de reintegro para iniciar el lunes con el fondo completo ($1.000.000 COP).\n\n` +
        `**Documentos a entregar a Contabilidad para el Reembolso:**\n` +
        `• Planilla semanal en Excel o PDF generada por el sistema.\n` +
        `• Carpeta legajadora con todas las facturas electrónicas y documentos soporte originales ordenados cronológicamente.\n` +
        `• Acta de arqueo físico firmada por el custodio y revisor.`;
    }

    if (q.includes('pos') || q.includes('factura') || q.includes('rechazado') || q.includes('dian')) {
      return `### 🧾 Requisitos de las Facturas y el Tiquete POS ante la DIAN\n\n` +
        `Bajo el **Artículo 771-2 del Estatuto Tributario** y la reglamentación de Factura Electrónica:\n\n` +
        `1. **El tiquete de máquina registradora POS simple:** No incluye los datos del comprador (nombre ni NIT) ni el desglose electrónico con CUFE. Por disposición de la DIAN, **los tiquetes POS ya no son válidos como costo o deducción en renta** para las empresas, a menos que el comercio emita la respectiva Factura Electrónica.\n` +
        `2. **Instrucción para los colaboradores:** Cuando compren café en un supermercado, papelería en una tienda de cadena o artículos de aseo, **deben solicitar en caja Factura Electrónica** a nombre de:\n` +
        `   • **Razón Social:** VIAJA CON ADRI S.A.S.\n` +
        `   • **NIT:** 901.458.721-3\n` +
        `   • **Correo:** facturacion@viajaconadri.com\n` +
        `3. Si solo traen el tiquete POS, la plataforma lo marcará como **"OBSERVADO"** para que el colaborador solicite la factura electrónica dentro de las 48 horas siguientes.`;
    }

    // Default professional guidance
    return `### 📋 Asesoría Contable - VIAJA CON ADRI S.A.S.\n\n` +
      `Respecto a tu consulta sobre *"**${query}**"*:\n\n` +
      `1. **Principio General:** En el manejo de la caja menor de VIAJA CON ADRI, cada desembolso debe cumplir tres condiciones de oro: ser **urgente**, ser **menor al tope de $150.000 COP**, y contar con su **soporte fiscal verificable** (Factura Electrónica con NIT 901.458.721-3 o Documento Soporte DIAN Res. 000167/2021).\n` +
      `2. **Proceso Semanal:** Todo gasto se acumula para el informe semanal de los viernes, el cual se entrega digitalmente en Excel o PDF a contabilidad junto con el arqueo físico de billetes y monedas.\n` +
      `3. **Revisión Continua:** Si tienes dudas sobre un gasto específico, puedes consultarlo aquí o clasificarlo temporalmente con el estado *"OBSERVADO"* para que el contador lo valide antes de la entrega definitiva.`;
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuestion;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAnswer(q);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Advisor Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Asistente Administrativo y Contable Especializado
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400" />
              Orientación Contable & Procedimental de Caja Menor
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Respuestas inmediatas para la legalización de gastos, requisitos de facturación DIAN, conciliación de arqueos y preparación del informe de viernes para <strong>VIAJA CON ADRI</strong>.
            </p>
          </div>

          <button
            onClick={() => handleSend('Realiza un diagnóstico completo del estado actual de la caja menor de Viaja con Adri.')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md transition self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            Diagnosticar mi Caja Menor Hoy
          </button>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Consultas Frecuentes y Procedimientos DIAN:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.prompt)}
              className="text-left p-3.5 bg-white hover:bg-cyan-50/50 border border-slate-200/80 hover:border-cyan-300 rounded-xl transition shadow-xs group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-cyan-800">
                <span>{q.title}</span>
                <span className="text-cyan-600 opacity-0 group-hover:opacity-100 transition">→</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {q.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'assistant' 
                  ? 'bg-slate-900 text-cyan-400' 
                  : 'bg-cyan-600 text-white'
              }`}>
                {msg.sender === 'assistant' ? <Bot className="w-4 h-4" /> : <span className="font-bold text-xs">Tú</span>}
              </div>

              <div className={`p-4 rounded-2xl shadow-xs leading-relaxed ${
                msg.sender === 'assistant'
                  ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                  : 'bg-cyan-600 text-white rounded-tr-none'
              }`}>
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('### ')) {
                      return <h4 key={pIdx} className="font-bold text-sm text-slate-900 mt-1 mb-1">{paragraph.replace('### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('|')) {
                      // simple table display
                      const rows = paragraph.trim().split('\n');
                      return (
                        <div key={pIdx} className="overflow-x-auto my-2">
                          <table className="w-full text-[11px] border border-slate-200 bg-white rounded-lg">
                            <tbody>
                              {rows.map((row, rIdx) => {
                                const cols = row.split('|').filter(c => c.trim() !== '');
                                if (row.includes('---')) return null;
                                return (
                                  <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-100 font-bold' : 'border-t border-slate-100'}>
                                    {cols.map((col, cIdx) => (
                                      <td key={cIdx} className="p-1.5 align-top" dangerouslySetInnerHTML={{ __html: col.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    return (
                      <p 
                        key={pIdx} 
                        className={msg.sender === 'assistant' ? 'text-slate-700' : 'text-white'}
                        dangerouslySetInnerHTML={{ 
                          __html: paragraph
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        }} 
                      />
                    );
                  })}
                </div>
                <div className={`text-[10px] mt-2 ${msg.sender === 'assistant' ? 'text-slate-400' : 'text-cyan-100'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse delay-150" />
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse delay-300" />
                <span className="text-[11px] ml-1">Consultando normatividad contable de Viaja con Adri...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Haz una pregunta contable o administrativa sobre caja menor en Colombia..."
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 placeholder-slate-400 shadow-xs"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <span>Preguntar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import { LegalRegulation } from '../types/cajaMenor';

export const COLOMBIAN_REGULATIONS: LegalRegulation[] = [
  {
    id: 'dec-1625-2016',
    norm: 'Decreto 1625 de 2016',
    title: 'Decreto Único Reglamentario en Materia Tributaria (DURT)',
    scope: 'AMBAS',
    relationToPettyCash: 'Regula los requisitos fiscales que deben cumplir todos los soportes de las operaciones comerciales para tener validez tributaria y ser deducibles en el impuesto sobre la renta.',
    keyPoints: [
      'Exige que cada pago de caja menor cuente con un documento idóneo que acredite la transacción económica real.',
      'Determina la obligatoriedad de individualizar al beneficiario del pago con NIT o cédula de ciudadanía.',
      'Fija criterios para que las compras de bienes y servicios no sean rechazadas fiscalmente por la DIAN.',
      'Aplica plenamente a la agencia de viajes Viaja con Adri como persona jurídica privada en Colombia.'
    ],
    articleReference: 'Artículos 1.6.1.4.1 y subsiguientes'
  },
  {
    id: 'et-615-771-2',
    norm: 'Estatuto Tributario (Arts. 615 y 771-2)',
    title: 'Obligación de Facturar y Procedencia de Costos y Deducciones',
    scope: 'AMBAS',
    relationToPettyCash: 'Para que los gastos de caja menor sean deducibles de renta y den derecho a impuestos descontables (IVA), deben estar respaldados en facturas de venta electrónicas o documentos soporte autorizados.',
    keyPoints: [
      'Art. 615: Obligación formal de exigir factura con todos los requisitos legales por cada compra realizada.',
      'Art. 771-2: Para la procedencia de costos y deducciones en el impuesto sobre la renta, así como de los impuestos descontables en el IVA, se requerirá de facturas con el cumplimiento de los requisitos establecidos.',
      'Las tirillas de caja registradora simples sin identificación del adquirente (tiquete POS sin datos del cliente) ya no otorgan derecho a costo ni deducción si superan los límites DIAN.',
      'Al comprar insumos para la agencia (café, papelería, aseo), siempre debe solicitarse factura electrónica a nombre de VIAJA CON ADRI.'
    ],
    articleReference: 'Estatuto Tributario Nacional arts. 615, 616-1 y 771-2',
    dianRequirement: 'Exigir factura electrónica con NIT de la agencia (901.458.721-3).'
  },
  {
    id: 'res-dian-167-2021',
    norm: 'Resolución DIAN 000167 de 2021',
    title: 'Documento Soporte Electrónico en Adquisiciones a No Obligados a Facturar',
    scope: 'AMBAS',
    relationToPettyCash: 'Cuando la agencia efectúa compras o contrata servicios menores con personas naturales o comerciantes que no están obligados a expedir factura (ej. cerrajero del barrio, transporte informal autorizado, reparador independiente), la agencia debe generar y transmitir electrónicamente a la DIAN el Documento Soporte.',
    keyPoints: [
      'Aplica obligatoriamente a empresas privadas como Viaja con Adri.',
      'El colaborador que realiza la compra debe solicitar la cuenta de cobro o recibo con nombre completo, cédula, dirección y teléfono del prestador del servicio.',
      'El área contable o responsable de caja transmite el documento electrónico a la DIAN con su respectiva numeración autorizada.',
      'Permite que gastos legítimos sin factura electrónica sigan siendo legalmente deducibles.'
    ],
    articleReference: 'Resolución DIAN 000167/2021 y Res. 000488/2022',
    dianRequirement: 'Transmisión electrónica vía software DIAN o proveedor tecnológico dentro de los plazos reglamentarios.'
  },
  {
    id: 'ley-1314-2009',
    norm: 'Ley 1314 de 2009',
    title: 'Marco Regulatorio de Contabilidad e Información Financiera (NIIF Colombia)',
    scope: 'AMBAS',
    relationToPettyCash: 'Establece los principios de revelación, fiabilidad, prudencia y reconocimiento oportuno de los hechos económicos de la entidad.',
    keyPoints: [
      'Todo desembolso de efectivo debe reconocerse en el periodo contable en que ocurre (principio de causación/devengo).',
      'El saldo de caja menor forma parte del rubro "Efectivo y Equivalentes de Efectivo".',
      'Exige arqueos periódicos y conciliación para garantizar la exactitud de los estados financieros.',
      'Los viernes al cierre semanal, se legalizan los gastos para reflejar el saldo real disponible de la agencia.'
    ],
    articleReference: 'Ley 1314 de 2009 y Decretos Reglamentarios 2420/2015 (NIIF para Pymes Grupo 2)'
  },
  {
    id: 'dec-2768-2012',
    norm: 'Decreto 2768 de 2012',
    title: 'Reglamentación de Cajas Menores en Entidades Públicas',
    scope: 'PUBLICA',
    relationToPettyCash: 'Norma de estricta aplicación para el sector público colombiano. Regula cómo el Estado crea cajas menores, funcionarios ordenadores del gasto, topes presupuestales y prohibiciones de uso de dineros públicos.',
    keyPoints: [
      'Establece la constitución de caja menor mediante acto administrativo formal (resolución o acuerdo).',
      'Responsabilidad fiscal y disciplinaria especial ante la Contraloría General de la República.',
      'Prohibiciones explícitas: no realizar fraccionamiento de contratos, no pagar viáticos permanentes ni servicios personales contratados por licitación.',
      'Aclaración para Viaja con Adri: Aunque es una norma de entidades públicas, sus principios de transparencia, control y custodia de fondos sirven como excelente práctica de control interno para el sector privado.'
    ],
    articleReference: 'Decreto Nacional 2768 de 2012'
  },
  {
    id: 'dec-1068-2015',
    norm: 'Decreto 1068 de 2015 (Título 5, Parte 8)',
    title: 'Decreto Único Reglamentario del Sector Hacienda y Crédito Público',
    scope: 'PUBLICA',
    relationToPettyCash: 'Regula en el ámbito estatal la constitución, cuantía máxima, manejo, legalización periódica y cierre definitivo de las cajas menores al término de la vigencia fiscal.',
    keyPoints: [
      'Regula el calendario de apertura al inicio del año fiscal y cierre forzoso antes del último día hábil de diciembre.',
      'Procedimiento de reintegro de sobrantes al tesoro nacional.',
      'Diferencia clave con Viaja con Adri: Las empresas privadas operan con políticas internas aprobadas por la Gerencia General o Junta Directiva, sin sujeción a las rigideces presupuestales del estatuto orgánico de presupuesto público.'
    ],
    articleReference: 'DUR Sector Hacienda 1068/2015'
  }
];

export const PROHIBITED_EXPENSES = [
  'Préstamos o anticipos de nómina a colaboradores o socios.',
  'Cambio de cheques personales por efectivo de la caja menor.',
  'Fraccionar facturas para eludir los límites de compra autorizados.',
  'Pago de honorarios profesionales recurrentes o servicios continuados.',
  'Gastos personales ajenos a la operación de la agencia de viajes.',
  'Compras de activos fijos (computadores, escritorios, aires acondicionados).',
  'Adquisiciones sin comprobante o soporte contable legalizable.'
];

export const STEP_BY_STEP_PROCESS = [
  {
    step: 1,
    title: 'Se presenta una necesidad',
    role: 'Colaborador',
    description: 'Un colaborador identifica que necesita comprar algo urgente para realizar su trabajo (ej. hojas para imprimir tiquetes, artículos de aseo para la sala de atención al cliente, transporte urgente a embajada/notaría).',
    recommendation: 'Verificar previamente si el insumo existe en bodega o inventario general antes de solicitar desembolso.'
  },
  {
    step: 2,
    title: 'Se solicita el dinero',
    role: 'Colaborador',
    description: 'La persona informa qué necesita comprar, la justificación operativa y el monto estimado aproximado requerido.',
    recommendation: 'Hacerlo con anticipación prudente y solicitar el recibo provisional de entrega de efectivo.'
  },
  {
    step: 3,
    title: 'Se revisa la solicitud',
    role: 'Encargado de Caja Menor',
    description: 'El custodio de la caja menor verifica: 1) Si el gasto está permitido en la política, 2) Si es realmente necesario y urgente, 3) Si hay suficiente saldo disponible en efectivo.',
    recommendation: 'Si supera el tope fijado por recibo ($150.000 COP), debe requerir autorización especial de Gerencia.'
  },
  {
    step: 4,
    title: 'Se aprueba la compra',
    role: 'Encargado de Caja / Jefe Autorizado',
    description: 'Si cumple con las condiciones, se autoriza y se entrega el dinero en efectivo al colaborador.',
    recommendation: 'Hacer firmar comprobante de egreso o vale provisional con la fecha y valor entregado.'
  },
  {
    step: 5,
    title: 'Se realiza la compra',
    role: 'Colaborador',
    description: 'El colaborador adquiere el producto o servicio estrictamente solicitado, procurando el mejor precio y calidad.',
    recommendation: 'Siempre exigir factura electrónica o documento válido a nombre de Viaja con Adri.'
  },
  {
    step: 6,
    title: 'Se entrega la factura y devuelta',
    role: 'Colaborador',
    description: 'Después de realizar la compra (máximo dentro de las 24 a 48 horas hábiles), entrega factura, recibo o comprobante, junto con el dinero sobrante exacto.',
    recommendation: 'Si el soporte no tiene fecha, NIT o concepto claro, debe devolverse para corrección inmediata.'
  },
  {
    step: 7,
    title: 'Se registra el gasto',
    role: 'Encargado de Caja Menor',
    description: 'La persona encargada registra en la plataforma: fecha, concepto detallado, valor exacto, responsable y dependencia solicitante.',
    recommendation: 'El sistema recalcula automáticamente el saldo disponible y alerta si se acerca al tope de reembolso.'
  },
  {
    step: 8,
    title: 'Se guardan y archivan los soportes',
    role: 'Encargado de Caja Menor',
    description: 'Los documentos físicos y digitales se organizan cronológicamente y se engrampan con su comprobante de caja para futuras auditorías.',
    recommendation: 'Mantener legajador exclusivo de caja menor identificado con el número de semana.'
  },
  {
    step: 9,
    title: 'Se realiza arqueo y conteo físico',
    role: 'Encargado de Caja / Auditor',
    description: 'Periódicamente (y obligatoriamente cada viernes), se cuenta billete por billete y moneda por moneda, comparándolo con el saldo en libros.',
    recommendation: 'Cualquier diferencia (faltante o sobrante) debe quedar registrada y justificada en el acta.'
  },
  {
    step: 10,
    title: 'Se repone el dinero (Reembolso semanal)',
    role: 'Gerencia y Contabilidad',
    description: 'Cada viernes se entrega el informe con los soportes a contabilidad. Una vez aprobado, se gira el cheque o transferencia para restituir el fondo a su monto inicial ($1.000.000 COP).',
    recommendation: 'No esperar a que la caja quede en ceros para solicitar el reembolso.'
  }
];

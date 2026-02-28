/**
 * Datos mock para el flujo de Segmentación (ICP, Persona).
 * Reutilizado por los componentes de paso (ICP, Persona).
 */

export const icpOptions = [
  {
    id: 'icp-1',
    rank: 1,
    name: 'BPO y centros de servicios compartidos en expansión',
    score_strategic: 9,
    industry_specific: ['BPO financieros', 'Centros de servicios compartidos'],
    target_entity_type: 'Multinacional',
    market_signal: {
      description: 'Crecimiento en inversión de startups y centros de servicios compartidos en Bogotá, con más de USD 610 millones en 2024, impulsa demanda de oficinas flexibles.',
      source_name: 'Ecosistemas Startup',
      source_url: 'https://ejemplo.com/fuente-del-master-report'
    },
    use_case_activated: 'Rightsizing',
    strategic_pain_addressed: 'Ocupación: oficinas vacías por modelo híbrido.',
    capex_intensity: 'High',
    opportunity_window: 'La tendencia hacia modernización de espacios BPO la hace accionable en 6-12 meses.',
    score_breakdown: {
      signal_strength: 5,
      service_alignment: 5,
      use_case_activation: 5,
      capex_intensity: 5,
      urgency: 6
    },
    validation: {
      respects_exclusions: true,
      within_geography: true,
      activates_use_case: true,
      addresses_declared_pain: true,
      entity_alignment: true
    },
    sources: [
      { name: 'Ecosistemas Startup', url: 'https://ejemplo.com/fuente-del-master-report' }
    ]
  },
  {
    id: 'icp-2',
    rank: 2,
    name: 'Fabricantes relocalizando por Nearshoring',
    score_strategic: 8,
    industry_specific: ['Manufactura automotriz', 'Componentes electrónicos'],
    target_entity_type: 'Multinacional',
    market_signal: {
      description: 'Relocalization de manufactura desde Asia hacia México impulsada por nearshoring, con empresas automotrices buscando naves industriales modernas.',
      source_name: 'Nearshoring Trends México',
      source_url: 'https://ejemplo.com/nearshoring-trends-2024'
    },
    use_case_activated: 'Nearshoring',
    strategic_pain_addressed: 'Disrupciones en supply chain global y necesidad de proximidad a mercado US.',
    capex_intensity: 'High',
    opportunity_window: 'Tendencia macro fuerte con contratos build-to-suit. Ventana de 12-18 meses.',
    score_breakdown: {
      signal_strength: 7,
      service_alignment: 6,
      use_case_activation: 8,
      capex_intensity: 7,
      urgency: 6
    },
    validation: {
      respects_exclusions: true,
      within_geography: true,
      activates_use_case: true,
      addresses_declared_pain: true,
      entity_alignment: true
    },
    sources: [
      { name: 'Nearshoring Trends México', url: 'https://ejemplo.com/nearshoring-trends-2024' }
    ]
  },
  {
    id: 'icp-3',
    rank: 3,
    name: 'Operadores 3PL especializados en e-commerce',
    score_strategic: 7,
    industry_specific: ['3PL e-commerce', 'Fulfillment centers'],
    target_entity_type: 'Sector Emergente',
    market_signal: {
      description: 'Crecimiento de e-commerce en LATAM impulsa demanda de centros de fulfillment con automatización y proximidad a rutas last-mile.',
      source_name: 'E-commerce Growth LATAM',
      source_url: 'https://ejemplo.com/ecommerce-latam-2024'
    },
    use_case_activated: 'Consolidación',
    strategic_pain_addressed: 'Necesidad de optimización de rutas y reducción de tiempos de entrega.',
    capex_intensity: 'Medium',
    opportunity_window: 'Volumen constante de oportunidades con renovaciones frecuentes. Ventana continua.',
    score_breakdown: {
      signal_strength: 6,
      service_alignment: 5,
      use_case_activation: 6,
      capex_intensity: 4,
      urgency: 7
    },
    validation: {
      respects_exclusions: true,
      within_geography: true,
      activates_use_case: true,
      addresses_declared_pain: true,
      entity_alignment: true
    },
    sources: [
      { name: 'E-commerce Growth LATAM', url: 'https://ejemplo.com/ecommerce-latam-2024' }
    ]
  }
];

export const buyerPersona = {
  title: 'Director de Operaciones / VP of Supply Chain',
  seniority: 'C-Level o VP',
  department: 'Operations / Supply Chain',
  funciones: [
    'Expandir capacidad manufacturera aprovechando nearshoring',
    'Reducir costos de producción vs. Asia manteniendo calidad',
    'Implementar soluciones sostenibles con certificaciones'
  ],
  dolorEspecificoRE: [
    'Tiempos de envío largos desde Asia afectan time-to-market',
    'Incertidumbre geopolítica y disrupciones en supply chain',
    'Presión creciente por certificaciones ambientales de clientes US/EU'
  ],
  porQueEmpresa: [
    'Ubicación estratégica cercana a frontera norte',
    'Infraestructura moderna con altura libre >10m',
    'Certificaciones LEED o equivalentes',
    'Disponibilidad inmediata o <6 meses'
  ],
  kpis: [
    'Reducción de tiempo de entrega (lead time) vs. producción en Asia',
    'Cost per unit comparado con baseline asiático',
    'Porcentaje de producción con certificación ambiental',
    'Time-to-market para nuevos productos',
    'Disponibilidad de capacidad instalada vs. demanda proyectada'
  ]
};

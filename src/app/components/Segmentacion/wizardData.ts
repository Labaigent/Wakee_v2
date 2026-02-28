/**
 * Datos del flujo de Segmentación.
 * Nota: icpOptions fue eliminado — los ICPs se cargan desde Supabase
 * (ejecuciones.e3_ejecucion_outpu_icp) via useE3IcpOutputsQuery.
 */

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

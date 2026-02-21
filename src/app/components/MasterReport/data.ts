import { WeeklyReport } from './types';

export const weeklyReports: WeeklyReport[] = [
  {
    weekOf: '10 de Febrero, 2026',
    weekStart: '2026-02-10',
    weekEnd: '2026-02-16',
    lastUpdated: '2026-02-10T08:00:00',
    companySignals: [
      {
        id: 1,
        company: 'Amazon México',
        signal: 'Expansión de centros de distribución',
        description: '3 nuevos fulfillment centers en CDMX. Inversión $150M USD. Espacios 15,000-25,000 m² con altura >12m. La empresa confirmó que los espacios deberán estar operativos antes del Q2 2026 para cumplir con la demanda proyectada del e-commerce.',
        timing: 'Q2 2026',
        assetClass: 'Industrial',
        source: 'El Economista',
        sourceUrl: 'https://www.eleconomista.com.mx',
        date: '2026-02-08'
      },
      {
        id: 2,
        company: 'Mercado Libre',
        signal: 'Inversión en infraestructura logística',
        description: 'Plan de $200M USD para expandir red logística. Enfoque en last-mile y micro-fulfillment en ciudades tier 2. La estrategia incluye apertura de 12 centros distribuidos en todo el país.',
        timing: 'H1 2026',
        assetClass: 'Industrial',
        source: 'Bloomberg',
        sourceUrl: 'https://www.bloomberg.com',
        date: '2026-02-09'
      },
      {
        id: 3,
        company: 'HSBC México',
        signal: 'Consolidación de oficinas',
        description: 'Consolidar 5 edificios en 2 hubs premium. Búsqueda de ~8,000-10,000 m² con LEED. El banco busca reducir su footprint pero aumentar la calidad de sus espacios corporativos.',
        timing: 'Q3-Q4 2026',
        assetClass: 'Oficinas',
        source: 'Reforma',
        sourceUrl: 'https://www.reforma.com',
        date: '2026-02-10'
      },
      {
        id: 4,
        company: 'FEMSA (Oxxo)',
        signal: 'Centros de distribución urbanos',
        description: '12 centros en ciudades medias. Espacios 3,000-5,000 m² con acceso urbano. FEMSA planea optimizar su cadena de suministro con ubicaciones estratégicas más cercanas a puntos de venta.',
        timing: 'H2 2026-2027',
        assetClass: 'Industrial',
        source: 'Expansión',
        sourceUrl: 'https://www.expansion.mx',
        date: '2026-02-11'
      }
    ],
    marketHooks: [
      {
        id: 1,
        topic: 'Nearshoring',
        hook: 'Demanda industrial +45% YoY, ocupación 95% en corredores principales',
        data: ['IED manufactura: +$18B USD 2025', 'Escasez de espacios clase A certificados']
      },
      {
        id: 2,
        topic: 'Trabajo Híbrido',
        hook: 'Footprint -30%, pero renta premium +15%',
        data: ['Ocupación 60-70% vs. 85% pre-pandemia', 'Demanda LEED/WELL +25% YoY']
      },
      {
        id: 3,
        topic: 'Tasas de Interés',
        hook: 'Banxico 11%, expectativa 9.5% H2 2026. Arrendamientos activos.',
        data: ['Disponibilidad industrial: 4.2%', 'Disponibilidad oficinas A: 12.5%']
      },
      {
        id: 4,
        topic: 'E-commerce',
        hook: 'Crecimiento 23% YoY, demanda micro-fulfillment +60%',
        data: ['Ventas: $850B MXN 2025', 'Espacios 1,000-3,000 m² urbanos']
      }
    ]
  },
  {
    weekOf: '3 de Febrero, 2026',
    weekStart: '2026-02-03',
    weekEnd: '2026-02-09',
    lastUpdated: '2026-02-03T08:00:00',
    companySignals: [
      {
        id: 5,
        company: 'Tesla México',
        signal: 'Expansión de Gigafactory',
        description: 'Nueva fase de expansión requiere 50,000 m² adicionales para manufactura de baterías. Inversión de $500M USD confirmada por el board. Se buscan espacios con infraestructura eléctrica industrial de alta capacidad.',
        timing: 'Q3 2026',
        assetClass: 'Industrial',
        source: 'Reuters',
        sourceUrl: 'https://www.reuters.com',
        date: '2026-02-02'
      },
      {
        id: 6,
        company: 'Walmart de México',
        signal: 'Nuevos centros de distribución',
        description: '4 nuevos CEDIS para soportar expansión de e-commerce. Espacios de 30,000-40,000 m² en zonas estratégicas cerca de principales ciudades. Timeline agresivo para Q2-Q3 2026.',
        timing: 'Q2-Q3 2026',
        assetClass: 'Industrial',
        source: 'El Financiero',
        sourceUrl: 'https://www.elfinanciero.com.mx',
        date: '2026-02-04'
      },
      {
        id: 7,
        company: 'Banco Santander',
        signal: 'Modernización de sucursales',
        description: 'Renovación de 50 sucursales y apertura de 10 espacios premium. Búsqueda de ubicaciones en zonas de alto valor con certificación LEED Silver mínimo.',
        timing: 'H2 2026',
        assetClass: 'Oficinas',
        source: 'El Economista',
        sourceUrl: 'https://www.eleconomista.com.mx',
        date: '2026-02-05'
      }
    ],
    marketHooks: [
      {
        id: 5,
        topic: 'Manufactura Automotive',
        hook: 'Inversión extranjera +60% en sector automotriz',
        data: ['OEMs buscan proveedores tier-1 cerca de plantas', 'Demanda de espacios certificados ISO']
      },
      {
        id: 6,
        topic: 'Retail Tradicional',
        hook: 'Cierre de tiendas físicas -15%, apertura de showrooms +25%',
        data: ['Espacios más pequeños pero premium', 'Integración omnicanal']
      }
    ]
  },
  {
    weekOf: '27 de Enero, 2026',
    weekStart: '2026-01-27',
    weekEnd: '2026-02-02',
    lastUpdated: '2026-01-27T08:00:00',
    companySignals: [
      {
        id: 8,
        company: 'DHL México',
        signal: 'Red de hubs urbanos',
        description: 'Plan de 20 micro-hubs en ciudades principales para last-mile delivery. Espacios de 1,500-3,000 m² con ubicación urbana estratégica. Inversión total $80M USD.',
        timing: 'H1 2026',
        assetClass: 'Industrial',
        source: 'T21',
        sourceUrl: 'https://www.t21.com.mx',
        date: '2026-01-26'
      },
      {
        id: 9,
        company: 'Google México',
        signal: 'Apertura de nuevo campus',
        description: 'Búsqueda de 12,000 m² para nuevo campus tecnológico. Requisitos: LEED Platinum, amenidades clase mundial, ubicación premium en CDMX o Guadalajara.',
        timing: 'Q4 2026',
        assetClass: 'Oficinas',
        source: 'Forbes México',
        sourceUrl: 'https://www.forbes.com.mx',
        date: '2026-01-28'
      },
      {
        id: 10,
        company: 'Grupo Bimbo',
        signal: 'Centros de distribución automatizados',
        description: 'Inversión de $300M MXN en 3 centros con automatización total. Búsqueda de espacios 20,000+ m² con altura libre >15m para racks automatizados.',
        timing: 'Q2-Q3 2026',
        assetClass: 'Industrial',
        source: 'El Economista',
        sourceUrl: 'https://www.eleconomista.com.mx',
        date: '2026-01-30'
      }
    ],
    marketHooks: [
      {
        id: 7,
        topic: 'Tecnología',
        hook: 'Empresas tech aumentando presencia en México +40%',
        data: ['Hubs de innovación en ciudades secundarias', 'Demanda de espacios flexibles']
      },
      {
        id: 8,
        topic: 'Logística Urbana',
        hook: 'Última milla impulsa demanda de espacios urbanos pequeños',
        data: ['Micro-hubs <3,000 m² en alta demanda', 'Rentas urbanas +20% YoY']
      }
    ]
  }
];

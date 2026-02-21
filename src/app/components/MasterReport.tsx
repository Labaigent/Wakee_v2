// Report
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Loader2, ChevronDown, ChevronUp, ExternalLink, ChevronLeft, ChevronRight, Calendar, Building2, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';

interface CompanySignal {
  id: number;
  company: string;
  signal: string;
  description: string;
  timing: string;
  assetClass: string;
  source: string;
  sourceUrl: string;
  date: string;
}

interface MarketHook {
  id: number;
  topic: string;
  hook: string;
  data: string[];
}

interface WeeklyReport {
  weekOf: string;
  weekStart: string;
  weekEnd: string;
  lastUpdated: string;
  companySignals: CompanySignal[];
  marketHooks: MarketHook[];
}

type CategoryTab = 'companies' | 'market';

export function MasterReport() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSignals, setExpandedSignals] = useState<number[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<CategoryTab>('companies');

  // Mock data - múltiples semanas de reportes
  const weeklyReports: WeeklyReport[] = [
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

  const currentReport = weeklyReports[currentWeekIndex];

  const toggleSignal = (id: number) => {
    setExpandedSignals(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Reporte actualizado con datos recientes');
    setIsRefreshing(false);
  };

  const goToPreviousWeek = () => {
    if (currentWeekIndex < weeklyReports.length - 1) {
      setCurrentWeekIndex(prev => prev + 1);
      setExpandedSignals([]);
      toast.info(`Semana del ${weeklyReports[currentWeekIndex + 1].weekOf}`);
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(prev => prev - 1);
      setExpandedSignals([]);
      toast.info(`Semana del ${weeklyReports[currentWeekIndex - 1].weekOf}`);
    }
  };

  const formatSignalDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8">
      {/* Header with Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-medium mb-2">Master Intelligence Report</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Actualizado: {new Date(currentReport.lastUpdated).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto border-[#1F554A] text-[#1F554A] hover:bg-[#1F554A] hover:text-white"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <RefreshCw className="size-4 mr-2" />
                Actualizar
              </>
            )}
          </Button>
        </div>

        {/* Week Navigation - iPhone Style - Responsive */}
        <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 py-3 sm:py-4 bg-[#C4FF81]/10 rounded-lg border-2 border-[#DCDEDC]">
          <Button
            onClick={goToPreviousWeek}
            disabled={currentWeekIndex >= weeklyReports.length - 1}
            variant="ghost"
            size="sm"
            className="disabled:opacity-30 px-2 sm:px-3 hover:bg-[#1F554A]/10"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial sm:min-w-[300px] justify-center">
            <Calendar className="size-3 sm:size-4 text-[#1F554A] hidden sm:block" />
            <div className="text-center">
              <p className="font-medium text-[#141414] text-sm sm:text-base">Semana del {currentReport.weekOf}</p>
              <p className="text-[10px] sm:text-xs text-gray-600">
                {new Date(currentReport.weekStart).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {new Date(currentReport.weekEnd).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] sm:text-xs border-[#1F554A] text-[#1F554A]">
              {currentWeekIndex + 1}/{weeklyReports.length}
            </Badge>
          </div>

          <Button
            onClick={goToNextWeek}
            disabled={currentWeekIndex <= 0}
            variant="ghost"
            size="sm"
            className="disabled:opacity-30 px-2 sm:px-3 hover:bg-[#1F554A]/10"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b-2 border-[#DCDEDC]">
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-all border-b-2 ${
              activeTab === 'companies'
                ? 'border-[#1F554A] text-[#1F554A] bg-[#C4FF81]/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="size-4" />
            <span className="hidden sm:inline">Señales de Compañías</span>
            <span className="sm:hidden">Compañías</span>
            <Badge className={`text-xs ${activeTab === 'companies' ? 'bg-[#1F554A] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {currentReport.companySignals.length}
            </Badge>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-all border-b-2 ${
              activeTab === 'market'
                ? 'border-[#1F554A] text-[#1F554A] bg-[#C4FF81]/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="size-4" />
            <span className="hidden sm:inline">Ganchos de Mercado</span>
            <span className="sm:hidden">Mercado</span>
            <Badge className={`text-xs ${activeTab === 'market' ? 'bg-[#1F554A] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {currentReport.marketHooks.length}
            </Badge>
          </button>
        </div>
      </div>

      {/* Company Signals Tab Content */}
      {activeTab === 'companies' && (
        <div>
          <div className="mb-4 sm:mb-6">
            <p className="text-sm text-gray-600">
              Señales específicas de empresas que están activamente buscando espacios o expandiendo operaciones
            </p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {currentReport.companySignals.map((signal) => {
              const isExpanded = expandedSignals.includes(signal.id);
              const truncatedDesc = signal.description.length > 120 
                ? signal.description.substring(0, 120) + '...' 
                : signal.description;
              
              return (
                <div key={signal.id} className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-5 hover:border-[#1F554A] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-medium text-base text-[#141414]">{signal.company}</h4>
                        <Badge variant="secondary" className="text-xs bg-[#DCDEDC] text-gray-700">
                          {formatSignalDate(signal.date)}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-[#1F554A] mb-2">{signal.signal}</p>
                    </div>
                    <div className="flex gap-2 sm:gap-3 text-xs flex-shrink-0">
                      <Badge className="bg-[#1F554A] text-white">
                        {signal.assetClass}
                      </Badge>
                      <Badge variant="outline" className="border-[#1F554A] text-[#1F554A]">
                        {signal.timing}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {isExpanded ? signal.description : truncatedDesc}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a 
                      href={signal.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-[#1F554A] hover:text-[#1F554A]/80 flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="size-3" />
                      {signal.source}
                    </a>
                    {signal.description.length > 120 && (
                      <button
                        onClick={() => toggleSignal(signal.id)}
                        className="text-xs text-[#1F554A] hover:text-[#1F554A]/80 flex items-center gap-1 font-medium"
                      >
                        {isExpanded ? (
                          <>Ver menos <ChevronUp className="size-3" /></>
                        ) : (
                          <>Ver más <ChevronDown className="size-3" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Market Hooks Tab Content */}
      {activeTab === 'market' && (
        <div>
          <div className="mb-4 sm:mb-6">
            <p className="text-sm text-gray-600">
              Tendencias macro, regulaciones, incentivos fiscales y dinámicas de mercado que impulsan la demanda inmobiliaria
            </p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {currentReport.marketHooks.map((hook) => (
              <div key={hook.id} className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-5 hover:border-[#1F554A] transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="size-8 rounded-full bg-[#1F554A] text-white flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-base text-[#141414] mb-2">{hook.topic}</h4>
                    <p className="text-sm text-[#1F554A] font-medium mb-3">{hook.hook}</p>
                  </div>
                </div>
                <div className="ml-11">
                  <ul className="space-y-2">
                    {hook.data.map((d, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-[#1F554A] font-bold mt-0.5">→</span>
                        <span className="flex-1">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Guide */}
      <div className="border-t-2 border-[#DCDEDC] pt-6 sm:pt-8">
        <h3 className="text-sm font-medium mb-3 text-[#141414] uppercase tracking-wide">Cómo usar este reporte</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#1F554A] font-bold mt-0.5">1.</span>
            <span>Usa el contexto al completar "Nueva Sesión" de prospección</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1F554A] font-bold mt-0.5">2.</span>
            <span>Incorpora ganchos de mercado en tus correos para demostrar expertise</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1F554A] font-bold mt-0.5">3.</span>
            <span>Identifica empresas con señales activas para prospección directa</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1F554A] font-bold mt-0.5">4.</span>
            <span>Usa datos específicos como talking points en llamadas y reuniones</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// React
import { useState } from 'react';

// External libraries
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Building2,
  Briefcase,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

// Internal — components
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  companySize: string;
  finalScore: number;
  dossier: {
    summary: string;
    mindset: string;
    companyDirection: string;
    recentActivity: string[];
    keyInsights: string[];
  };
}

interface StepDossierProps {
  sessionId: string;
  selectedLeads: string[];
  onGenerateEmails: () => void;
}

export function StepDossier({ selectedLeads, onGenerateEmails }: StepDossierProps) {
  // --- State ---
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  // Mock: datos vendrían del backend después de E9
  const leads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Carlos Mendoza',
      title: 'VP of Operations',
      company: 'Grupo Logístico del Norte',
      companySize: '500-1000 empleados',
      finalScore: 90,
      dossier: {
        summary: 'Carlos lidera operaciones en una empresa logística en rápida expansión. Con 15+ años en supply chain, busca optimizar infraestructura para soportar crecimiento del 45% YoY.',
        mindset: 'Orientado a resultados y eficiencia operativa. Valora proveedores que entienden las necesidades logísticas modernas. Decisiones basadas en ROI y tiempo de implementación.',
        companyDirection: 'Expansión agresiva en nearshoring. Apertura de 3 nuevos hubs en Q2 2026. Inversión de $150M USD en infraestructura. Enfoque en automatización y sostenibilidad.',
        recentActivity: [
          'Publicó sobre "El futuro del nearshoring en México" hace 3 días',
          'Asistió a AMLO Logistics Summit 2026',
          'Compartió artículo sobre centros de distribución automatizados'
        ],
        keyInsights: [
          'Busca espacios 15,000-25,000 m² con altura >12m',
          'Prioriza ubicaciones cercanas a CDMX con acceso a autopistas',
          'Timeline urgente: necesita operación en Q2 2026',
          'Experiencia previa en build-to-suit'
        ]
      }
    },
    {
      id: 'lead-2',
      name: 'Ana Patricia Torres',
      title: 'Director de Supply Chain',
      company: 'Manufactura Industrial MX',
      companySize: '200-500 empleados',
      finalScore: 87,
      dossier: {
        summary: 'Ana dirige la estrategia de supply chain para un fabricante en proceso de relocalization desde Asia. Enfocada en certificaciones ambientales y eficiencia.',
        mindset: 'Estratégica y orientada a sostenibilidad. Busca socios de largo plazo que compartan valores ESG. Toma decisiones consultando múltiples stakeholders.',
        companyDirection: 'Transición de manufactura Asia → México completándose en H2 2026. Certificación LEED en proceso. Budget aprobado para 10,000-30,000 m².',
        recentActivity: [
          'Comentó en post sobre certificaciones LEED hace 1 semana',
          'Conectó con 5 proveedores de real estate industrial',
          'Publicó sobre su experiencia en nearshoring'
        ],
        keyInsights: [
          'LEED/certificaciones son requisito no negociable',
          'Proceso de decisión involucra CFO y CEO',
          'Timeline flexible pero preferencia Q3 2026',
          'Interés en espacios modulares/escalables'
        ]
      }
    },
    {
      id: 'lead-3',
      name: 'Roberto Sánchez',
      title: 'COO',
      company: 'Autopartes del Bajío',
      companySize: '1000+ empleados',
      finalScore: 87,
      dossier: {
        summary: 'Roberto es COO de un tier-1 automotive supplier. Gestiona operaciones de $500M+ USD. Busca expandir capacidad para nuevos contratos con OEMs.',
        mindset: 'Ejecutivo senior con foco en crecimiento estratégico. Valora relaciones de largo plazo y providers con track record comprobado. Decisiones lentas pero contratos grandes.',
        companyDirection: 'Nuevos contratos con Tesla y GM requieren 20,000 m² adicionales. Build-to-suit preferido. Inversión $50M+ USD aprobada por board.',
        recentActivity: [
          'Asistió a Automotive Supply Chain Conference',
          'Publicó sobre expansión de capacidad hace 2 semanas',
          'Compartió análisis de mercado automotriz'
        ],
        keyInsights: [
          'Build-to-suit es la opción preferida',
          'Ubicación cerca de plantas GM/Tesla crítica',
          'Contratos típicamente 10-15 años',
          'Múltiples stakeholders en decisión (Board, CFO, VPs)'
        ]
      }
    },
    {
      id: 'lead-4',
      name: 'María Fernanda Gutiérrez',
      title: 'VP of Real Estate',
      company: 'E-commerce Solutions LATAM',
      companySize: '200-500 empleados',
      finalScore: 84,
      dossier: {
        summary: 'María gestiona el portfolio de real estate para una plataforma de e-commerce. Especializada en micro-fulfillment y last-mile logistics.',
        mindset: 'Innovadora y orientada a tecnología. Busca espacios adaptables para automatización. Decisiones rápidas pero presupuestos ajustados.',
        companyDirection: 'Expansión de red de micro-fulfillment a 12 ciudades tier 2. Modelo de espacios 3,000-8,000 m² con tecnología integrada.',
        recentActivity: [
          'Publicó sobre micro-fulfillment trends',
          'Asistió a E-commerce Innovation Summit',
          'Conectó con tech providers de automatización'
        ],
        keyInsights: [
          'Espacios más pequeños (3K-8K m²) pero múltiples ubicaciones',
          'Tecnología/automatización es diferenciador clave',
          'Contratos típicamente 3-5 años con opciones de renovación',
          'Budget medio pero volumen de transacciones alto'
        ]
      }
    },
    {
      id: 'lead-5',
      name: 'Jorge Luis Ramírez',
      title: 'Director de Operaciones',
      company: 'Distribuidora Nacional',
      companySize: '500-1000 empleados',
      finalScore: 84,
      dossier: {
        summary: 'Jorge dirige operaciones para un distribuidor nacional. Enfocado en expandir capacidad de almacenamiento en zonas urbanas.',
        mindset: 'Pragmático y orientado a costos. Busca soluciones eficientes sin complejidad innecesaria. Valora proveedores con experiencia en el sector.',
        companyDirection: 'Consolidación de 5 centros pequeños en 2 hubs grandes. Budget $30M MXN aprobado para Q1-Q2 2026.',
        recentActivity: [
          'Compartió análisis de eficiencia logística',
          'Comentó en post sobre costos de almacenamiento',
          'Asistió a expo de logística'
        ],
        keyInsights: [
          'Costo por m² es factor decisivo',
          'Ubicación urbana con buena conectividad',
          'Timeline inmediato (Q1-Q2 2026)',
          'Experiencia previa con espacios similares'
        ]
      }
    }
  ];

  // Filtrar solo los leads seleccionados
  const selectedLeadData = leads.filter(lead => selectedLeads.includes(lead.id));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            E9 Completado
          </Badge>
          <span className="text-xs text-gray-400">→</span>
          <Badge className="text-xs bg-[#1F554A] text-white">
            Paso 2.7: Dossiers Generados
          </Badge>
        </div>
        <h2 className="text-xl sm:text-2xl font-medium mb-2">Dossiers de tu Top 5</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Revisa el contexto detallado de cada lead antes de generar correos personalizados
        </p>
      </div>

      {/* Dossiers Accordion */}
      <div className="space-y-3 sm:space-y-4">
        {selectedLeadData.map((lead, index) => {
          const isExpanded = expandedLead === lead.id;
          
          return (
            <div
              key={lead.id}
              className={`border rounded-lg transition-all ${
                isExpanded ? 'border-[#1F554A] bg-[#C4FF81]/5' : 'border-[#DCDEDC]'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="size-8 sm:size-10 rounded-full bg-[#1F554A] text-white flex items-center justify-center font-medium text-sm sm:text-base flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-lg truncate">{lead.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{lead.title} • {lead.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 ml-2 flex-shrink-0">
                  <Badge className="bg-[#1F554A] text-white text-xs">
                    {lead.finalScore}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="size-4 sm:size-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="size-4 sm:size-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6 border-t border-[#DCDEDC]">
                  {/* Summary */}
                  <div className="pt-4 sm:pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="size-3 sm:size-4 text-[#1F554A]" />
                      <h4 className="font-medium text-xs sm:text-sm">Resumen del Lead</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {lead.dossier.summary}
                    </p>
                  </div>

                  {/* Mindset */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="size-3 sm:size-4 text-[#1F554A]" />
                      <h4 className="font-medium text-xs sm:text-sm">Mentalidad y Estilo de Decisión</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {lead.dossier.mindset}
                    </p>
                  </div>

                  {/* Company Direction */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="size-3 sm:size-4 text-[#1F554A]" />
                      <h4 className="font-medium text-xs sm:text-sm">Dirección de la Empresa</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {lead.dossier.companyDirection}
                    </p>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="size-3 sm:size-4 text-[#1F554A]" />
                      <h4 className="font-medium text-xs sm:text-sm">Actividad Reciente (LinkedIn)</h4>
                    </div>
                    <ul className="space-y-2">
                      {lead.dossier.recentActivity.map((activity, i) => (
                        <li key={i} className="text-xs sm:text-sm text-gray-700 flex gap-2">
                          <span className="text-[#1F554A]">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="size-3 sm:size-4 text-[#1F554A]" />
                      <h4 className="font-medium text-xs sm:text-sm">Insights Clave</h4>
                    </div>
                    <ul className="space-y-2">
                      {lead.dossier.keyInsights.map((insight, i) => (
                        <li key={i} className="text-xs sm:text-sm text-gray-700 flex gap-2">
                          <span className="text-[#1F554A] font-bold">→</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="border-t border-[#DCDEDC] pt-6">
        <div className="bg-[#C4FF81]/10 border border-[#C4FF81]/30 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-base sm:text-lg mb-2">¿Listo para contactar?</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Genera 5 correos personalizados basados en los dossiers. Cada correo incluirá contexto específico del lead y su empresa.
              </p>
              <ul className="text-xs text-gray-600 space-y-1 mb-4">
                <li>✓ Asunto personalizado por lead</li>
                <li>✓ Contexto de industria y señales del Master Report</li>
                <li>✓ Tono ajustado al perfil y mentalidad</li>
                <li>✓ Editables directamente en la app</li>
              </ul>
            </div>
            <div className="sm:ml-6">
              <Button
                onClick={onGenerateEmails}
                className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90 w-full sm:w-auto"
                size="lg"
              >
                <Mail className="size-4 mr-2" />
                Generar Correos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

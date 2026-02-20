import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Building2,
  Users,
  Mail,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Session {
  id: string;
  name: string;
  createdAt: string;
  completedAt: string;
  status: 'completed';
  broker: string;
  assetClass: string;
  icp: {
    profile: string;
    painPoint: string;
  };
  persona: {
    title: string;
    seniority: string;
  };
  top5Leads: {
    name: string;
    company: string;
    title: string;
    finalScore: number;
  }[];
  emailsSent: number;
}

export function SessionHistory() {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  // Mock data - esto vendría del backend
  const sessions: Session[] = [
    {
      id: 'session-001',
      name: 'Sesión Industrial - Nearshoring',
      createdAt: '2026-02-10T09:00:00',
      completedAt: '2026-02-10T11:30:00',
      status: 'completed',
      broker: 'Broker C&W',
      assetClass: 'Industrial',
      icp: {
        profile: 'Empresas manufactureras relocalizando desde Asia',
        painPoint: 'Necesitan naves industriales certificadas LEED cerca de frontera norte'
      },
      persona: {
        title: 'VP Operations / COO / Director Supply Chain',
        seniority: 'C-Level y VP'
      },
      top5Leads: [
        {
          name: 'Carlos Mendoza',
          company: 'Grupo Logístico del Norte',
          title: 'VP of Operations',
          finalScore: 90
        },
        {
          name: 'Ana Patricia Torres',
          company: 'Manufactura Industrial MX',
          title: 'Director de Supply Chain',
          finalScore: 87
        },
        {
          name: 'Roberto Sánchez',
          company: 'Autopartes del Bajío',
          title: 'COO',
          finalScore: 87
        },
        {
          name: 'María Fernanda Gutiérrez',
          company: 'E-commerce Solutions LATAM',
          title: 'VP of Real Estate',
          finalScore: 84
        },
        {
          name: 'Jorge Luis Ramírez',
          company: 'Distribuidora Nacional',
          title: 'Director de Operaciones',
          finalScore: 84
        }
      ],
      emailsSent: 5
    },
    {
      id: 'session-002',
      name: 'Sesión Oficinas - Consolidación Financiera',
      createdAt: '2026-02-05T14:00:00',
      completedAt: '2026-02-05T16:45:00',
      status: 'completed',
      broker: 'Broker C&W',
      assetClass: 'Oficinas',
      icp: {
        profile: 'Instituciones financieras consolidando espacios',
        painPoint: 'Buscan oficinas clase A+ con certificación LEED/WELL en zonas premium'
      },
      persona: {
        title: 'CFO / VP Real Estate / Facilities Manager',
        seniority: 'C-Level y VP'
      },
      top5Leads: [
        {
          name: 'Patricia Ramírez',
          company: 'Banco Metropolitano',
          title: 'CFO',
          finalScore: 92
        },
        {
          name: 'Luis González',
          company: 'Seguros Premium',
          title: 'VP Real Estate',
          finalScore: 89
        },
        {
          name: 'Carmen Flores',
          company: 'Inversiones del Norte',
          title: 'Director de Operaciones',
          finalScore: 85
        },
        {
          name: 'Ricardo Martínez',
          company: 'Fintech Solutions',
          title: 'COO',
          finalScore: 83
        },
        {
          name: 'Sofía Hernández',
          company: 'Grupo Financiero MX',
          title: 'VP Facilities',
          finalScore: 82
        }
      ],
      emailsSent: 5
    },
    {
      id: 'session-003',
      name: 'Sesión Industrial - E-commerce Logistics',
      createdAt: '2026-01-28T10:30:00',
      completedAt: '2026-01-28T13:00:00',
      status: 'completed',
      broker: 'Broker C&W',
      assetClass: 'Industrial',
      icp: {
        profile: 'Operadores de e-commerce expandiendo infraestructura logística',
        painPoint: 'Necesitan micro-fulfillment centers en ciudades tier 2'
      },
      persona: {
        title: 'VP Logistics / Director Supply Chain / Head of Real Estate',
        seniority: 'VP y Director'
      },
      top5Leads: [
        {
          name: 'Alejandro Ruiz',
          company: 'RetailTech México',
          title: 'VP Logistics',
          finalScore: 88
        },
        {
          name: 'Diana López',
          company: 'Fulfillment Pro',
          title: 'Director de Operaciones',
          finalScore: 86
        },
        {
          name: 'Fernando Castro',
          company: 'LogiHub LATAM',
          title: 'Head of Real Estate',
          finalScore: 84
        },
        {
          name: 'Gabriela Torres',
          company: 'Express Delivery MX',
          title: 'VP Supply Chain',
          finalScore: 82
        },
        {
          name: 'Miguel Ángel Pérez',
          company: 'Almacenamiento Urbano',
          title: 'COO',
          finalScore: 81
        }
      ],
      emailsSent: 5
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m`;
    }
    return `${diffMins}m`;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-medium mb-2">Sesiones Pasadas</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Historial completo de tus sesiones de prospección con ICPs, leads y correos generados
        </p>
      </div>

      {/* Stats Summary - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="border-2 border-[#DCDEDC] rounded-lg p-3 sm:p-4 bg-white hover:border-[#1F554A] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="size-4 text-[#1F554A]" />
            <p className="text-xs sm:text-sm text-gray-600">Sesiones</p>
          </div>
          <p className="text-xl sm:text-2xl font-medium text-[#141414]">{sessions.length}</p>
        </div>
        <div className="border-2 border-[#DCDEDC] rounded-lg p-3 sm:p-4 bg-white hover:border-[#1F554A] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4 text-[#1F554A]" />
            <p className="text-xs sm:text-sm text-gray-600">Leads</p>
          </div>
          <p className="text-xl sm:text-2xl font-medium text-[#141414]">{sessions.length * 5}</p>
        </div>
        <div className="border-2 border-[#DCDEDC] rounded-lg p-3 sm:p-4 bg-white hover:border-[#1F554A] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="size-4 text-[#1F554A]" />
            <p className="text-xs sm:text-sm text-gray-600">Correos</p>
          </div>
          <p className="text-xl sm:text-2xl font-medium text-[#141414]">{sessions.reduce((acc, s) => acc + s.emailsSent, 0)}</p>
        </div>
        <div className="border-2 border-[#DCDEDC] rounded-lg p-3 sm:p-4 bg-white hover:border-[#1F554A] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="size-4 text-[#1F554A]" />
            <p className="text-xs sm:text-sm text-gray-600">Asset Classes</p>
          </div>
          <p className="text-xl sm:text-2xl font-medium text-[#141414]">{new Set(sessions.map(s => s.assetClass)).size}</p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Historial</h3>
        
        {sessions.map((session, index) => {
          const isExpanded = expandedSession === session.id;
          
          return (
            <div
              key={session.id}
              className={`border-2 rounded-lg transition-all ${
                isExpanded ? 'border-[#1F554A] bg-[#C4FF81]/5' : 'border-[#DCDEDC]'
              }`}
            >
              {/* Session Header */}
              <button
                onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 text-left min-w-0">
                  <div className="size-8 sm:size-10 rounded-full bg-[#1F554A] text-white flex items-center justify-center font-medium text-sm flex-shrink-0">
                    {sessions.length - index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2 text-[#141414]">{session.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 flex-shrink-0" />
                        <span className="truncate">{formatDate(session.completedAt)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 flex-shrink-0" />
                        {calculateDuration(session.createdAt, session.completedAt)}
                      </span>
                      <Badge variant="outline" className="text-xs border-[#1F554A] text-[#1F554A]">
                        {session.assetClass}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 ml-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-medium text-[#141414]">{session.top5Leads.length} leads</p>
                    <p className="text-xs text-gray-500">{session.emailsSent} correos</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="size-4 sm:size-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="size-4 sm:size-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-5 sm:space-y-6 border-t border-[#DCDEDC]">
                  {/* ICP */}
                  <div className="pt-4 sm:pt-5">
                    <h4 className="text-sm font-medium text-[#141414] mb-3 uppercase tracking-wide">ICP (Ideal Customer Profile)</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Perfil</p>
                        <p className="text-sm text-gray-700">{session.icp.profile}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Pain Point</p>
                        <p className="text-sm text-gray-700">{session.icp.painPoint}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#DCDEDC]" />

                  {/* Persona */}
                  <div>
                    <h4 className="text-sm font-medium text-[#141414] mb-3 uppercase tracking-wide">Buyer Persona</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Títulos</p>
                        <p className="text-sm text-gray-700">{session.persona.title}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Seniority</p>
                        <p className="text-sm text-gray-700">{session.persona.seniority}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#DCDEDC]" />

                  {/* Top 5 Leads */}
                  <div>
                    <h4 className="text-sm font-medium text-[#141414] mb-3 uppercase tracking-wide">Top 5 Leads Seleccionados</h4>
                    <div className="space-y-2">
                      {session.top5Leads.map((lead, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#DCDEDC] hover:border-[#1F554A] transition-colors"
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="font-medium text-sm text-[#141414] truncate">{lead.name}</p>
                            <p className="text-xs text-gray-600 truncate">{lead.title} • {lead.company}</p>
                          </div>
                          <Badge className="bg-[#1F554A] text-white text-xs flex-shrink-0">
                            {lead.finalScore}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-[#C4FF81]/10 border border-[#C4FF81]/30 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xl sm:text-2xl font-medium text-[#141414]">{session.top5Leads.length}</p>
                        <p className="text-xs text-gray-600">Leads</p>
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-medium text-[#141414]">{session.emailsSent}</p>
                        <p className="text-xs text-gray-600">Correos</p>
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-medium text-[#141414]">
                          {Math.round(session.top5Leads.reduce((acc, l) => acc + l.finalScore, 0) / session.top5Leads.length)}
                        </p>
                        <p className="text-xs text-gray-600">Score Avg</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State (if no sessions) */}
      {sessions.length === 0 && (
        <div className="text-center py-12 border-2 border-[#DCDEDC] rounded-lg bg-white">
          <Calendar className="size-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-[#141414]">No hay sesiones completadas</h3>
          <p className="text-sm text-gray-600 mb-4">
            Completa tu primera sesión de prospección para verla aquí
          </p>
          <Button className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90">Crear Nueva Sesión</Button>
        </div>
      )}
    </div>
  );
}

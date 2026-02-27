import { useState } from 'react';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';
import { 
  Loader2,
  CheckCircle2,
  Building2,
  Briefcase,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  companySize: string;
  industry: string;
  location: {
    city: string;
    country: string;
  };
  icpScore: number;
  companyScore: number;
  finalScore: number;
  justification: string;
  justificationPoints: string[];
  signals: string[];
  linkedinUrl: string;
}

interface StepRankingProps {
  sessionId: string;
  onComplete: (selectedLeads: string[]) => void;
}

export function StepRanking({ onComplete }: StepRankingProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showProcessing, setShowProcessing] = useState(false);

  // Mock data - esto vendría de E8
  const leads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Carlos Mendoza',
      title: 'VP of Operations',
      company: 'Grupo Logístico del Norte',
      companySize: '500-1000 empleados',
      industry: 'Logística',
      location: { city: 'Monterrey', country: 'México' },
      icpScore: 92,
      companyScore: 88,
      finalScore: 90,
      justification: 'Alta alineación con ICP de nearshoring. La empresa ha anunciado expansión de 15,000 m² en Q2 2026. Señales fuertes de relocalization desde Asia.',
      justificationPoints: ['Alta alineación con ICP de nearshoring', 'Expansión anunciada de 15,000 m² en Q2 2026', 'Señales fuertes de relocalization desde Asia'],
      signals: ['Expansión anunciada', 'Budget confirmado Q2', 'Nearshoring activo'],
      linkedinUrl: 'https://linkedin.com/in/example'
    },
    {
      id: 'lead-2',
      name: 'Ana Patricia Torres',
      title: 'Director de Supply Chain',
      company: 'Manufactura Industrial MX',
      companySize: '200-500 empleados',
      industry: 'Manufactura',
      location: { city: 'Querétaro', country: 'México' },
      icpScore: 88,
      companyScore: 85,
      finalScore: 87,
      justification: 'Empresa en proceso de certificación LEED. Búsqueda activa de naves industriales cerca de frontera norte con altura libre >10m.',
      justificationPoints: ['Empresa en proceso de certificación LEED', 'Búsqueda activa de naves industriales cerca de frontera norte con altura libre >10m'],
      signals: ['Certificación LEED en proceso', 'Búsqueda activa', 'Timeline: Q3 2026'],
      linkedinUrl: 'https://linkedin.com/in/example'
    },
    {
      id: 'lead-3',
      name: 'Roberto Sánchez',
      title: 'COO',
      company: 'Autopartes del Bajío',
      companySize: '1000+ empleados',
      industry: 'Automotriz',
      location: { city: 'Aguascalientes', country: 'México' },
      icpScore: 85,
      companyScore: 90,
      finalScore: 87,
      justification: 'Cliente potencial para build-to-suit. Tendencia macro fuerte en sector automotriz. Múltiples stakeholders identificados.',
      justificationPoints: ['Cliente potencial para build-to-suit', 'Tendencia macro fuerte en sector automotriz', 'Múltiples stakeholders identificados'],
      signals: ['Build-to-suit candidato', 'Sector en crecimiento', 'Contratos largos típicos'],
      linkedinUrl: 'https://linkedin.com/in/example'
    },
    {
      id: 'lead-4',
      name: 'María Fernanda Gutiérrez',
      title: 'VP of Real Estate',
      company: 'E-commerce Solutions LATAM',
      companySize: '200-500 empleados',
      industry: 'E-commerce',
      location: { city: 'Ciudad de México', country: 'México' },
      icpScore: 86,
      companyScore: 82,
      finalScore: 84,
      justification: 'Operador de fulfillment centers. Alta demanda de espacios con automatización. Renovaciones frecuentes indican oportunidades continuas.',
      justificationPoints: ['Operador de fulfillment centers', 'Alta demanda de espacios con automatización', 'Renovaciones frecuentes indican oportunidades continuas'],
      signals: ['Fulfillment activo', 'Tech logistics', 'Proximidad rutas clave'],
      linkedinUrl: 'https://linkedin.com/in/example'
    },
    {
      id: 'lead-5',
      name: 'Jorge Luis Ramírez',
      title: 'Director de Operaciones',
      company: 'Distribuidora Nacional',
      companySize: '500-1000 empleados',
      industry: 'Distribución',
      location: { city: 'Guadalajara', country: 'México' },
      icpScore: 84,
      companyScore: 83,
      finalScore: 84,
      justification: 'Necesidad de espacios de almacenamiento cercanos a centros urbanos. Presupuesto medio-alto confirmado para Q1-Q2 2026.',
      justificationPoints: ['Necesidad de espacios de almacenamiento cercanos a centros urbanos', 'Presupuesto medio-alto confirmado para Q1-Q2 2026'],
      signals: ['Urgencia por expansión', 'Presupuesto confirmado', 'Alta conectividad requerida'],
      linkedinUrl: 'https://linkedin.com/in/example'
    },
    // Agregar más leads hasta ~15-20 para simulación
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `lead-${i + 6}`,
      name: `Lead ${i + 6}`,
      title: 'Operations Manager',
      company: `Empresa ${i + 6}`,
      companySize: '100-500 empleados',
      industry: 'Industrial',
      location: { city: 'León', country: 'México' },
      icpScore: 80 - i,
      companyScore: 78 - i,
      finalScore: 79 - i,
      justification: `Lead identificado con score ${79 - i}. Señales moderadas de interés en el sector.`,
      justificationPoints: [`Lead identificado con score ${79 - i}`, 'Señales moderadas de interés en el sector'],
      signals: ['Señal 1', 'Señal 2'],
      linkedinUrl: 'https://linkedin.com/in/example'
    }))
  ];

  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads(prev => {
      if (prev.includes(leadId)) {
        return prev.filter(id => id !== leadId);
      }
      if (prev.length >= 5) {
        toast.warning('Máximo 5 leads permitidos');
        return prev;
      }
      return [...prev, leadId];
    });
  };

  const handleSubmit = async () => {
    if (selectedLeads.length !== 5) {
      toast.error('Debes seleccionar exactamente 5 leads');
      return;
    }

    setIsSubmitting(true);
    setShowProcessing(true);

    // Simular E9: generación de dossier e inteligencia LinkedIn
    const stages = [
      { progress: 20, status: 'Recopilando información de LinkedIn...' },
      { progress: 40, status: 'Analizando actividad reciente de cada lead...' },
      { progress: 60, status: 'Generando dossiers personalizados...' },
      { progress: 80, status: 'Creando research de empresas...' },
      { progress: 100, status: 'Completado' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingProgress(stage.progress);
      setProcessingStatus(stage.status);
    }

    toast.success('Top 5 guardado. Dossiers generados correctamente.');
    setIsSubmitting(false);
    onComplete(selectedLeads);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#1F554A] bg-[#C4FF81]/20 border-[#1F554A]';
    if (score >= 75) return 'text-[#1F554A] bg-[#C4FF81]/10 border-[#DCDEDC]';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  if (showProcessing) {
    return (
      <div className="space-y-8 py-12">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="flex justify-center">
            <Loader2 className="size-12 animate-spin text-[#1F554A]" />
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-medium mb-2">Generando dossiers e inteligencia</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Estamos preparando información detallada de tus 5 leads seleccionados
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1F554A] transition-all duration-500"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{processingStatus}</p>
          </div>

          <div className="pt-4 text-xs text-gray-600 space-y-1">
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#1F554A]">•</span> Investigando actividad reciente en LinkedIn
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#1F554A]">•</span> Generando dossier personalizado por lead
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#1F554A]">•</span> Creando company research
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            E6-E8 Completado
          </Badge>
          <span className="text-xs text-gray-400">→</span>
          <Badge className="text-xs bg-[#1F554A] text-white">
            Paso 2.5: Selección Top 5
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <h2 className="text-xl sm:text-2xl font-medium text-[#141414]">Ranking de Leads</h2>
          <Badge variant="outline" className="text-sm border-[#1F554A] text-[#1F554A] w-fit">
            {leads.length} leads encontrados
          </Badge>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Selecciona exactamente 5 leads para generar dossiers e inteligencia LinkedIn detallada
        </p>
      </div>

      {/* Selection Counter */}
      <div className={`border-2 rounded-lg p-4 sm:p-5 transition-all ${
        selectedLeads.length === 5 
          ? 'border-[#1F554A] bg-[#C4FF81]/10' 
          : 'border-[#DCDEDC] bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`size-10 sm:size-12 rounded-full flex items-center justify-center border-2 transition-all ${
              selectedLeads.length === 5 
                ? 'border-[#1F554A] bg-[#1F554A] text-white' 
                : 'border-[#1F554A] bg-white text-[#1F554A]'
            }`}>
              {selectedLeads.length === 5 ? (
                <CheckCircle2 className="size-5 sm:size-6" />
              ) : (
                <span className="font-medium text-lg">{selectedLeads.length}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-base sm:text-lg text-[#141414]">
                {selectedLeads.length}/5 leads seleccionados
              </p>
              <p className="text-sm text-gray-600">
                {selectedLeads.length === 5 
                  ? '¡Perfecto! Ya puedes continuar' 
                  : `Selecciona ${5 - selectedLeads.length} más para continuar`}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={selectedLeads.length !== 5 || isSubmitting}
            className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90 w-full sm:w-auto"
            size="lg"
          >
            Generar Top 5 Dossiers
          </Button>
        </div>
      </div>

      {/* Leads Table - Responsive */}
      <div className="border-2 border-[#DCDEDC] rounded-lg overflow-hidden">
        {/* Table Header - Desktop Only */}
        <div className="hidden lg:grid bg-[#1F554A] text-white px-4 py-3 grid-cols-12 gap-3 text-xs font-medium uppercase tracking-wide">
          <div className="col-span-1"></div>
          <div className="col-span-3">Lead</div>
          <div className="col-span-3">Empresa</div>
          <div className="col-span-2">Scores</div>
          <div className="col-span-3">Justificación</div>
        </div>

        {/* Table Body */}
        <div className="divide-y-2 divide-[#DCDEDC]">
          {leads.map((lead, index) => (
            <div key={lead.id}>
              {/* Desktop View */}
              <div 
                className={`hidden lg:grid px-4 py-3 grid-cols-12 gap-3 items-center hover:bg-[#C4FF81]/5 transition-colors ${
                  selectedLeads.includes(lead.id) ? 'bg-[#C4FF81]/10' : ''
                }`}
              >
                {/* Checkbox */}
                <div className="col-span-1 flex items-center gap-2">
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => handleLeadToggle(lead.id)}
                    disabled={!selectedLeads.includes(lead.id) && selectedLeads.length >= 5}
                  />
                  <span className="text-xs text-gray-500 font-medium">#{index + 1}</span>
                </div>

                {/* Lead Info */}
                <div className="col-span-3">
                  <a
                    href={lead.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sm mb-0.5 text-[#141414] hover:text-[#1F554A] transition-colors inline-flex items-center gap-1.5"
                  >
                    {lead.name}
                    <svg className="size-3.5 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Briefcase className="size-3" />
                    {lead.title}
                  </p>
                </div>

                {/* Company Info */}
                <div className="col-span-3">
                  <p className="font-medium text-sm mb-0.5 flex items-center gap-1 text-[#141414]">
                    <Building2 className="size-3 text-[#1F554A]" />
                    {lead.company}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mb-0.5">
                    <MapPin className="size-3 text-[#1F554A]" />
                    {lead.location.city}, {lead.location.country}
                  </p>
                  <p className="text-xs text-gray-600 mb-0.5">{lead.industry}</p>
                  <p className="text-xs text-gray-600">{lead.companySize}</p>
                </div>

                {/* Scores */}
                <div className="col-span-2 space-y-1">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getScoreColor(lead.finalScore)}`}>
                    <TrendingUp className="size-3" />
                    {lead.finalScore}
                  </div>
                  <div className="text-xs text-gray-500">
                    ICP: {lead.icpScore} • Co: {lead.companyScore}
                  </div>
                </div>

                {/* Justification Points */}
                <div className="col-span-3">
                  <ul className="space-y-1">
                    {lead.justificationPoints.slice(0, 2).map((point, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                        <span className="text-[#1F554A] font-bold mt-0.5">•</span>
                        <span className="flex-1 leading-tight">{point}</span>
                      </li>
                    ))}
                  </ul>
                  {lead.justificationPoints.length > 2 && (
                    null
                  )}
                </div>
              </div>

              {/* Mobile View */}
              <div 
                className={`lg:hidden p-4 hover:bg-[#C4FF81]/5 transition-colors ${
                  selectedLeads.includes(lead.id) ? 'bg-[#C4FF81]/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => handleLeadToggle(lead.id)}
                    disabled={!selectedLeads.includes(lead.id) && selectedLeads.length >= 5}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 font-medium">#{index + 1}</span>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getScoreColor(lead.finalScore)}`}>
                        <TrendingUp className="size-3" />
                        {lead.finalScore}
                      </div>
                    </div>
                    <a
                      href={lead.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-sm mb-1 text-[#141414] hover:text-[#1F554A] transition-colors inline-block"
                    >
                      {lead.name}
                    </a>
                    <p className="text-xs text-gray-600 mb-2">{lead.title}</p>
                    <p className="text-xs text-gray-700 font-medium mb-1">{lead.company}</p>
                    <p className="text-xs text-gray-500">{lead.companySize}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#DCDEDC]/30 border-2 border-[#DCDEDC] rounded-lg p-4 text-center">
        <p className="text-sm text-gray-700">
          Los scores se calculan como: <span className="font-medium text-[#1F554A]">Score Final = (ICP Score × 60%) + (Company Score × 40%)</span>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { LeadRanking } from './LeadRanking';
import { LeadDossier } from './LeadDossier';
import { EmailDrafts } from './EmailDrafts';
import { 
  Loader2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface StrategyWizardProps {
  sessionId: string;
  onComplete: () => void;
  onCancel: () => void;
}

type WizardStep = 'icp' | 'persona' | 'boolean' | 'processing' | 'ranking' | 'dossier' | 'emails';

export function StrategyWizard({ sessionId, onComplete, onCancel }: StrategyWizardProps) {
  const [step, setStep] = useState<WizardStep>('icp');
  const [selectedIcp, setSelectedIcp] = useState('');
  const [expandedIcp, setExpandedIcp] = useState<string | null>(null);
  const [personaEdits, setPersonaEdits] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');

  // Mock data basado en output de E3
  const icpOptions = [
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

  const buyerPersona = {
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

  const handleIcpConfirm = () => {
    if (!selectedIcp) {
      toast.error('Selecciona un ICP');
      return;
    }
    setStep('persona');
    toast.success('ICP confirmado');
  };

  const handlePersonaConfirm = () => {
    setStep('boolean');
    toast.success('Buyer Persona validado');
  };

  const handleBooleanConfirm = async () => {
    setStep('processing');
    
    const stages = [
      { progress: 20, status: 'Conectando con LinkedIn Sales Navigator...' },
      { progress: 40, status: 'Ejecutando búsqueda boolean...' },
      { progress: 60, status: 'Extrayendo perfiles relevantes...' },
      { progress: 80, status: 'Calculando scores de matching...' },
      { progress: 100, status: 'Completado' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingProgress(stage.progress);
      setProcessingStatus(stage.status);
    }

    toast.success('Búsqueda completada. 30 leads encontrados.');
    setStep('ranking');
  };

  const handleRankingComplete = (leads: string[]) => {
    setSelectedLeads(leads);
    setStep('dossier');
    toast.success('Top 5 seleccionado');
  };

  const handleDossierComplete = () => {
    setStep('emails');
    toast.success('Generando correos...');
  };

  const handleEmailsComplete = () => {
    toast.success('Flujo completado exitosamente');
    onComplete();
  };

  const isStepCompleted = (checkStep: WizardStep): boolean => {
    const steps: WizardStep[] = ['icp', 'persona', 'boolean', 'processing', 'ranking', 'dossier', 'emails'];
    const currentIndex = steps.indexOf(step);
    const checkIndex = steps.indexOf(checkStep);
    return checkIndex < currentIndex;
  };

  const isStepActive = (checkStep: WizardStep): boolean => {
    return step === checkStep;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Progress Stepper - Responsive */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center justify-between text-xs sm:text-sm min-w-[600px] sm:min-w-0">
          {/* Step 1: ICP */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
              isStepActive('icp') ? 'border-[#1F554A] bg-[#1F554A] text-white' : 
              isStepCompleted('icp') ? 'border-[#1F554A] bg-white text-[#1F554A]' : 
              'border-gray-300 text-gray-400'
            }`}>
              {isStepCompleted('icp') ? <CheckCircle2 className="size-3 sm:size-4" /> : '1'}
            </div>
            <span className={`hidden sm:inline ${isStepActive('icp') ? 'font-medium text-[#1F554A]' : isStepCompleted('icp') ? 'text-[#1F554A]' : 'text-gray-500'}`}>ICP</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2" />

          {/* Step 2: Persona */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
              isStepActive('persona') ? 'border-[#1F554A] bg-[#1F554A] text-white' : 
              isStepCompleted('persona') ? 'border-[#1F554A] bg-white text-[#1F554A]' : 
              'border-gray-300 text-gray-400'
            }`}>
              {isStepCompleted('persona') ? <CheckCircle2 className="size-3 sm:size-4" /> : '2'}
            </div>
            <span className={`hidden sm:inline ${isStepActive('persona') ? 'font-medium text-[#1F554A]' : isStepCompleted('persona') ? 'text-[#1F554A]' : 'text-gray-500'}`}>Persona</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2" />

          {/* Step 3: Filtro */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
              isStepActive('boolean') ? 'border-[#1F554A] bg-[#1F554A] text-white' : 
              isStepCompleted('boolean') ? 'border-[#1F554A] bg-white text-[#1F554A]' : 
              'border-gray-300 text-gray-400'
            }`}>
              {isStepCompleted('boolean') ? <CheckCircle2 className="size-3 sm:size-4" /> : '3'}
            </div>
            <span className={`hidden sm:inline ${isStepActive('boolean') ? 'font-medium text-[#1F554A]' : isStepCompleted('boolean') ? 'text-[#1F554A]' : 'text-gray-500'}`}>Filtro</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2" />

          {/* Step 4: Búsqueda */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
              isStepActive('processing') ? 'border-[#1F554A] bg-[#1F554A] text-white' : 
              isStepCompleted('processing') ? 'border-[#1F554A] bg-white text-[#1F554A]' : 
              'border-gray-300 text-gray-400'
            }`}>
              {isStepCompleted('processing') ? <CheckCircle2 className="size-3 sm:size-4" /> : '4'}
            </div>
            <span className={`hidden lg:inline ${isStepActive('processing') ? 'font-medium text-[#1F554A]' : isStepCompleted('processing') ? 'text-[#1F554A]' : 'text-gray-500'}`}>Búsqueda</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2" />

          {/* Step 5: Ranking */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
              isStepActive('ranking') ? 'border-[#1F554A] bg-[#1F554A] text-white' : 
              isStepCompleted('ranking') ? 'border-[#1F554A] bg-white text-[#1F554A]' : 
              'border-gray-300 text-gray-400'
            }`}>
              {isStepCompleted('ranking') ? <CheckCircle2 className="size-3 sm:size-4" /> : '5'}
            </div>
            <span className={`hidden lg:inline ${isStepActive('ranking') ? 'font-medium text-[#1F554A]' : isStepCompleted('ranking') ? 'text-[#1F554A]' : 'text-gray-500'}`}>Ranking</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2" />

          {/* Step 6: Dossier */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
              isStepActive('dossier') ? 'border-[#1F554A] bg-[#1F554A] text-white' : 
              isStepCompleted('dossier') ? 'border-[#1F554A] bg-white text-[#1F554A]' : 
              'border-gray-300 text-gray-400'
            }`}>
              {isStepCompleted('dossier') ? <CheckCircle2 className="size-3 sm:size-4" /> : '6'}
            </div>
            <span className={`hidden lg:inline ${isStepActive('dossier') ? 'font-medium text-[#1F554A]' : isStepCompleted('dossier') ? 'text-[#1F554A]' : 'text-gray-500'}`}>Dossier</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2" />

          {/* Step 7: Mensajes */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
              isStepActive('emails') ? 'border-[#1F554A] bg-[#1F554A] text-white' : 
              isStepCompleted('emails') ? 'border-[#1F554A] bg-white text-[#1F554A]' : 
              'border-gray-300 text-gray-400'
            }`}>
              {isStepCompleted('emails') ? <CheckCircle2 className="size-3 sm:size-4" /> : '7'}
            </div>
            <span className={`hidden lg:inline ${isStepActive('emails') ? 'font-medium text-[#1F554A]' : isStepCompleted('emails') ? 'text-[#1F554A]' : 'text-gray-500'}`}>Mensajes</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div>
        {/* Step 1: ICP Selection */}
        {step === 'icp' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">Selecciona tu ICP</h3>
              <p className="text-sm text-gray-600">Elige el perfil de cliente ideal que mejor se alinea con tu estrategia</p>
            </div>

            <RadioGroup value={selectedIcp} onValueChange={setSelectedIcp}>
              <div className="space-y-4">
                {icpOptions.map((icp) => {
                  const isExpanded = expandedIcp === icp.id;
                  
                  return (
                    <div key={icp.id} className={`border-2 rounded-lg transition-all ${selectedIcp === icp.id ? 'border-[#1F554A] bg-[#C4FF81]/10' : 'border-[#DCDEDC]'}`}>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start gap-4">
                          {/* Radio button - alineado al top sin offset */}
                          <RadioGroupItem value={icp.id} id={icp.id} className="flex-shrink-0" />
                          
                          {/* Contenido principal */}
                          <Label htmlFor={icp.id} className="flex-1 cursor-pointer min-w-0">
                            {/* Layout principal: score a la derecha, contenido a la izquierda */}
                            <div className="flex items-start gap-4">
                              {/* Contenido izquierdo: título, descripción y botón */}
                              <div className="flex-1 min-w-0 space-y-3">
                                <div>
                                  <p className="font-medium text-base text-[#141414] mb-1.5">{icp.name}</p>
                                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{icp.market_signal.description}</p>
                                  <p className="text-xs text-gray-500">
                                    Fuente: <a href={icp.market_signal.source_url} target="_blank" rel="noopener noreferrer" className="text-[#1F554A] hover:underline">{icp.market_signal.source_name}</a>
                                  </p>
                                </div>

                                {/* Botón Ver detalles - abajo a la izquierda */}
                                {!isExpanded && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setExpandedIcp(icp.id);
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs text-[#1F554A] hover:text-[#1F554A]/80 font-medium transition-colors"
                                  >
                                    Ver detalles <ChevronDown className="size-3.5" />
                                  </button>
                                )}
                              </div>

                              {/* Score badge - arriba a la derecha */}
                              <div className="flex-shrink-0">
                                
                              </div>
                            </div>

                            {/* Contenido expandido */}
                            {isExpanded && (
                              <div className="space-y-6 pt-4 border-t border-[#DCDEDC]">
                                {/* Grid de información básica con layout mejorado */}
                                <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-4">
                                  {/* Columna Izquierda */}
                                  <div className="space-y-4">
                                    {/* Industrias Específicas */}
                                    <div className="space-y-2">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Industrias Específicas</p>
                                      <div className="flex flex-wrap gap-2">
                                        {icp.industry_specific.map((ind) => (
                                          <span key={ind} className="px-3 py-1.5 bg-[#1F554A] text-white text-xs font-medium rounded-md">
                                            {ind}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Caso de Uso Activado */}
                                    <div className="space-y-2">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Caso de Uso Activado</p>
                                      <p className="text-sm font-medium text-[#141414]">{icp.use_case_activated}</p>
                                    </div>
                                  </div>

                                  {/* Columna Derecha */}
                                  <div className="space-y-4">
                                    {/* Tipo de Entidad */}
                                    <div className="space-y-2">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo de Entidad</p>
                                      <p className="text-sm font-medium text-[#141414]">{icp.target_entity_type}</p>
                                    </div>

                                    {/* Intensidad de Capex */}
                                    <div className="space-y-2">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Intensidad de Capex</p>
                                      <p className="text-sm font-medium text-[#141414]">{icp.capex_intensity}</p>
                                    </div>

                                    {/* Score Estratégico */}
                                    <div className="space-y-2">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Score Estratégico</p>
                                      <div className="inline-flex px-4 py-2 bg-[#1F554A] text-white rounded-full text-sm font-medium">
                                        {icp.score_strategic}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Fuentes - Full width */}
                                

                                {/* Dolor Estratégico - Después de Fuentes */}
                                <div className="space-y-2">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dolor Estratégico Atacado</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{icp.strategic_pain_addressed}</p>
                                </div>

                                {/* Ventana de Oportunidad - Después de Dolor Estratégico */}
                                <div className="space-y-2">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ventana de Oportunidad</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{icp.opportunity_window}</p>
                                </div>

                                {/* Botón Ver menos - alineado consistente */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setExpandedIcp(null);
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs text-[#1F554A] hover:text-[#1F554A]/80 font-medium transition-colors"
                                  >
                                    Ver menos <ChevronUp className="size-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={handleIcpConfirm} disabled={!selectedIcp} className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90">
                Confirmar y continuar
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Buyer Persona Validation */}
        {step === 'persona' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">Valida el Buyer Persona</h3>
              <p className="text-sm text-gray-600">Revisa y ajusta el perfil del tomador de decisiones</p>
            </div>

            <div className="space-y-4 border rounded-lg p-4 sm:p-6 bg-gray-50">
              <div>
                <p className="text-sm text-gray-500 mb-1">Título / Rol</p>
                <p className="font-medium">{buyerPersona.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Seniority</p>
                  <p className="font-medium">{buyerPersona.seniority}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Departamento</p>
                  <p className="font-medium">{buyerPersona.department}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Funciones</p>
                <ul className="space-y-2">
                  {buyerPersona.funciones.map((goal, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <CheckCircle2 className="size-4 mt-0.5 flex-shrink-0 text-[#1F554A]" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Dolor Específico RE</p>
                <ul className="space-y-2">
                  {buyerPersona.dolorEspecificoRE.map((pain, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <AlertCircle className="size-4 mt-0.5 flex-shrink-0 text-gray-500" />
                      <span>{pain}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Por qué la empresa</p>
                <ul className="space-y-2">
                  {buyerPersona.porQueEmpresa.map((criteria, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-[#1F554A] font-bold">→</span>
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">KPIs</p>
                <ul className="space-y-2">
                  {buyerPersona.kpis.map((criteria, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-[#1F554A] font-bold">→</span>
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Ajustes o comentarios (opcional)</Label>
              <Textarea
                value={personaEdits}
                onChange={(e) => setPersonaEdits(e.target.value)}
                rows={3}
                placeholder="Ej: Agregar enfoque en sostenibilidad, ajustar seniority..."
              />
            </div>

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('icp')}>
                <ArrowLeft className="size-4 mr-2" />
                Volver
              </Button>
              <Button onClick={handlePersonaConfirm} className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90">
                Validar y continuar
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Filtro Confirmation */}
        {step === 'boolean' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">Accede a LinkedIn Sales Navigator</h3>
              <p className="text-sm text-gray-600">Wakee configurará la búsqueda automáticamente en Sales Navigator</p>
            </div>

            <div className="bg-[#C4FF81]/10 border-2 border-[#1F554A] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="size-12 text-[#1F554A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-base text-[#141414] mb-2">
                    Continúa en LinkedIn Sales Navigator
                  </h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Wakee ha preparado los filtros de búsqueda basados en tu ICP y Buyer Persona. Haz clic en el botón para abrir Sales Navigator con la configuración optimizada.
                  </p>
                  <Button
                    onClick={() => window.open('https://www.linkedin.com/sales/search/people', '_blank')}
                    className="bg-[#0077B5] text-white hover:bg-[#0077B5]/90"
                  >
                    <svg className="size-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Abrir Sales Navigator
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-[#DCDEDC]/30 border border-[#DCDEDC] rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="size-5 text-[#1F554A] flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-[#141414] mb-1">Proceso automático</p>
                  <p className="text-gray-700">
                    Una vez que explores los resultados en Sales Navigator, regresa aquí para continuar. Wakee ejecutará automáticamente el ranking de leads.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('persona')}>
                <ArrowLeft className="size-4 mr-2" />
                Volver
              </Button>
              <Button 
                onClick={handleBooleanConfirm} 
                className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90"
              >
                Continuar con ranking de leads
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Processing */}
        {step === 'processing' && (
          <div className="py-12 space-y-8">
            <div className="text-center max-w-md mx-auto space-y-6">
              <div className="flex justify-center">
                <Loader2 className="size-12 animate-spin text-[#1F554A]" />
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-medium mb-2">Ejecutando búsqueda</h2>
                <p className="text-sm text-gray-600">{processingStatus}</p>
              </div>

              <div className="space-y-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1F554A] transition-all duration-500"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{processingProgress}%</p>
              </div>

              {/* Checklist de progreso */}
              <div className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-6 bg-white text-left">
                <h3 className="text-sm font-medium text-[#141414] mb-4 uppercase tracking-wide">Proceso de Búsqueda</h3>
                <div className="space-y-3">
                  {/* Item 1: Buscando Leads */}
                  <div className="flex items-start gap-3">
                    {processingProgress > 20 ? (
                      <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
                    ) : processingProgress > 0 ? (
                      <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${processingProgress > 0 ? 'text-[#141414]' : 'text-gray-400'}`}>
                        Buscando Leads
                      </p>
                      {processingProgress > 0 && processingProgress <= 20 && (
                        <p className="text-xs text-gray-600 mt-0.5">Conectando con LinkedIn Sales Navigator...</p>
                      )}
                    </div>
                  </div>

                  {/* Item 2: Calificando Leads */}
                  <div className="flex items-start gap-3">
                    {processingProgress > 40 ? (
                      <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
                    ) : processingProgress > 20 ? (
                      <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${processingProgress > 20 ? 'text-[#141414]' : 'text-gray-400'}`}>
                        Calificando Leads
                      </p>
                      {processingProgress > 20 && processingProgress <= 40 && (
                        <p className="text-xs text-gray-600 mt-0.5">Ejecutando búsqueda boolean...</p>
                      )}
                    </div>
                  </div>

                  {/* Item 3: Investigando Empresas */}
                  <div className="flex items-start gap-3">
                    {processingProgress > 60 ? (
                      <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
                    ) : processingProgress > 40 ? (
                      <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${processingProgress > 40 ? 'text-[#141414]' : 'text-gray-400'}`}>
                        Investigando Empresas
                      </p>
                      {processingProgress > 40 && processingProgress <= 60 && (
                        <p className="text-xs text-gray-600 mt-0.5">Extrayendo perfiles relevantes...</p>
                      )}
                    </div>
                  </div>

                  {/* Item 4: Calificando Empresas */}
                  <div className="flex items-start gap-3">
                    {processingProgress > 80 ? (
                      <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
                    ) : processingProgress > 60 ? (
                      <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${processingProgress > 60 ? 'text-[#141414]' : 'text-gray-400'}`}>
                        Calificando Empresas
                      </p>
                      {processingProgress > 60 && processingProgress <= 80 && (
                        <p className="text-xs text-gray-600 mt-0.5">Calculando scores de matching...</p>
                      )}
                    </div>
                  </div>

                  {/* Item 5: Priorizando los mejores leads */}
                  <div className="flex items-start gap-3">
                    {processingProgress >= 100 ? (
                      <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
                    ) : processingProgress > 80 ? (
                      <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${processingProgress > 80 ? 'text-[#141414]' : 'text-gray-400'}`}>
                        Priorizando los mejores leads
                      </p>
                      {processingProgress > 80 && processingProgress < 100 && (
                        <p className="text-xs text-gray-600 mt-0.5">Generando ranking final...</p>
                      )}
                      {processingProgress >= 100 && (
                        <p className="text-xs text-[#1F554A] mt-0.5 font-medium">¡Completado!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Lead Ranking */}
        {step === 'ranking' && (
          <LeadRanking
            sessionId={sessionId}
            onComplete={handleRankingComplete}
          />
        )}

        {/* Step 6: Dossier */}
        {step === 'dossier' && (
          <LeadDossier
            sessionId={sessionId}
            selectedLeads={selectedLeads}
            onGenerateEmails={handleDossierComplete}
          />
        )}

        {/* Step 7: Mensajes */}
        {step === 'emails' && (
          <EmailDrafts
            sessionId={sessionId}
            selectedLeads={selectedLeads}
            onComplete={handleEmailsComplete}
          />
        )}
      </div>
    </div>
  );
}
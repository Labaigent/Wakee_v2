// React
import { useState, useCallback, useEffect } from 'react';

// External libraries
import { toast } from 'sonner';

// Internal — types
import type { SegmentacionStep } from './types';
import { getStepIndex, SEGMENTACION_STEP_ORDER } from './types';

// Internal — context
import { usePerfilContext } from '@/app/context/PerfilContext';

// Internal — queries
import { useEjecucionesQuery } from '@/app/queries/ejecuciones';

// Internal — services
import { triggerE3Icp } from '@/services/n8nService';

// Internal — components
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { SegmentacionStepNav } from './SegmentacionStepNav';
import { StepIntro } from './steps/Step_0_Intro';
import { StepIcp } from './steps/Step_1_Icp';
import { StepPersona } from './steps/Step_2_Persona';
import { StepFiltro } from './steps/Step_3_Filtro';
import { StepBusqueda } from './steps/Step_4_Busqueda';
import { StepRanking } from './steps/Step_5_Ranking';
import { StepDossier } from './steps/Step_6_Dossier';
import { StepMensajes } from './steps/Step_7_Mensajes';

const SESSION_ID = 'session-001';

interface SegmentacionProps {
  initialExecutionId?: number | null;
}

/** Convierte el id numérico de ejecución a un código amigable para la UI (ej. 1 → E-001, 10 → E-010). Sin "3" en el prefijo. */
function formatExecutionDisplayId(id: number | string): string {
  const n = typeof id === 'number' ? id : parseInt(String(id).replace(/^exec-/, ''), 10);
  if (Number.isNaN(n)) return `E-${id}`;
  const padded = String(n).padStart(3, '0');
  return `E-${padded}`;
}


export function Segmentacion({ initialExecutionId }: SegmentacionProps) {
  // --- Context ---
  const { perfilId } = usePerfilContext();

  // --- Data ---
  const { data: ejecuciones = [], isLoading: ejecucionesLoading } = useEjecucionesQuery();

  // --- State ---
  const [currentStep, setCurrentStep] = useState<SegmentacionStep>('intro');
  const [maxReachedStep, setMaxReachedStep] = useState<SegmentacionStep>('intro');
  const [selectedExecutionId, setSelectedExecutionId] = useState<number | null>(null);

  // Sincroniza cuando llega un initialExecutionId desde NuevaSesion
  useEffect(() => {
    if (initialExecutionId != null) {
      setSelectedExecutionId(initialExecutionId);
    }
  }, [initialExecutionId]);
  const [isStartingWizard, setIsStartingWizard] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  // Estado compartido por pasos ICP → Búsqueda (StepIcp, StepPersona, StepFiltro, StepBusqueda)
  const [selectedIcp, setSelectedIcp] = useState('');
  const [expandedIcp, setExpandedIcp] = useState<string | null>(null);
  const [personaEdits, setPersonaEdits] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');

  // Mock: una sola tarea de estrategia para el flujo actual
  const pendingTasks = [
    {
      id: 'task-e3-001',
      sessionName: 'Sesión Industrial',
      sessionId: SESSION_ID,
      type: 'strategy_flow' as const,
      title: 'Completa tu estrategia (ICP → Persona → Filtro)',
      phase: 'E3-E5',
      createdAt: '2026-02-11T10:30:00',
    },
  ];

  // --- Helpers ---
  const updateMaxReached = useCallback((step: SegmentacionStep) => {
    setMaxReachedStep((prev) =>
      getStepIndex(step) > getStepIndex(prev) ? step : prev
    );
  }, []);

  // --- Handlers ---
  const handleStartWizard = async () => {
    if (selectedExecutionId == null) {
      toast.error('Selecciona una ejecución para continuar');
      return; // guard — must have execution before entering loading state
    }

    const ejecucion = ejecuciones.find((ej) => ej.id === selectedExecutionId);
    if (!ejecucion?.semana_id) {
      toast.error('La ejecución seleccionada no tiene semana asignada');
      return; // guard — semana_id is required for the ICP workflow
    }

    setIsStartingWizard(true);

    try {
      await triggerE3Icp({
        perfil_id: perfilId,
        ejecucion_id: selectedExecutionId,
        semana_id: ejecucion.semana_id,
      });
      setSelectedLeads([]);
      setSelectedIcp('');
      setExpandedIcp(null);
      setPersonaEdits('');
      setProcessingProgress(0);
      setProcessingStatus('');
      setCurrentStep('icp');
      setMaxReachedStep('icp');
    } catch {
      toast.error('Error al iniciar la estrategia. Intenta de nuevo.');
    } finally {
      setIsStartingWizard(false);
    }
  };

  const handleCancelToIntro = () => {
    setCurrentStep('intro');
  };

  const handleStepNavClick = (step: Exclude<SegmentacionStep, 'intro'>) => {
    setCurrentStep(step);
  };

  const handleMensajesComplete = () => {
    toast.success('Flujo completado. ¡Excelente trabajo!');
    setCurrentStep('intro');
    setMaxReachedStep('intro');
    setSelectedLeads([]);
    setSelectedExecutionId(null);
    setSelectedIcp('');
    setExpandedIcp(null);
    setPersonaEdits('');
    setProcessingProgress(0);
    setProcessingStatus('');
  };

  return (
    <div className="space-y-12">

      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-medium text-[#141414]">Prospección Inteligente</h2>
        {currentStep === 'intro' ? (
          <>
            <p className="text-xs sm:text-sm text-gray-500">Elige una ejecución para continuar</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <Label htmlFor="ejecucion-select" className="text-sm font-medium text-gray-700 sm:shrink-0">
                Ejecución
              </Label>
              <Select
                value={selectedExecutionId != null ? String(selectedExecutionId) : undefined}
                onValueChange={(v) =>
                  setSelectedExecutionId(v != null && v !== '' ? Number(v) : null)
                }
              >
                <SelectTrigger
                  id="ejecucion-select"
                  className="w-full sm:w-[min(100%,20rem)] border-[#DCDEDC] bg-white text-sm text-[#141414] focus:border-[#1F554A] focus:ring-[#1F554A]/30"
                >
                  <SelectValue placeholder="Selecciona una ejecución" />
                </SelectTrigger>
                <SelectContent>
                  {ejecucionesLoading ? (
                    <SelectItem value="__loading__" disabled>
                      Cargando ejecuciones…
                    </SelectItem>
                  ) : ejecuciones.length === 0 ? (
                    <SelectItem value="__empty__" disabled>
                      Sin ejecuciones disponibles
                    </SelectItem>
                  ) : (
                    ejecuciones.map((ej) => (
                      <SelectItem
                        key={ej.id}
                        value={String(ej.id)}
                        className="focus:bg-[#C4FF81]/20 focus:text-[#141414]"
                      >
                        {formatExecutionDisplayId(ej.id)} — {ej.estado === 'completada' ? 'Completada' : ej.estado === 'error' ? 'Error' : (ej.etapa_label ?? `Etapa ${ej.etapa_siguiente}`)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-gray-500">
              Paso {getStepIndex(currentStep) + 1} de {SEGMENTACION_STEP_ORDER.length}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center rounded-md border border-[#DCDEDC] bg-[#C4FF81]/10 px-2.5 py-1 text-sm font-medium text-[#141414]">
                {selectedExecutionId != null && formatExecutionDisplayId(selectedExecutionId)}
              </span>
              <button
                type="button"
                onClick={handleCancelToIntro}
                className="cursor-pointer text-sm font-medium text-[#1F554A] hover:text-[#1F554A]/80 hover:underline focus:outline-none focus:ring-2 focus:ring-[#1F554A] focus:ring-offset-1 rounded"
              >
                Cambiar ejecución
              </button>
            </div>
          </>
        )}
      </div>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Step navigation — oculto en intro */}
        {currentStep !== 'intro' && (
          <SegmentacionStepNav
            currentStep={currentStep}
            maxReachedStep={maxReachedStep}
            onStepClick={handleStepNavClick}
          />
        )}

        {/* Step content */}
        {currentStep === 'intro' && (
          <StepIntro
            title={pendingTasks[0].title}
            phase={pendingTasks[0].phase}
            isExecutionSelected={selectedExecutionId != null}
            isLoading={isStartingWizard}
            onStartWizard={handleStartWizard}
          />
        )}

        {currentStep === 'icp' && (
          <StepIcp
            selectedIcp={selectedIcp}
            onSelectedIcpChange={setSelectedIcp}
            expandedIcp={expandedIcp}
            onExpandedIcpChange={setExpandedIcp}
            onConfirm={() => {
              setCurrentStep('persona');
              updateMaxReached('persona');
            }}
            onCancel={handleCancelToIntro}
          />
        )}

        {currentStep === 'persona' && (
          <StepPersona
            personaEdits={personaEdits}
            onPersonaEditsChange={setPersonaEdits}
            onConfirm={() => {
              setCurrentStep('filtro');
              updateMaxReached('filtro');
            }}
            onBack={() => setCurrentStep('icp')}
          />
        )}

        {currentStep === 'filtro' && (
          <StepFiltro
            onConfirm={() => {
              setProcessingProgress(0);
              setProcessingStatus('');
              setCurrentStep('busqueda');
              updateMaxReached('busqueda');
            }}
            onBack={() => setCurrentStep('persona')}
          />
        )}

        {currentStep === 'busqueda' && (
          <StepBusqueda
            processingProgress={processingProgress}
            processingStatus={processingStatus}
            onProgress={(progress, status) => {
              setProcessingProgress(progress);
              setProcessingStatus(status);
            }}
            onComplete={() => {
              setCurrentStep('ranking');
              updateMaxReached('ranking');
            }}
          />
        )}

        {currentStep === 'ranking' && (
          <StepRanking
            sessionId={SESSION_ID}
            onComplete={(leads: string[]) => {
              setSelectedLeads(leads);
              toast.success('Top 5 seleccionado. Generando dossiers...');
              setCurrentStep('dossier');
              updateMaxReached('dossier');
            }}
          />
        )}

        {currentStep === 'dossier' && (
          <StepDossier
            sessionId={SESSION_ID}
            selectedLeads={selectedLeads}
            onGenerateEmails={() => {
              toast.success('Generando borradores de correo...');
              setCurrentStep('mensajes');
              updateMaxReached('mensajes');
            }}
          />
        )}

        {currentStep === 'mensajes' && (
          <StepMensajes
            sessionId={SESSION_ID}
            selectedLeads={selectedLeads}
            onComplete={handleMensajesComplete}
          />
        )}

      </div>
    </div>
  );
}

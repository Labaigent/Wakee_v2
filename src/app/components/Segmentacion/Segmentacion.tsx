// React
import { useState, useCallback } from 'react';

// External libraries
import { toast } from 'sonner';

// Internal — types
import type { SegmentacionStep } from './types';
import { getStepIndex } from './types';

// Internal — components
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

export function Segmentacion() {
  // --- State ---
  const [currentStep, setCurrentStep] = useState<SegmentacionStep>('intro');
  const [maxReachedStep, setMaxReachedStep] = useState<SegmentacionStep>('intro');
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
  const handleStartWizard = () => {
    setSelectedLeads([]);
    setSelectedIcp('');
    setExpandedIcp(null);
    setPersonaEdits('');
    setProcessingProgress(0);
    setProcessingStatus('');
    setCurrentStep('icp');
    setMaxReachedStep('icp');
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
    setSelectedIcp('');
    setExpandedIcp(null);
    setPersonaEdits('');
    setProcessingProgress(0);
    setProcessingStatus('');
  };

  return (
    <div className="space-y-12">

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-medium mb-2">Segmentaciones Pendientes</h2>
        <p className="text-xs sm:text-sm text-gray-500">
          {pendingTasks.length} segmentaciones requieren tu decisión
        </p>
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

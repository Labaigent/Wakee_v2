import { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { StrategyWizard } from '../StrategyWizard';
import { LeadRanking } from '../LeadRanking';
import { LeadDossier } from '../LeadDossier';
import { EmailDrafts } from '../EmailDrafts';

export function Segmentacion() {
  const [currentView, setCurrentView] = useState<'intro' | 'wizard' | 'ranking' | 'dossier' | 'email'>('intro');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const pendingTasks = [
    {
      id: 'task-e3-001',
      sessionName: 'Sesión Industrial',
      sessionId: 'session-001',
      type: 'strategy_flow', // ICP → Persona → Filtro flow
      title: 'Completa tu estrategia (ICP → Persona → Filtro)',
      phase: 'E3-E5',
      createdAt: '2026-02-11T10:30:00'
    }
  ];

  const handleRankingComplete = (leads: string[]) => {
    setSelectedLeads(leads);
    toast.success('Top 5 seleccionado. Generando dossiers...');
    setCurrentView('dossier');
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-medium mb-2">Segmentaciones Pendientes</h2>
        <p className="text-gray-600">{pendingTasks.length} segmentaciones requieren tu decisión</p>
      </div>

      <div className="max-w-5xl mx-auto">
        {currentView === 'intro' && (
          <TaskDetail 
            task={pendingTasks[0]}
            selectedLeads={selectedLeads}
            setSelectedLeads={setSelectedLeads}
            onComplete={() => {
              toast.success('Segmentación completada');
            }}
            onStartWizard={() => setCurrentView('wizard')}
          />
        )}

        {currentView === 'wizard' && (
          <StrategyWizard
            sessionId={pendingTasks[0].sessionId}
            onComplete={() => {
              setCurrentView('ranking');
              toast.success('Búsqueda completada. Revisa el ranking de leads.');
            }}
            onCancel={() => setCurrentView('intro')}
          />
        )}

        {currentView === 'ranking' && (
          <LeadRanking
            sessionId={pendingTasks[0].sessionId}
            onComplete={handleRankingComplete}
          />
        )}

        {currentView === 'dossier' && (
          <LeadDossier
            sessionId={pendingTasks[0].sessionId}
            selectedLeads={selectedLeads}
            onGenerateEmails={() => {
              toast.success('Generando borradores de correo...');
              setCurrentView('email');
            }}
          />
        )}

        {currentView === 'email' && (
          <EmailDrafts
            sessionId={pendingTasks[0].sessionId}
            selectedLeads={selectedLeads}
            onComplete={() => {
              toast.success('Flujo completado. ¡Excelente trabajo!');
              setCurrentView('intro');
            }}
          />
        )}
      </div>
    </div>
  );
}

function TaskDetail({ task, selectedLeads, setSelectedLeads, onComplete, onStartWizard }: { task: any; selectedLeads: string[]; setSelectedLeads: React.Dispatch<React.SetStateAction<string[]>>; onComplete: () => void; onStartWizard: () => void }) {
  const [selectedIcp, setSelectedIcp] = useState('');
  const [booleanString, setBooleanString] = useState(task.data?.boolean || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Confirmado. El flujo continuará automáticamente.');
    setIsSubmitting(false);
    onComplete();
  };

  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads(prev => {
      if (prev.includes(leadId)) return prev.filter(id => id !== leadId);
      if (prev.length < 5) return [...prev, leadId];
      toast.warning('Máximo 5 leads');
      return prev;
    });
  };

  // If this is a strategy_flow task, show the wizard button
  if (task.type === 'strategy_flow') {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-medium mb-2 text-[#141414]">{task.title}</h3>
          <p className="text-sm sm:text-base text-gray-600">{task.phase}</p>
        </div>

        <div className="border-2 border-[#1F554A] rounded-lg p-6 sm:p-8 bg-gradient-to-br from-white to-[#C4FF81]/5">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#1F554A] text-white mb-2">
              <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            
            <div>
              <h4 className="text-lg sm:text-xl font-medium text-[#141414] mb-2">
                Prospección Inteligente
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Este flujo te guiará paso a paso por la definición de tu estrategia
              </p>
            </div>

            <div className="bg-white border border-[#DCDEDC] rounded-lg p-4 sm:p-6 max-w-md mx-auto">
              <ul className="text-sm sm:text-base text-left space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">1</span>
                  <span className="text-gray-700">Selección de ICP (Ideal Customer Profile)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">2</span>
                  <span className="text-gray-700">Validación de Buyer Persona</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">3</span>
                  <span className="text-gray-700">Confirmación de Filtro de búsqueda</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">4</span>
                  <span className="text-gray-700">Búsqueda automática de leads</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">5</span>
                  <span className="text-gray-700">Ranking y selección de Leads</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">6</span>
                  <span className="text-gray-700">Generación de dossiers detallados</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">7</span>
                  <span className="text-gray-700">Creación de borradores de mensajes</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={onStartWizard}
              className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90 px-8 py-6 text-base sm:text-lg h-auto"
            >
              <svg className="size-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Iniciar Estrategia
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-1">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.phase}</p>
      </div>

      {/* ICP Selection */}
      {task.type === 'icp_selection' && task.data?.icpOptions && (
        <div className="space-y-6">
          <RadioGroup value={selectedIcp} onValueChange={setSelectedIcp}>
            {task.data.icpOptions.map((icp: any) => (
              <div key={icp.id} className="border-b pb-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={icp.id} id={icp.id} className="mt-1" />
                  <Label htmlFor={icp.id} className="flex-1 cursor-pointer">
                    <p className="font-medium mb-1">{icp.profile}</p>
                    <p className="text-sm text-gray-600">{icp.painHypothesis}</p>
                    <p className="text-xs text-gray-400 mt-2">Score: {icp.score}</p>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>

          {!showReject ? (
            <button
              onClick={() => setShowReject(true)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ¿Ninguna opción te convence?
            </button>
          ) : (
            <div className="border-t pt-4">
              <p className="text-sm mb-3">Explica qué ajustar:</p>
              <Textarea rows={2} placeholder="Ej: Enfocarse más en nearshoring" className="mb-3" />
              <Button variant="outline" size="sm">Solicitar nuevas opciones</Button>
            </div>
          )}
        </div>
      )}

      {/* Filtro Confirmation */}
      {task.type === 'boolean_confirmation' && task.data?.boolean && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-2 block">String de Sales Navigator</Label>
            <Textarea
              value={booleanString}
              onChange={(e) => setBooleanString(e.target.value)}
              rows={3}
              className="font-mono text-sm"
            />
          </div>
          <p className="text-sm text-gray-600">
            Resultados estimados: {task.data.estimatedResults || 'Calculando...'}
          </p>
        </div>
      )}

      {/* Top 5 Selection */}
      {task.type === 'top5_selection' && task.data?.leads && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Seleccionados: {selectedLeads.length}/5</p>
          {task.data.leads.map((lead: any) => (
            <div key={lead.id} className="flex items-center gap-3 border-b pb-3">
              <Checkbox
                checked={selectedLeads.includes(lead.id)}
                onCheckedChange={() => handleLeadToggle(lead.id)}
              />
              <div className="flex-1">
                <p className="font-medium">{lead.name}</p>
                <p className="text-sm text-gray-600">{lead.title} • {lead.company}</p>
              </div>
              <span className="text-sm text-gray-500">Score: {lead.score}</span>
            </div>
          ))}
        </div>
      )}

      <Separator />

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onComplete}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            (task.type === 'icp_selection' && !selectedIcp) ||
            (task.type === 'top5_selection' && selectedLeads.length !== 5)
          }
          className="bg-black text-white hover:bg-gray-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            'Confirmar'
          )}
        </Button>
      </div>
    </div>
  );
}


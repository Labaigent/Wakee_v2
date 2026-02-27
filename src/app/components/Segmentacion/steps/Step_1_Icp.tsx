// External libraries
import { toast } from 'sonner';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

// Internal — components
import { Button } from '../../ui/button';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';

// Internal — data
import { icpOptions } from '../wizardData';

interface StepIcpProps {
  selectedIcp: string;
  onSelectedIcpChange: (value: string) => void;
  expandedIcp: string | null;
  onExpandedIcpChange: (id: string | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StepIcp({
  selectedIcp,
  onSelectedIcpChange,
  expandedIcp,
  onExpandedIcpChange,
  onConfirm,
  onCancel,
}: StepIcpProps) {
  // --- Handlers ---
  const handleConfirm = () => {
    if (!selectedIcp) {
      toast.error('Selecciona un ICP');
      return;
    }
    toast.success('ICP confirmado');
    onConfirm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">Selecciona tu ICP</h3>
        <p className="text-sm text-gray-600">Elige el perfil de cliente ideal que mejor se alinea con tu estrategia</p>
      </div>

      {/* Lista de ICPs */}
      <RadioGroup value={selectedIcp} onValueChange={onSelectedIcpChange}>
        <div className="space-y-4">
          {icpOptions.map((icp) => {
            const isExpanded = expandedIcp === icp.id;

            return (
              <div key={icp.id} className={`border-2 rounded-lg transition-all ${selectedIcp === icp.id ? 'border-[#1F554A] bg-[#C4FF81]/10' : 'border-[#DCDEDC]'}`}>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <RadioGroupItem value={icp.id} id={icp.id} className="flex-shrink-0" />
                    <Label htmlFor={icp.id} className="flex-1 cursor-pointer min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <p className="font-medium text-base text-[#141414] mb-1.5">{icp.name}</p>
                            <p className="text-sm text-gray-600 leading-relaxed mb-2">{icp.market_signal.description}</p>
                            <p className="text-xs text-gray-500">
                              Fuente: <a href={icp.market_signal.source_url} target="_blank" rel="noopener noreferrer" className="text-[#1F554A] hover:underline">{icp.market_signal.source_name}</a>
                            </p>
                          </div>
                          {!isExpanded && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                onExpandedIcpChange(icp.id);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs text-[#1F554A] hover:text-[#1F554A]/80 font-medium transition-colors"
                            >
                              Ver detalles <ChevronDown className="size-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="flex-shrink-0" />
                      </div>
                      {isExpanded && (
                        <div className="space-y-6 pt-4 border-t border-[#DCDEDC]">
                          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-4">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Industrias Específicas</p>
                                <div className="flex flex-wrap gap-2">
                                  {icp.industry_specific.map((ind) => (
                                    <span key={ind} className="px-3 py-1.5 bg-[#1F554A] text-white text-xs font-medium rounded-md">{ind}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Caso de Uso Activado</p>
                                <p className="text-sm font-medium text-[#141414]">{icp.use_case_activated}</p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo de Entidad</p>
                                <p className="text-sm font-medium text-[#141414]">{icp.target_entity_type}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Intensidad de Capex</p>
                                <p className="text-sm font-medium text-[#141414]">{icp.capex_intensity}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Score Estratégico</p>
                                <div className="inline-flex px-4 py-2 bg-[#1F554A] text-white rounded-full text-sm font-medium">{icp.score_strategic}</div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dolor Estratégico Atacado</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{icp.strategic_pain_addressed}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ventana de Oportunidad</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{icp.opportunity_window}</p>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                onExpandedIcpChange(null);
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
      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} disabled={!selectedIcp} className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90">
          Confirmar y continuar
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

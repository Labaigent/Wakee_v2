// Librerías externas
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';

// Componentes internos
import { Button } from '../../../ui/button';
import { RadioGroup } from '../../../ui/radio-group';
import { Separator } from '../../../ui/separator';
import { IcpCard } from './components/IcpCard';

// Types
import type { IcpOption } from '../../types';
import type { E3IcpOutput } from '@/types/db/e3IcpOutput';

// Queries / servicios
import { useE3IcpOutputsQuery } from '@/app/queries/e3IcpOutputs';

interface StepIcpProps {
  ejecucionId: number | null;
  selectedIcp: string;
  onSelectedIcpChange: (value: string) => void;
  expandedIcp: string | null;
  onExpandedIcpChange: (id: string | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Convierte el output plano de BD (E3) al tipo IcpOption anidado del componente */
function mapE3IcpOutputToOption(output: E3IcpOutput): IcpOption {
  return {
    id: String(output.icp_rank),
    name: output.icp_name,
    score_strategic: output.score_strategic,
    target_entity_type: output.target_entity_type,
    market_signal: {
      description: output.market_signal_description,
      source_name: output.market_signal_source_name,
      source_url: output.market_signal_source_url,
    },
    use_case_activated: output.use_case_activated,
    strategic_pain_addressed: output.strategic_pain_addressed,
    capex_intensity: output.capex_intensity,
    opportunity_window: output.opportunity_window,
  };
}

/**
 * Paso 1: Selección de ICP.
 * Carga los ICPs desde Supabase (ejecuciones.e3_ejecucion_outpu_icp)
 * filtrados por ejecucion_id.
 */
export function StepIcp({
  ejecucionId,
  selectedIcp,
  onSelectedIcpChange,
  expandedIcp,
  onExpandedIcpChange,
  onConfirm,
  onCancel,
}: StepIcpProps) {
  const { data: rawOutputs = [], isLoading: icpOutputsLoading } = useE3IcpOutputsQuery(ejecucionId);

  const icpOptions = rawOutputs.map(mapE3IcpOutputToOption);

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
      {/* Encabezado */}
      <div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">Selecciona tu ICP</h3>
        <p className="text-sm text-gray-600">Elige el perfil de cliente ideal que mejor se alinea con tu estrategia</p>
      </div>

      {/* Lista de ICPs con estados de carga y vacío */}
      {icpOutputsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-[#1F554A]" />
        </div>
      ) : icpOptions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Sin ICPs disponibles para esta ejecución.</p>
      ) : (
        <RadioGroup value={selectedIcp} onValueChange={onSelectedIcpChange}>
          <div className="space-y-4">
            {icpOptions.map((icp) => (
              <IcpCard
                key={icp.id}
                icp={icp}
                isSelected={selectedIcp === icp.id}
                isExpanded={expandedIcp === icp.id}
                onExpandedChange={onExpandedIcpChange}
              />
            ))}
          </div>
        </RadioGroup>
      )}

      <Separator />

      {/* Acciones */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedIcp}
          className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90"
        >
          Confirmar y continuar
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

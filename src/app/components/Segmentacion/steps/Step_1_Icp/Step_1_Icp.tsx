// External libraries
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

// Internal — components
import { Button } from '../../../ui/button';
import { RadioGroup } from '../../../ui/radio-group';
import { Separator } from '../../../ui/separator';
import { IcpCard } from './components/IcpCard';

// Internal — data
import { icpOptions } from '../../wizardData';

// Internal — types
import type { IcpOption } from '../../types';

interface StepIcpProps {
  selectedIcp: string;
  onSelectedIcpChange: (value: string) => void;
  expandedIcp: string | null;
  onExpandedIcpChange: (id: string | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Step 1: ICP Selection.
 * User selects the Ideal Customer Profile for the strategy.
 */
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
          {(icpOptions as IcpOption[]).map((icp) => (
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

      <Separator />

      {/* Actions */}
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

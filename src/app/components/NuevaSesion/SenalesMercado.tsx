// External libraries
import { Building2 } from "lucide-react";

// Internal — types
import type { CompanySignal } from './types';

// Internal — components
import { SenalMercadoCard } from './components/SenalMercadoCard';

interface Props {
  signals: CompanySignal[];
}

export function SenalesMercado({ signals }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="size-4 text-[#1F554A]" />
        <h4 className="text-sm font-medium text-[#141414] uppercase tracking-wide">
          Señales de Compañías
        </h4>
      </div>
      <div className="space-y-2">
        {signals.map((signal) => (
          <SenalMercadoCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
}

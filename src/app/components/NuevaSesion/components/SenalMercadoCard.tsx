// Internal — types
import type { CompanySignal } from '../types';

// Internal — components
import { Badge } from '../../ui/badge';

interface Props {
  signal: CompanySignal;
}

/**
 * Displays a single company signal as a card.
 * Keep it consistent with the Master Report card style.
 */
export function SenalMercadoCard({ signal }: Props) {
  return (
    <div className="border-2 border-[#DCDEDC] rounded-lg p-3 hover:border-[#1F554A] transition-colors bg-white">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm text-[#141414]">
              {signal.company}
            </p>
            <Badge className="bg-[#1F554A] text-white text-xs">
              {signal.assetClass}
            </Badge>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            {signal.signal}
          </p>
        </div>
      </div>
    </div>
  );
}

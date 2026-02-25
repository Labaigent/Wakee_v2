// Internal — types
import type { MarketHook } from '../types';

interface Props {
  hook: MarketHook;
}

/**
 * Displays a single market hook as a card.
 * Keep it consistent with the Master Report card style.
 */
export function GanchoMercadoCard({ hook }: Props) {
  return (
    <div className="border-2 border-[#DCDEDC] rounded-lg p-3 hover:border-[#1F554A] transition-colors bg-white">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[#1F554A] mb-1">
            {hook.topic}
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">
            {hook.hook}
          </p>
        </div>
      </div>
    </div>
  );
}

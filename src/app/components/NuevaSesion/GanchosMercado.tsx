// External libraries
import { TrendingUp } from "lucide-react";

// Internal — types
import type { MarketHook } from './types';

// Internal — components
import { GanchoMercadoCard } from './components/GanchoMercadoCard';

interface Props {
  hooks: MarketHook[];
}

export function GanchosMercado({ hooks }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="size-4 text-[#1F554A]" />
        <h4 className="text-sm font-medium text-[#141414] uppercase tracking-wide">
          Insights de Mercado
        </h4>
      </div>
      <div className="space-y-2">
        {hooks.map((hook) => (
          <GanchoMercadoCard key={hook.id} hook={hook} />
        ))}
      </div>
    </div>
  );
}

// External libraries
import { TrendingUp } from "lucide-react";

// Internal — types
import type { GanchoMercado } from '../../../types/db/ganchoMercado';

// Internal — components
import { GanchoMercadoCard } from './components/GanchoMercadoCard';

interface Props {
  ganchos: GanchoMercado[];
}

/**
 * Pure presentational — loading state gestionado por NuevaSesion.
 */
export function GanchosMercado({ ganchos }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="size-4 text-[#1F554A]" />
        <h4 className="text-sm font-medium text-[#141414] uppercase tracking-wide">
          Insights de Mercado
        </h4>
      </div>
      <div className="space-y-2">
        {ganchos.length === 0 && (
          <p className="text-xs text-gray-500">No hay ganchos registrados para esta semana.</p>
        )}
        {ganchos.map((gancho) => (
          <GanchoMercadoCard key={gancho.id} gancho={gancho} />
        ))}
      </div>
    </div>
  );
}

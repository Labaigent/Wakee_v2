// External libraries
import { Building2 } from "lucide-react";

// Internal — types
import type { SenalMercado } from '../../../types/db/senalMercado';

// Internal — components
import { SenalMercadoCard } from './components/SenalMercadoCard';

interface Props {
  señales: SenalMercado[];
}

/**
 * Pure presentational — loading state gestionado por NuevaSesion.
 */
export function SenalesMercado({ señales }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="size-4 text-[#1F554A]" />
        <h4 className="text-sm font-medium text-[#141414] uppercase tracking-wide">
          Señales de Compañías
        </h4>
      </div>
      <div className="space-y-2">
        {señales.length === 0 && (
          <p className="text-xs text-gray-500">No hay señales registradas para esta semana.</p>
        )}
        {señales.map((señal) => (
          <SenalMercadoCard key={señal.id} señal={señal} />
        ))}
      </div>
    </div>
  );
}

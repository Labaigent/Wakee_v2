// Internal — types
import type { SenalMercado } from '../../../types/db/senalMercado';

// Internal — components
import { SenalMercadoCard } from './components/SenalMercadoCard';

interface Props {
  /** Señales obtenidas de Supabase para la semana activa. */
  señales: SenalMercado[];
  /** IDs de las cards actualmente expandidas. Manejado por el padre para resetear al navegar semanas. */
  expandedSeñales: number[];
  /** Alterna el estado expandido de la card con el ID de señal dado. */
  onToggle: (id: number) => void;
}

/**
 * Pure presentational component — no data fetching, no side effects.
 * State management (expandedSeñales, onToggle) is lifted to MasterIntelligenceReport
 * so the parent can reset expansion state when the user navigates between weeks.
 */
export function SenalesMercado({ señales, expandedSeñales, onToggle }: Props) {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm text-gray-600">
          Señales específicas de empresas que están activamente buscando espacios o expandiendo operaciones
        </p>
      </div>

      {señales.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No hay señales registradas para esta semana.
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {señales.map((señal) => (
            <SenalMercadoCard
              key={señal.id}
              señal={señal}
              isExpanded={expandedSeñales.includes(señal.id)}
              onToggle={() => onToggle(señal.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

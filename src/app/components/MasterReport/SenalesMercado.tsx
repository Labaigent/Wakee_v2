// Internal — types
import type { SenalMercado } from '../../../types/db/senalMercado';

// Internal — components
import { SenalMercadoCard } from './components/SenalMercadoCard';

interface Props {
  /** Signals fetched from Supabase for the active week. */
  signals: SenalMercado[];
  /** IDs of cards currently expanded. Managed by parent so it can reset state on week navigation. */
  expandedSignals: number[];
  /** Toggles the expanded state of the card with the given signal ID. */
  onToggle: (id: number) => void;
}

/**
 * Pure presentational component — no data fetching, no side effects.
 * State management (expandedSignals, onToggle) is lifted to MasterIntelligenceReport
 * so the parent can reset expansion state when the user navigates between weeks.
 */
export function SenalesMercado({ signals, expandedSignals, onToggle }: Props) {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm text-gray-600">
          Señales específicas de empresas que están activamente buscando espacios o expandiendo operaciones
        </p>
      </div>

      {signals.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No hay señales registradas para esta semana.
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {signals.map((signal) => (
            <SenalMercadoCard
              key={signal.id}
              signal={signal}
              isExpanded={expandedSignals.includes(signal.id)}
              onToggle={() => onToggle(signal.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Internal — types
import type { GanchoMercado } from '../../../types/db/ganchoMercado';

// Internal — components
import { GanchoMercadoCard } from './components/GanchoMercadoCard';

interface Props {
  /** Hooks fetched from Supabase for the active week. */
  hooks: GanchoMercado[];
  /** IDs of cards currently expanded. Managed by parent so it can reset state on week navigation. */
  expandedHooks: number[];
  /** Toggles the expanded state of the card with the given hook ID. */
  onToggle: (id: number) => void;
}

export function GanchosMercado({ hooks, expandedHooks, onToggle }: Props) {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm text-gray-600">
          Tendencias macro, regulaciones, incentivos fiscales y dinámicas de mercado que impulsan la demanda inmobiliaria
        </p>
      </div>
      {hooks.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No hay ganchos registrados para esta semana.
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {hooks.map((hook) => (
            <GanchoMercadoCard
              key={hook.id}
              hook={hook}
              isExpanded={expandedHooks.includes(hook.id)}
              onToggle={() => onToggle(hook.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

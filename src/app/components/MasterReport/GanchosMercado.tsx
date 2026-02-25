// Internal — types
import type { GanchoMercado } from '../../../types/db/ganchoMercado';

// Internal — components
import { GanchoMercadoCard } from './components/GanchoMercadoCard';

interface Props {
  /** Ganchos obtenidos de Supabase para la semana activa. */
  ganchos: GanchoMercado[];
  /** IDs de las cards actualmente expandidas. Manejado por el padre para resetear al navegar semanas. */
  expandedGanchos: number[];
  /** Alterna el estado expandido de la card con el ID de gancho dado. */
  onToggle: (id: number) => void;
}

export function GanchosMercado({ ganchos, expandedGanchos, onToggle }: Props) {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm text-gray-600">
          Tendencias macro, regulaciones, incentivos fiscales y dinámicas de mercado que impulsan la demanda inmobiliaria
        </p>
      </div>
      {ganchos.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No hay ganchos registrados para esta semana.
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {ganchos.map((gancho) => (
            <GanchoMercadoCard
              key={gancho.id}
              gancho={gancho}
              isExpanded={expandedGanchos.includes(gancho.id)}
              onToggle={() => onToggle(gancho.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

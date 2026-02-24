import type { SenalMercado } from '../../../types/senalMercado';
import { CompanySignalCard } from './components/CompanySignalCard';

interface Props {
  signals: SenalMercado[];
  expandedSignals: number[];
  onToggle: (id: number) => void;
}

export function SenalesMercado({ signals, expandedSignals, onToggle }: Props) {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm text-gray-600">
          Señales específicas de empresas que están activamente buscando espacios o expandiendo operaciones
        </p>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {signals.map((signal) => (
          <CompanySignalCard
            key={signal.id}
            signal={signal}
            isExpanded={expandedSignals.includes(signal.id)}
            onToggle={() => onToggle(signal.id)}
          />
        ))}
      </div>
    </div>
  );
}

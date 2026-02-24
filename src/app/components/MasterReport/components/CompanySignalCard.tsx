// External libraries
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

// Internal — types
import type { SenalMercado } from '../../../../types/db/senalMercado';

// Internal — components
import { Badge } from '../../ui/badge';

interface Props {
  signal: SenalMercado;
  isExpanded: boolean;
  /** No ID argument needed — the parent pre-binds the signal ID before passing this down. */
  onToggle: () => void;
}

// Pure utility — defined outside the component since it closes over no props or state.
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

/**
 * Displays a single market signal as an expandable card.
 * Expansion state is controlled externally — this component is purely presentational.
 */
export function CompanySignalCard({ signal, isExpanded, onToggle }: Props) {
  // Boolean() makes the intent explicit: we only care whether content exists, not its value.
  const hasExpandedContent = Boolean(signal.detalles || signal.hipotesis_inmobiliaria);

  return (
    <div className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-5 hover:border-[#1F554A] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="font-medium text-base text-[#141414]">{signal.titulo}</h4>
            {signal.ultima_fecha_actualizacion && (
              <Badge variant="secondary" className="text-xs bg-[#DCDEDC] text-gray-700">
                {formatDate(signal.ultima_fecha_actualizacion)}
              </Badge>
            )}
          </div>
          {signal.subtitulo && (
            <p className="text-sm font-medium text-[#1F554A] mb-2">{signal.subtitulo}</p>
          )}
        </div>
        <div className="flex gap-2 sm:gap-3 text-xs flex-shrink-0">
          <Badge className="bg-[#1F554A] text-white">
            {signal.tipo_proyecto}
          </Badge>
          <Badge variant="outline" className="border-[#1F554A] text-[#1F554A]">
            {signal.tipo_evento}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {signal.frase_resumen}
      </p>

      {isExpanded && (
        <div className="mb-3 space-y-2">
          {signal.detalles && (
            <p className="text-sm text-gray-700 leading-relaxed">{signal.detalles}</p>
          )}
          {signal.hipotesis_inmobiliaria && (
            <p className="text-sm text-gray-600 leading-relaxed italic">{signal.hipotesis_inmobiliaria}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {signal.fuente_url ? (
          <a
            href={signal.fuente_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#1F554A] hover:text-[#1F554A]/80 flex items-center gap-1 font-medium"
          >
            <ExternalLink className="size-3" />
            {signal.fuente}
          </a>
        ) : (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <ExternalLink className="size-3" />
            {signal.fuente}
          </span>
        )}
        {hasExpandedContent && (
          <button
            onClick={onToggle}
            className="text-xs text-[#1F554A] hover:text-[#1F554A]/80 flex items-center gap-1 font-medium"
          >
            {isExpanded ? (
              <>Ver menos <ChevronUp className="size-3" /></>
            ) : (
              <>Ver más <ChevronDown className="size-3" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

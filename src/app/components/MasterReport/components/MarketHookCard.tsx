// External libraries
import { TrendingUp, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

// Internal — types
import type { GanchoMercado } from '../../../../types/db/ganchoMercado';

// Internal — components
import { Badge } from '../../ui/badge';

interface Props {
  hook: GanchoMercado;
  isExpanded: boolean;
  /** No ID argument needed — parent pre-binds the hook ID before passing this down. */
  onToggle: () => void;
}

// Pure utility — defined outside the component since it closes over no props or state.
const parseKeyPoints = (raw: string | null): string[] => {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return [raw]; }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

/**
 * Displays a single market hook as an expandable card.
 * Expansion state is controlled externally — this component is purely presentational.
 */
export function MarketHookCard({ hook, isExpanded, onToggle }: Props) {
  const keyPoints = parseKeyPoints(hook.key_points);
  // Boolean() makes the intent explicit: we only care whether content exists, not its value.
  const hasExpandedContent = Boolean(hook.detalles || hook.angulo_venta || hook.sectores_beneficiados);

  return (
    <div className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-5 hover:border-[#1F554A] transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="size-8 rounded-full bg-[#1F554A] text-white flex items-center justify-center flex-shrink-0">
          <TrendingUp className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-medium text-base text-[#141414]">{hook.titulo}</h4>
            {hook.ultima_fecha_actualizacion && (
              <Badge variant="secondary" className="text-xs bg-[#DCDEDC] text-gray-700">
                {formatDate(hook.ultima_fecha_actualizacion)}
              </Badge>
            )}
          </div>
          {hook.subtitulo && (
            <p className="text-sm font-medium text-[#1F554A]">{hook.subtitulo}</p>
          )}
        </div>
      </div>

      <div className="ml-11">
        {hook.frase_resumen && (
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">{hook.frase_resumen}</p>
        )}

        {keyPoints.length > 0 && (
          <ul className="space-y-2 mb-3">
            {keyPoints.map((point, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-[#1F554A] font-bold mt-0.5">→</span>
                <span className="flex-1">{point}</span>
              </li>
            ))}
          </ul>
        )}

        {isExpanded && (
          <div className="mb-3 space-y-2">
            {hook.detalles && (
              <p className="text-sm text-gray-700 leading-relaxed">{hook.detalles}</p>
            )}
            {hook.angulo_venta && (
              <p className="text-sm text-gray-600 leading-relaxed">{hook.angulo_venta}</p>
            )}
            {hook.sectores_beneficiados && (
              <p className="text-sm text-gray-600 leading-relaxed">{hook.sectores_beneficiados}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {hook.fuente_url ? (
            <a
              href={hook.fuente_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1F554A] hover:text-[#1F554A]/80 flex items-center gap-1 font-medium"
            >
              <ExternalLink className="size-3" />
              {hook.fuente}
            </a>
          ) : hook.fuente ? (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <ExternalLink className="size-3" />
              {hook.fuente}
            </span>
          ) : null}
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
    </div>
  );
}

// Internal — types
import type { SenalMercado } from '../../../../types/db/senalMercado';

// Internal — components
import { Badge } from '../../ui/badge';

interface Props {
  señal: SenalMercado;
}

/**
 * Compact card for a single market signal.
 * Variant: flat, no expand/collapse — quick context for brokers starting a session.
 * See MasterReport for the expandible version.
 */
export function SenalMercadoCard({ señal }: Props) {
  return (
    <div className="border-2 border-[#DCDEDC] rounded-lg p-3 hover:border-[#1F554A] transition-colors bg-white">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm text-[#141414]">
              {señal.empresa_o_proyecto ?? señal.titulo ?? '—'}
            </p>
            <Badge className="bg-[#1F554A] text-white text-xs">
              {señal.tipo_proyecto}
            </Badge>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            {señal.frase_resumen}
          </p>
        </div>
      </div>
    </div>
  );
}

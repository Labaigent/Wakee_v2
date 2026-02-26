// Internal — types
import type { GanchoMercado } from '../../../../types/db/ganchoMercado';

interface Props {
  gancho: GanchoMercado;
}

/**
 * Compact card for a single market hook.
 * Variant: flat, no expand/collapse — quick context for brokers starting a session.
 * See MasterReport for the expandible version.
 */
export function GanchoMercadoCard({ gancho }: Props) {
  return (
    <div className="border-2 border-[#DCDEDC] rounded-lg p-3 hover:border-[#1F554A] transition-colors bg-white">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[#1F554A] mb-1">
            {gancho.titulo}
          </p>
          {gancho.frase_resumen && (
            <p className="text-xs text-gray-700 leading-relaxed">
              {gancho.frase_resumen}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

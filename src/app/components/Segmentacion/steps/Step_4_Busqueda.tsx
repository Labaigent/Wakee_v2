// React
import { useEffect } from 'react';

// External libraries
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

// Internal — hooks & types
import { useBusquedaProgreso } from '@/app/hooks/useBusquedaProgreso';
import type { EstadoSubPaso } from '@/types/db/e6BusquedaLeads';

interface StepBusquedaProps {
  ejecucionId: number | null;
  onComplete: () => void;
}

const SUB_PASOS_BUSQUEDA = [
  { clave: 'extraccion_sn' as const,            etiqueta: 'Extracción de Sales Navigator',  detalle: 'Obteniendo leads desde tu búsqueda...' },
  { clave: 'enriquecimiento_leads' as const,    etiqueta: 'Enriquecimiento de leads',       detalle: 'Completando perfiles de contacto...' },
  { clave: 'enriquecimiento_empresas' as const, etiqueta: 'Enriquecimiento de empresas',    detalle: 'Investigando empresas de los leads...' },
  { clave: 'calculo_score' as const,            etiqueta: 'Cálculo de puntuación final',    detalle: 'Evaluando alineación con tu ICP...' },
];

export function StepBusqueda({ ejecucionId, onComplete }: StepBusquedaProps) {
  const { progreso, estaCompleto, tieneError, porcentajeGeneral } = useBusquedaProgreso(ejecucionId);

  useEffect(() => {
    if (estaCompleto) {
      toast.success('Búsqueda completada.');
      onComplete();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaCompleto]);

  return (
    <div className="py-12 space-y-8">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          {tieneError ? (
            <XCircle className="size-12 text-red-500" />
          ) : estaCompleto ? (
            <CheckCircle2 className="size-12 text-[#1F554A]" />
          ) : (
            <Loader2 className="size-12 animate-spin text-[#1F554A]" />
          )}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-medium mb-2">Ejecutando búsqueda</h2>
          <p className="text-sm text-gray-600">
            {tieneError
              ? 'Se produjo un error en uno de los pasos.'
              : estaCompleto
              ? 'Proceso completado exitosamente.'
              : 'Procesando en segundo plano...'}
          </p>
        </div>
        <div className="space-y-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1F554A] transition-all duration-500"
              style={{ width: `${porcentajeGeneral}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{porcentajeGeneral}%</p>
        </div>

        {/* Checklist de sub-pasos */}
        <div className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-6 bg-white text-left">
          <h3 className="text-sm font-medium text-[#141414] mb-4 uppercase tracking-wide">Proceso de Búsqueda</h3>
          <div className="space-y-3">
            {SUB_PASOS_BUSQUEDA.map(({ clave, etiqueta, detalle }) => {
              const estado: EstadoSubPaso = progreso[clave];
              return (
                <div key={clave} className="flex items-start gap-3">
                  {estado === 'completado' ? (
                    <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
                  ) : estado === 'en_progreso' ? (
                    <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
                  ) : estado === 'error' ? (
                    <XCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${estado !== 'pendiente' ? 'text-[#141414]' : 'text-gray-400'}`}>
                      {etiqueta}
                    </p>
                    {estado === 'en_progreso' && (
                      <p className="text-xs text-gray-600 mt-0.5">{detalle}</p>
                    )}
                    {estado === 'completado' && (
                      <p className="text-xs text-[#1F554A] mt-0.5 font-medium">Completado</p>
                    )}
                    {estado === 'error' && (
                      <p className="text-xs text-red-600 mt-0.5">Error en este paso</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

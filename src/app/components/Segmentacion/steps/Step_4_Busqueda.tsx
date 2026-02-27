// React
import { useEffect } from 'react';

// External libraries
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface StepBusquedaProps {
  processingProgress: number;
  processingStatus: string;
  onProgress: (progress: number, status: string) => void;
  onComplete: () => void;
}

const BUSQUEDA_STAGES = [
  { progress: 20, status: 'Conectando con LinkedIn Sales Navigator...' },
  { progress: 40, status: 'Ejecutando búsqueda boolean...' },
  { progress: 60, status: 'Extrayendo perfiles relevantes...' },
  { progress: 80, status: 'Calculando scores de matching...' },
  { progress: 100, status: 'Completado' },
];

export function StepBusqueda({
  processingProgress,
  processingStatus,
  onProgress,
  onComplete,
}: StepBusquedaProps) {
  // --- Effect: simulación de búsqueda al montar (si progreso < 100; al volver desde ranking no se re-ejecuta) ---
  useEffect(() => {
    if (processingProgress >= 100) return;

    let cancelled = false;
    (async () => {
      for (const stage of BUSQUEDA_STAGES) {
        if (cancelled) return;
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (cancelled) return;
        onProgress(stage.progress, stage.status);
      }
      if (cancelled) return;
      toast.success('Búsqueda completada. 30 leads encontrados.');
      onComplete();
    })();
    return () => {
      cancelled = true;
    };
    // Solo al montar; processingProgress se lee para no re-ejecutar si ya está completo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-12 space-y-8">
      {/* Progreso y barra */}
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <Loader2 className="size-12 animate-spin text-[#1F554A]" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-medium mb-2">Ejecutando búsqueda</h2>
          <p className="text-sm text-gray-600">{processingStatus}</p>
        </div>
        <div className="space-y-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1F554A] transition-all duration-500"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{processingProgress}%</p>
        </div>
        {/* Checklist de etapas */}
        <div className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-6 bg-white text-left">
          <h3 className="text-sm font-medium text-[#141414] mb-4 uppercase tracking-wide">Proceso de Búsqueda</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {processingProgress > 20 ? (
                <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
              ) : processingProgress > 0 ? (
                <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
              ) : (
                <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${processingProgress > 0 ? 'text-[#141414]' : 'text-gray-400'}`}>Buscando Leads</p>
                {processingProgress > 0 && processingProgress <= 20 && (
                  <p className="text-xs text-gray-600 mt-0.5">Conectando con LinkedIn Sales Navigator...</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              {processingProgress > 40 ? (
                <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
              ) : processingProgress > 20 ? (
                <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
              ) : (
                <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${processingProgress > 20 ? 'text-[#141414]' : 'text-gray-400'}`}>Calificando Leads</p>
                {processingProgress > 20 && processingProgress <= 40 && (
                  <p className="text-xs text-gray-600 mt-0.5">Ejecutando búsqueda boolean...</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              {processingProgress > 60 ? (
                <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
              ) : processingProgress > 40 ? (
                <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
              ) : (
                <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${processingProgress > 40 ? 'text-[#141414]' : 'text-gray-400'}`}>Investigando Empresas</p>
                {processingProgress > 40 && processingProgress <= 60 && (
                  <p className="text-xs text-gray-600 mt-0.5">Extrayendo perfiles relevantes...</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              {processingProgress > 80 ? (
                <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
              ) : processingProgress > 60 ? (
                <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
              ) : (
                <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${processingProgress > 60 ? 'text-[#141414]' : 'text-gray-400'}`}>Calificando Empresas</p>
                {processingProgress > 60 && processingProgress <= 80 && (
                  <p className="text-xs text-gray-600 mt-0.5">Calculando scores de matching...</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              {processingProgress >= 100 ? (
                <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
              ) : processingProgress > 80 ? (
                <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
              ) : (
                <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${processingProgress > 80 ? 'text-[#141414]' : 'text-gray-400'}`}>Priorizando los mejores leads</p>
                {processingProgress > 80 && processingProgress < 100 && (
                  <p className="text-xs text-gray-600 mt-0.5">Generando ranking final...</p>
                )}
                {processingProgress >= 100 && (
                  <p className="text-xs text-[#1F554A] mt-0.5 font-medium">¡Completado!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

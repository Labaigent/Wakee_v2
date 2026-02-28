// Internal — components
import { Button } from '../../ui/button';

interface StepIntroProps {
  title: string;
  phase: string;
  isExecutionSelected: boolean;
  isLoading: boolean;
  onStartWizard: () => void;
}

export function StepIntro({ title, phase, isExecutionSelected, isLoading, onStartWizard }: StepIntroProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl sm:text-2xl font-medium mb-2 text-[#141414]">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600">{phase}</p>
      </div>

      {/* Card: flujo y CTA */}
      <div className="border-2 border-[#1F554A] rounded-lg p-6 sm:p-8 bg-gradient-to-br from-white to-[#C4FF81]/5">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#1F554A] text-white mb-2">
            <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-medium text-[#141414] mb-2">Prospección Inteligente</h4>
            <p className="text-sm sm:text-base text-gray-600">
              Este flujo te guiará paso a paso por la definición de tu estrategia
            </p>
          </div>
          <div className="bg-white border border-[#DCDEDC] rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <ul className="text-sm sm:text-base text-left space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">1</span>
                <span className="text-gray-700">Selección de ICP (Ideal Customer Profile)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">2</span>
                <span className="text-gray-700">Validación de Buyer Persona</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">3</span>
                <span className="text-gray-700">Confirmación de Filtro de búsqueda</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">4</span>
                <span className="text-gray-700">Búsqueda automática de leads</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">5</span>
                <span className="text-gray-700">Ranking y selección de Leads</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">6</span>
                <span className="text-gray-700">Generación de dossiers detallados</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-[#1F554A] text-white text-xs flex items-center justify-center font-medium mt-0.5">7</span>
                <span className="text-gray-700">Creación de borradores de mensajes</span>
              </li>
            </ul>
          </div>
          <Button
            onClick={onStartWizard}
            disabled={!isExecutionSelected || isLoading}
            className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90 px-8 py-6 text-base sm:text-lg h-auto disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <svg className="size-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Procesando estrategia…
              </>
            ) : (
              <>
                <svg className="size-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Iniciar Estrategia
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

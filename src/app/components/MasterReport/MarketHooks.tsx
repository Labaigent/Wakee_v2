import { MarketHook } from './types';
import { MarketHookCard } from './components/MarketHookCard';

interface Props {
  hooks: MarketHook[];
}

export function MarketHooks({ hooks }: Props) {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm text-gray-600">
          Tendencias macro, regulaciones, incentivos fiscales y dinámicas de mercado que impulsan la demanda inmobiliaria
        </p>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {hooks.map((hook) => (
          <MarketHookCard key={hook.id} hook={hook} />
        ))}
      </div>
    </div>
  );
}

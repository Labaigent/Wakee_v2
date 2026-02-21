import { TrendingUp } from 'lucide-react';
import { MarketHook } from '../types';

interface Props {
  hook: MarketHook;
}

export function MarketHookCard({ hook }: Props) {
  return (
    <div className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-5 hover:border-[#1F554A] transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="size-8 rounded-full bg-[#1F554A] text-white flex items-center justify-center flex-shrink-0">
          <TrendingUp className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-base text-[#141414] mb-2">{hook.topic}</h4>
          <p className="text-sm text-[#1F554A] font-medium mb-3">{hook.hook}</p>
        </div>
      </div>
      <div className="ml-11">
        <ul className="space-y-2">
          {hook.data.map((d, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-[#1F554A] font-bold mt-0.5">→</span>
              <span className="flex-1">{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

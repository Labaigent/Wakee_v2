import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { CompanySignal } from '../types';

interface Props {
  signal: CompanySignal;
  isExpanded: boolean;
  onToggle: () => void;
  formatDate: (dateString: string) => string;
}

export function CompanySignalCard({ signal, isExpanded, onToggle, formatDate }: Props) {
  const truncatedDesc = signal.description.length > 120
    ? signal.description.substring(0, 120) + '...'
    : signal.description;

  return (
    <div className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-5 hover:border-[#1F554A] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="font-medium text-base text-[#141414]">{signal.company}</h4>
            <Badge variant="secondary" className="text-xs bg-[#DCDEDC] text-gray-700">
              {formatDate(signal.date)}
            </Badge>
          </div>
          <p className="text-sm font-medium text-[#1F554A] mb-2">{signal.signal}</p>
        </div>
        <div className="flex gap-2 sm:gap-3 text-xs flex-shrink-0">
          <Badge className="bg-[#1F554A] text-white">
            {signal.assetClass}
          </Badge>
          <Badge variant="outline" className="border-[#1F554A] text-[#1F554A]">
            {signal.timing}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {isExpanded ? signal.description : truncatedDesc}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <a
          href={signal.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#1F554A] hover:text-[#1F554A]/80 flex items-center gap-1 font-medium"
        >
          <ExternalLink className="size-3" />
          {signal.source}
        </a>
        {signal.description.length > 120 && (
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

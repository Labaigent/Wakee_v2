import { CheckCircle2 } from 'lucide-react';
import {
  type SegmentacionStep,
  SEGMENTACION_STEP_ORDER,
  SEGMENTACION_STEP_LABELS,
  getStepIndex,
  isStepUnlocked,
} from './types';

interface SegmentacionStepNavProps {
  currentStep: SegmentacionStep;
  maxReachedStep: SegmentacionStep;
  onStepClick: (step: Exclude<SegmentacionStep, 'intro'>) => void;
}

export function SegmentacionStepNav({
  currentStep,
  maxReachedStep,
  onStepClick,
}: SegmentacionStepNavProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center justify-between text-xs sm:text-sm min-w-[600px] sm:min-w-0">
        {SEGMENTACION_STEP_ORDER.map((step, index) => {
          const isActive = currentStep === step;
          const completed = getStepIndex(currentStep) > getStepIndex(step);
          const unlocked = isStepUnlocked(step, maxReachedStep);
          const label = SEGMENTACION_STEP_LABELS[step];
          const stepNumber = index + 1;

          return (
            <div key={step} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => unlocked && onStepClick(step)}
                disabled={!unlocked}
                className={`flex items-center gap-1 sm:gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1F554A] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 ${
                  !unlocked ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                aria-label={`Ir a ${label}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <div
                  className={`size-7 sm:size-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm flex-shrink-0 ${
                    isActive
                      ? 'border-[#1F554A] bg-[#1F554A] text-white'
                      : completed
                        ? 'border-[#1F554A] bg-white text-[#1F554A]'
                        : unlocked
                          ? 'border-gray-300 text-gray-600'
                          : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {completed ? <CheckCircle2 className="size-3 sm:size-4" /> : stepNumber}
                </div>
                <span
                  className={`hidden sm:inline truncate ${
                    isActive ? 'font-medium text-[#1F554A]' : completed ? 'text-[#1F554A]' : unlocked ? 'text-gray-600' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </button>
              {index < SEGMENTACION_STEP_ORDER.length - 1 && (
                <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2 min-w-[8px]" aria-hidden />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

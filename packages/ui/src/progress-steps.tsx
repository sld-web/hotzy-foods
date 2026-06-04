import { cn } from './utils';
import React from 'react';

interface ProgressStepsProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-bold',
                i <= currentStep
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant',
              )}
            >
              {i < currentStep ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                i + 1
              )}
            </div>
            <div className="hidden sm:block">
              <p
                className={cn(
                  'text-label-sm',
                  i <= currentStep ? 'text-primary font-semibold' : 'text-on-surface-variant',
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-label-sm text-on-surface-variant">{step.description}</p>
              )}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-2',
                i < currentStep ? 'bg-primary' : 'bg-surface-container',
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

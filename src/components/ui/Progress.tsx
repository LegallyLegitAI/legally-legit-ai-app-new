import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'prevent' | 'predict' | 'protect' | 'default';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', size = 'md', showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const variants = {
      default: 'bg-legally-neutral-600',
      prevent: 'bg-prevent-600',
      predict: 'bg-predict-600',
      protect: 'bg-protect-600',
    };

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <div className="w-full space-y-2">
        {showLabel && (
          <div className="flex justify-between text-sm">
            <span className="text-legally-neutral-700">Progress</span>
            <span className="text-legally-neutral-500">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn('w-full bg-legally-neutral-200 rounded-full overflow-hidden', sizes[size], className)}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          {...props}
        >
          <div
            className={cn('h-full rounded-full transition-all duration-300 ease-out', variants[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };

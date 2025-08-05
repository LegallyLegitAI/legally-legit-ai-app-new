import React from 'react';
import { cn } from '../../lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, children, onClose, icon, ...props }, ref) => {
    const variants = {
      default: 'bg-legally-neutral-50 border-legally-neutral-200 text-legally-neutral-800',
      success: 'bg-predict-50 border-predict-200 text-predict-800',
      warning: 'bg-protect-50 border-protect-200 text-protect-800',
      error: 'bg-alert-50 border-alert-200 text-alert-800',
      info: 'bg-prevent-50 border-prevent-200 text-prevent-800',
    };

    const iconColors = {
      default: 'text-legally-neutral-400',
      success: 'text-predict-400',
      warning: 'text-protect-400',
      error: 'text-alert-400',
      info: 'text-prevent-400',
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-lg border p-4',
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="flex">
          {icon && (
            <div className={cn('flex-shrink-0', iconColors[variant])}>
              {icon}
            </div>
          )}
          <div className={cn('ml-3', !icon && 'ml-0')}>
            {title && (
              <h3 className="text-sm font-medium mb-1">
                {title}
              </h3>
            )}
            <div className="text-sm">
              {children}
            </div>
          </div>
          {onClose && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className={cn(
                    'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    iconColors[variant],
                    'hover:opacity-75'
                  )}
                  onClick={onClose}
                  aria-label="Dismiss"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };

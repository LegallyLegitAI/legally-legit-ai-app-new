import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', label, helperText, icon, required, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseStyles = 'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const variants = {
      default: 'border-legally-neutral-300 bg-white focus:border-prevent-500 focus:ring-prevent-500',
      error: 'border-alert-300 bg-white focus:border-alert-500 focus:ring-alert-500',
      success: 'border-predict-300 bg-white focus:border-predict-500 focus:ring-predict-500',
    };

    const helperTextStyles = {
      default: 'text-legally-neutral-600',
      error: 'text-alert-600',
      success: 'text-predict-600',
    };

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-legally-neutral-900"
          >
            {label}
            {required && <span className="text-alert-500 ml-1" aria-label="required">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-legally-neutral-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              baseStyles,
              variants[variant],
              icon && 'pl-10',
              className
            )}
            ref={ref}
            aria-required={required}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn('text-xs', helperTextStyles[variant])}
            role={variant === 'error' ? 'alert' : undefined}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

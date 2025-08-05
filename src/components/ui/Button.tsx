import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'prevent' | 'predict' | 'protect' | 'alert' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'prevent', size = 'md', children, loading = false, icon, iconPosition = 'left', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      prevent: 'bg-prevent-600 hover:bg-prevent-700 text-white shadow-sm focus:ring-prevent-500',
      predict: 'bg-predict-600 hover:bg-predict-700 text-white shadow-sm focus:ring-predict-500',
      protect: 'bg-protect-600 hover:bg-protect-700 text-white shadow-sm focus:ring-protect-500',
      alert: 'bg-alert-600 hover:bg-alert-700 text-white shadow-sm focus:ring-alert-500',
      ghost: 'hover:bg-legally-neutral-100 text-legally-neutral-900 focus:ring-legally-neutral-500',
      outline: 'border border-legally-neutral-300 bg-white hover:bg-legally-neutral-50 text-legally-neutral-900 focus:ring-legally-neutral-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-xl gap-3',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && 'cursor-wait',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

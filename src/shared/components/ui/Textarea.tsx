import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={clsx(
          'min-h-[100px] w-full rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

import * as React from 'react';
import { cn } from './utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  maxLength?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      helperText,
      resize = 'vertical',
      maxLength,
      id,
      value,
      onChange,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const counterId = maxLength ? `${textareaId}-counter` : undefined;
    const describedBy = [errorId, helperId, counterId, ariaDescribedBy]
      .filter(Boolean)
      .join(' ');

    const [charCount, setCharCount] = React.useState(
      typeof value === 'string' ? value.length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength) {
        setCharCount(e.target.value.length);
      }
      onChange?.(e);
    };

    React.useEffect(() => {
      if (maxLength && typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value, maxLength]);

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className="w-full">
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            resizeClasses[resize],
            error
              ? 'border-destructive focus-visible:ring-destructive aria-invalid:true'
              : 'border-input',
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          aria-label={ariaLabel}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : undefined}
          maxLength={maxLength}
          {...props}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <div>
            {error && (
              <p
                id={errorId}
                className="text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={helperId} className="text-sm text-muted-foreground">
                {helperText}
              </p>
            )}
          </div>
          {maxLength && (
            <p
              id={counterId}
              className={cn(
                'text-xs text-muted-foreground',
                charCount >= maxLength && 'text-destructive'
              )}
              aria-live="polite"
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

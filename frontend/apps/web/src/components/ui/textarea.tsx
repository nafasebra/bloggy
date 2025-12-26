import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Error message to display below the textarea.
   * When provided, the textarea will show error styling.
   */
  error?: string;
  /**
   * Helper text to display below the textarea.
   * Useful for providing additional context or instructions.
   */
  helperText?: string;
  /**
   * Resize behavior of the textarea.
   * - 'none': Cannot be resized
   * - 'vertical': Can be resized vertically only
   * - 'horizontal': Can be resized horizontally only
   * - 'both': Can be resized in both directions
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  /**
   * Maximum number of characters allowed.
   * When provided, a character counter will be displayed.
   */
  maxLength?: number;
  /**
   * Accessible label for the textarea.
   * Required for accessibility when label is not provided separately.
   */
  'aria-label'?: string;
  /**
   * ID of element that describes this textarea.
   * Used for associating error/helper text with the textarea.
   */
  'aria-describedby'?: string;
}

/**
 * Textarea component with error states, helper text, resize options, and character counter.
 * 
 * Fully accessible with proper ARIA attributes and keyboard navigation.
 * Supports error states, helper text, resize variants, and character counting.
 * 
 * @example
 * ```tsx
 * <Textarea placeholder="Enter your message" />
 * <Textarea error="Message is required" />
 * <Textarea maxLength={500} helperText="Maximum 500 characters" />
 * <Textarea resize="vertical" />
 * ```
 */
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

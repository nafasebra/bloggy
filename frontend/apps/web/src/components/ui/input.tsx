import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error message to display below the input.
   * When provided, the input will show error styling.
   */
  error?: string;
  /**
   * Helper text to display below the input.
   * Useful for providing additional context or instructions.
   */
  helperText?: string;
  /**
   * Icon to display on the left side of the input.
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display on the right side of the input.
   */
  rightIcon?: React.ReactNode;
  /**
   * Accessible label for the input.
   * Required for accessibility when label is not provided separately.
   */
  'aria-label'?: string;
  /**
   * ID of element that describes this input.
   * Used for associating error/helper text with the input.
   */
  'aria-describedby'?: string;
}

/**
 * Input component with error states, helper text, and icon support.
 * 
 * Fully accessible with proper ARIA attributes and keyboard navigation.
 * Supports error states, helper text, and left/right icons.
 * 
 * @example
 * ```tsx
 * <Input placeholder="Enter your email" />
 * <Input error="Email is required" />
 * <Input helperText="We'll never share your email" leftIcon={<MailIcon />} />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId, ariaDescribedBy]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
              error
                ? 'border-destructive focus-visible:ring-destructive aria-invalid:true'
                : 'border-input',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            ref={ref}
            aria-label={ariaLabel}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          />
          {rightIcon && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };

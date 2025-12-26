'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, MinusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  /**
   * Accessible label for the checkbox.
   * Required when checkbox is not associated with a visible label.
   */
  'aria-label'?: string;
  /**
   * ID of element that describes this checkbox.
   * Used for associating helper text or error messages.
   */
  'aria-describedby'?: string;
}

/**
 * Checkbox component with checked, unchecked, and indeterminate states.
 * 
 * Built on Radix UI Checkbox primitive with full keyboard navigation and accessibility.
 * Supports checked, unchecked, and indeterminate states.
 * 
 * @example
 * ```tsx
 * <Checkbox id="terms" />
 * <Label htmlFor="terms">Accept terms</Label>
 * 
 * <Checkbox checked={true} />
 * <Checkbox checked="indeterminate" />
 * ```
 */
function Checkbox({
  className,
  checked,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}: CheckboxProps) {
  const isIndeterminate = checked === 'indeterminate';

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        isIndeterminate && 'bg-primary border-primary',
        className
      )}
      checked={checked}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        {isIndeterminate ? (
          <MinusIcon className="size-3.5" />
        ) : (
          <CheckIcon className="size-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

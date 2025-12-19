import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /**
   * Show required indicator (asterisk).
   * When true, displays an asterisk after the label text.
   */
  required?: boolean;
  /**
   * Custom text for required indicator.
   * Defaults to '*' if not provided.
   */
  requiredText?: string;
}

/**
 * Label component for form inputs and controls.
 * 
 * Built on Radix UI Label primitive with proper accessibility associations.
 * Supports required indicator and disabled state styling.
 * 
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" />
 * 
 * <Label htmlFor="name" required>Full Name</Label>
 * <Input id="name" />
 * ```
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required, requiredText, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {children}
    {required && (
      <span className="text-destructive ml-1" aria-label="required">
        {requiredText || '*'}
      </span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from '@repo/ui/checkbox';
import { Label } from '@repo/ui/label';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A checkbox component with checked, unchecked, and indeterminate states. Fully accessible with keyboard navigation.',
      },
    },
  },
  tags: ['!autodocs'],
  argTypes: {
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the checkbox',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default checkbox in unchecked state.
 */
export const Default: Story = {
  args: {},
};

/**
 * Checkbox states: unchecked, checked, and indeterminate.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checked" checked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="indeterminate" checked="indeterminate" />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>
    </div>
  ),
};

/**
 * Checkbox with labels.
 */
export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="newsletter" checked />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing">Receive marketing emails</Label>
      </div>
    </div>
  ),
};

/**
 * Disabled checkbox states.
 */
export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" checked disabled />
        <Label htmlFor="disabled-checked">Disabled checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-indeterminate" checked="indeterminate" disabled />
        <Label htmlFor="disabled-indeterminate">Disabled indeterminate</Label>
      </div>
    </div>
  ),
};

/**
 * Checkbox group example.
 */
export const CheckboxGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label className="text-base font-semibold">Select your interests</Label>
      <div className="flex items-center gap-2">
        <Checkbox id="tech" />
        <Label htmlFor="tech">Technology</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="design" />
        <Label htmlFor="design">Design</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="business" />
        <Label htmlFor="business">Business</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="science" />
        <Label htmlFor="science">Science</Label>
      </div>
    </div>
  ),
};


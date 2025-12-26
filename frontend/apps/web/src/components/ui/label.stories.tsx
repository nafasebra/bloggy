import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from './label';
import { Input } from './input';
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A label component for form inputs and controls. Supports required indicator and proper accessibility associations.',
      },
    },
  },
  tags: ['!autodocs'],
  argTypes: {
    required: {
      control: 'boolean',
      description: 'Show required indicator',
    },
    requiredText: {
      control: 'text',
      description: 'Custom text for required indicator',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default label.
 */
export const Default: Story = {
  args: {
    children: 'Label',
  },
};

/**
 * Label with required indicator.
 */
export const Required: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" required>
          Email Address
        </Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name" required>
          Full Name
        </Label>
        <Input id="name" placeholder="Enter your name" />
      </div>
    </div>
  ),
};

/**
 * Label with custom required text.
 */
export const CustomRequiredText: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="custom" required requiredText="(required)">
        Custom Required Text
      </Label>
      <Input id="custom" placeholder="Enter value" />
    </div>
  ),
};

/**
 * Label with input field.
 */
export const WithInput: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="email-input">Email</Label>
      <Input id="email-input" type="email" placeholder="Enter email" />
    </div>
  ),
};

/**
 * Label with checkbox.
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms-checkbox" />
      <Label htmlFor="terms-checkbox">Accept terms and conditions</Label>
    </div>
  ),
};

/**
 * Label with radio group.
 */
export const WithRadioGroup: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Select an option</Label>
      <RadioGroup defaultValue="option1">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option1" id="radio-option1" />
          <Label htmlFor="radio-option1">Option 1</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option2" id="radio-option2" />
          <Label htmlFor="radio-option2">Option 2</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option3" id="radio-option3" />
          <Label htmlFor="radio-option3">Option 3</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

/**
 * Form example with multiple labels.
 */
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="form-email" required>
          Email
        </Label>
        <Input id="form-email" type="email" placeholder="Enter email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="form-password" required>
          Password
        </Label>
        <Input id="form-password" type="password" placeholder="Enter password" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="form-remember" />
        <Label htmlFor="form-remember">Remember me</Label>
      </div>
    </div>
  ),
};


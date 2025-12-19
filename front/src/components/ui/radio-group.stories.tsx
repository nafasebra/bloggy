import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A radio group component for selecting a single option. Supports horizontal and vertical orientations. Fully accessible with keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the radio group',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default radio group with vertical orientation.
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="option2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Radio group with horizontal orientation.
 */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" orientation="horizontal">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="h-option1" />
        <Label htmlFor="h-option1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="h-option2" />
        <Label htmlFor="h-option2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="h-option3" />
        <Label htmlFor="h-option3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Radio group with vertical orientation (default).
 */
export const Vertical: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" orientation="vertical">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="v-option1" />
        <Label htmlFor="v-option1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="v-option2" />
        <Label htmlFor="v-option2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="v-option3" />
        <Label htmlFor="v-option3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Disabled radio group states.
 */
export const DisabledStates: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="d-option1" />
        <Label htmlFor="d-option1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="d-option2" disabled />
        <Label htmlFor="d-option2">Option 2 (Disabled)</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="d-option3" />
        <Label htmlFor="d-option3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Radio group with many options.
 */
export const ManyOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="m-option1" />
        <Label htmlFor="m-option1">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="m-option2" />
        <Label htmlFor="m-option2">Medium</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="m-option3" />
        <Label htmlFor="m-option3">Large</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option4" id="m-option4" />
        <Label htmlFor="m-option4">Extra Large</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option5" id="m-option5" />
        <Label htmlFor="m-option5">XXL</Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * Radio group form example.
 */
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-2 block">
          Select your preferred payment method
        </Label>
        <RadioGroup defaultValue="credit">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit">Credit Card</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit">Debit Card</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal">PayPal</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank">Bank Transfer</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};


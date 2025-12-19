import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from './textarea';
import { useState } from 'react';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A textarea component with error states, helper text, resize options, and character counter. Fully accessible with proper ARIA attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the textarea',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display',
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'Resize behavior',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character count',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default textarea.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

/**
 * Textarea with different resize options.
 */
export const ResizeVariants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <label className="text-sm font-medium mb-1 block">No resize</label>
        <Textarea placeholder="Cannot be resized" resize="none" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Vertical resize</label>
        <Textarea placeholder="Resize vertically" resize="vertical" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Horizontal resize</label>
        <Textarea placeholder="Resize horizontally" resize="horizontal" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Both directions</label>
        <Textarea placeholder="Resize both ways" resize="both" />
      </div>
    </div>
  ),
};

/**
 * Textarea states: default, disabled, and error.
 */
export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Textarea placeholder="Normal textarea" />
      <Textarea placeholder="Disabled textarea" disabled />
      <Textarea placeholder="Error textarea" error="This field is required" />
    </div>
  ),
};

/**
 * Textarea with helper text.
 */
export const WithHelperText: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Textarea
        placeholder="Enter your bio"
        helperText="Tell us a little about yourself"
      />
      <Textarea
        placeholder="Enter description"
        helperText="Maximum 500 characters allowed"
      />
    </div>
  ),
};

/**
 * Textarea with character counter.
 */
export const WithCounter: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Textarea
          placeholder="Enter your message"
          maxLength={200}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * Textarea with character counter and helper text.
 */
export const WithCounterAndHelper: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Textarea
          placeholder="Enter your comment"
          maxLength={500}
          helperText="Be respectful and constructive"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * Textarea with error state.
 */
export const ErrorStates: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Textarea
        placeholder="Message"
        error="Message is required"
      />
      <Textarea
        placeholder="Description"
        error="Description must be at least 10 characters"
      />
    </div>
  ),
};

/**
 * Textarea reaching character limit.
 */
export const CharacterLimit: Story = {
  render: () => {
    const [value, setValue] = useState('A'.repeat(195));
    return (
      <div className="w-80">
        <Textarea
          placeholder="Enter your message"
          maxLength={200}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="Approaching character limit"
        />
      </div>
    );
  },
};


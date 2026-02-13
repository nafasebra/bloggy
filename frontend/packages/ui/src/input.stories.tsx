import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@repo/ui/input';
import { MailIcon, LockIcon, SearchIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An input component with error states, helper text, and icon support. Fully accessible with proper ARIA attributes.',
      },
    },
  },
  tags: ['!autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input field.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

/**
 * Input with different types.
 */
export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="search" placeholder="Search input" />
    </div>
  ),
};

/**
 * Input states: default, disabled, and error.
 */
export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input placeholder="Normal input" />
      <Input placeholder="Disabled input" disabled />
      <Input placeholder="Error input" error="This field is required" />
    </div>
  ),
};

/**
 * Input with helper text.
 */
export const WithHelperText: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        placeholder="Enter your email"
        helperText="We'll never share your email with anyone else."
      />
      <Input
        placeholder="Enter password"
        type="password"
        helperText="Must be at least 8 characters"
      />
    </div>
  ),
};

/**
 * Input with error messages.
 */
export const ErrorStates: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        placeholder="Email"
        type="email"
        error="Email is required"
      />
      <Input
        placeholder="Password"
        type="password"
        error="Password must be at least 8 characters"
      />
    </div>
  ),
};

/**
 * Input with left icon.
 */
export const WithLeftIcon: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        placeholder="Search..."
        leftIcon={<SearchIcon className="size-4" />}
      />
      <Input
        placeholder="Email"
        type="email"
        leftIcon={<MailIcon className="size-4" />}
      />
      <Input
        placeholder="Password"
        type="password"
        leftIcon={<LockIcon className="size-4" />}
      />
    </div>
  ),
};

/**
 * Input with right icon.
 */
export const WithRightIcon: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        placeholder="Search..."
        rightIcon={<SearchIcon className="size-4" />}
      />
    </div>
  ),
};

/**
 * Password input with show/hide toggle.
 */
export const PasswordToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="w-80">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          leftIcon={<LockIcon className="size-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          }
        />
      </div>
    );
  },
};

/**
 * Input with both icons and helper text.
 */
export const WithIconsAndHelper: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        placeholder="Email address"
        type="email"
        leftIcon={<MailIcon className="size-4" />}
        helperText="Enter your email address"
      />
      <Input
        placeholder="Search"
        leftIcon={<SearchIcon className="size-4" />}
        rightIcon={<SearchIcon className="size-4" />}
        helperText="Search for posts, users, or tags"
      />
    </div>
  ),
};


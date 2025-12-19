import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';
import { Loader2Icon, MailIcon, PlusIcon, TrashIcon } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and states. Supports loading state, icons, and full keyboard accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner and disable button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child element (for composition)',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button with primary styling.
 */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

/**
 * All available button variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

/**
 * All available button sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <PlusIcon />
      </Button>
    </div>
  ),
};

/**
 * Button states: default, disabled, and loading.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button disabled loading>
        Disabled Loading
      </Button>
    </div>
  ),
};

/**
 * Buttons with icons.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <MailIcon />
        Send Email
      </Button>
      <Button variant="destructive">
        <TrashIcon />
        Delete
      </Button>
      <Button variant="outline" size="icon">
        <PlusIcon />
      </Button>
      <Button variant="ghost" size="icon">
        <Loader2Icon />
      </Button>
    </div>
  ),
};

/**
 * Loading state examples across different variants.
 */
export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading>Loading Default</Button>
      <Button variant="destructive" loading>
        Loading Destructive
      </Button>
      <Button variant="outline" loading>
        Loading Outline
      </Button>
      <Button variant="secondary" loading>
        Loading Secondary
      </Button>
    </div>
  ),
};

/**
 * Disabled state examples.
 */
export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled Default</Button>
      <Button variant="destructive" disabled>
        Disabled Destructive
      </Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
      <Button variant="secondary" disabled>
        Disabled Secondary
      </Button>
    </div>
  ),
};


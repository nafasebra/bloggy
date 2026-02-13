import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toaster } from '@repo/ui/sonner';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toast notification component using Sonner. Provides success, error, warning, info, and loading notifications.',
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toast setup. Use the buttons below to trigger different toast types.
 */
export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => toast.success('Operation completed successfully!')}
        >
          Success Toast
        </Button>
        <Button
          onClick={() => toast.error('Something went wrong!')}
          variant="destructive"
        >
          Error Toast
        </Button>
        <Button
          onClick={() => toast.warning('Please check your input')}
          variant="outline"
        >
          Warning Toast
        </Button>
        <Button onClick={() => toast.info('New update available')}>
          Info Toast
        </Button>
        <Button
          onClick={() => {
            toast.loading('Processing...');
            setTimeout(() => {
              toast.success('Done!');
            }, 2000);
          }}
        >
          Loading Toast
        </Button>
      </div>
    </div>
  ),
};

/**
 * Toast with custom duration.
 */
export const CustomDuration: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <div className="flex flex-col gap-2">
        <Button
          onClick={() =>
            toast.success('This toast stays for 5 seconds', {
              duration: 5000,
            })
          }
        >
          Long Duration
        </Button>
        <Button
          onClick={() =>
            toast.info('This toast stays for 1 second', {
              duration: 1000,
            })
          }
        >
          Short Duration
        </Button>
      </div>
    </div>
  ),
};

/**
 * Toast with action button.
 */
export const WithAction: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <Button
        onClick={() =>
          toast('File uploaded', {
            action: {
              label: 'Undo',
              onClick: () => toast.info('Action undone'),
            },
          })
        }
      >
        Toast with Action
      </Button>
    </div>
  ),
};

/**
 * Toast with description.
 */
export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <Button
        onClick={() =>
          toast.success('Profile updated', {
            description: 'Your profile has been successfully updated.',
          })
        }
      >
        Toast with Description
      </Button>
    </div>
  ),
};


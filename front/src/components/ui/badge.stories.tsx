import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A badge component for displaying status, labels, or counts. Supports multiple variants including success, warning, and info. Can display as a dot indicator.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
        'outline',
      ],
      description: 'Visual style variant',
    },
    dot: {
      control: 'boolean',
      description: 'Show as dot indicator',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge.
 */
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

/**
 * All available badge variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

/**
 * Badge with different content.
 */
export const Content: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>New</Badge>
      <Badge>12</Badge>
      <Badge>Active</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">Pending</Badge>
    </div>
  ),
};

/**
 * Dot variant badges.
 */
export const DotVariant: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge dot variant="default" />
        <span className="text-sm">Default</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge dot variant="success" />
        <span className="text-sm">Online</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge dot variant="warning" />
        <span className="text-sm">Away</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge dot variant="destructive" />
        <span className="text-sm">Offline</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge dot variant="info" />
        <span className="text-sm">Busy</span>
      </div>
    </div>
  ),
};

/**
 * Status badges example.
 */
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="success">Active</Badge>
        <span className="text-sm">User account is active</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="warning">Pending</Badge>
        <span className="text-sm">Payment is pending</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="destructive">Failed</Badge>
        <span className="text-sm">Transaction failed</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="info">Processing</Badge>
        <span className="text-sm">Request is being processed</span>
      </div>
    </div>
  ),
};

/**
 * Notification badges with counts.
 */
export const NotificationBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="relative">
        <span className="text-lg">Notifications</span>
        <Badge className="ml-2">3</Badge>
      </div>
      <div className="relative">
        <span className="text-lg">Messages</span>
        <Badge variant="destructive" className="ml-2">
          12
        </Badge>
      </div>
      <div className="relative">
        <span className="text-lg">Updates</span>
        <Badge variant="success" className="ml-2">
          5
        </Badge>
      </div>
    </div>
  ),
};


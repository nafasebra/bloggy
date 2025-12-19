import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { MailIcon, SettingsIcon, UserIcon } from 'lucide-react';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tabs component for creating tabbed interfaces. Supports horizontal and vertical orientations. Fully accessible with keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tabs',
    },
    defaultValue: {
      control: 'text',
      description: 'Default active tab',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default tabs with horizontal orientation.
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Account</h3>
          <p>Manage your account settings and preferences.</p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Password</h3>
          <p>Change your password and security settings.</p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p>Configure your application settings.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Tabs with vertical orientation.
 */
export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical" className="w-[500px]">
      <TabsList className="flex-col h-auto w-[200px]">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="flex-1">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Account</h3>
          <p>Manage your account settings and preferences.</p>
        </div>
      </TabsContent>
      <TabsContent value="password" className="flex-1">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Password</h3>
          <p>Change your password and security settings.</p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="flex-1">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p>Configure your application settings.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Tabs with icons.
 */
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="inbox" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="inbox">
          <MailIcon className="size-4" />
          Inbox
        </TabsTrigger>
        <TabsTrigger value="profile">
          <UserIcon className="size-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon className="size-4" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Inbox</h3>
          <p>Your messages and notifications.</p>
        </div>
      </TabsContent>
      <TabsContent value="profile">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p>View and edit your profile information.</p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p>Configure your preferences.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Tabs with icon-only triggers.
 */
export const IconOnly: Story = {
  render: () => (
    <Tabs defaultValue="inbox" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="inbox">
          <MailIcon className="size-4" />
        </TabsTrigger>
        <TabsTrigger value="profile">
          <UserIcon className="size-4" />
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon className="size-4" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Inbox</h3>
          <p>Your messages and notifications.</p>
        </div>
      </TabsContent>
      <TabsContent value="profile">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p>View and edit your profile information.</p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p>Configure your preferences.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Disabled tab states.
 */
export const DisabledStates: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Tab 2 (Disabled)
        </TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4">Content for Tab 1</div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4">Content for Tab 2</div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-4">Content for Tab 3</div>
      </TabsContent>
    </Tabs>
  ),
};


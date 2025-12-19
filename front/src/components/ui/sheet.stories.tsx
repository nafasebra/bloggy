import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A sheet component (side panel) for displaying content from the side of the screen. Built on Radix UI Dialog with full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default sheet from the right side.
 */
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet from the left side.
 */
export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse through the menu items.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <nav className="space-y-2">
            <a href="#" className="block py-2 hover:underline">
              Home
            </a>
            <a href="#" className="block py-2 hover:underline">
              About
            </a>
            <a href="#" className="block py-2 hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet from the top.
 */
export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Top Sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>You have 3 new notifications.</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-2">
          <div className="p-2 border rounded">New message from John</div>
          <div className="p-2 border rounded">Your post was liked</div>
          <div className="p-2 border rounded">New follower: Jane</div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet from the bottom.
 */
export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>Choose an action to perform.</SheetDescription>
        </SheetHeader>
        <div className="py-4 grid grid-cols-2 gap-2">
          <Button variant="outline">Action 1</Button>
          <Button variant="outline">Action 2</Button>
          <Button variant="outline">Action 3</Button>
          <Button variant="outline">Action 4</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet with form.
 */
export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create New</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Post</SheetTitle>
          <SheetDescription>
            Fill in the details to create a new post.
          </SheetDescription>
        </SheetHeader>
        <form className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter post title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
              placeholder="Enter post content"
            />
          </div>
          <SheetFooter>
            <Button type="submit">Create Post</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  ),
};


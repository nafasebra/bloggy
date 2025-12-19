import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from './button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A card component for displaying content in a contained format. Supports hover effects and clickable states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    hover: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
    clickable: {
      control: 'boolean',
      description: 'Make card clickable',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card with header, content, and footer.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area. This is where the main content goes.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with hover effects.
 */
export const HoverEffects: Story = {
  render: () => (
    <Card className="w-[350px]" hover>
      <CardHeader>
        <CardTitle>Hover Card</CardTitle>
        <CardDescription>Hover over this card to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects enabled.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Clickable card.
 */
export const Clickable: Story = {
  render: () => (
    <Card
      className="w-[350px]"
      clickable
      onClick={() => alert('Card clicked!')}
    >
      <CardHeader>
        <CardTitle>Clickable Card</CardTitle>
        <CardDescription>Click anywhere on this card</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card is clickable and has focus styles.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with all sub-components.
 */
export const AllComponents: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Complete Card</CardTitle>
        <CardDescription>
          This card demonstrates all available sub-components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This is the main content area. You can put any content here.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Feature one</li>
          <li>Feature two</li>
          <li>Feature three</li>
        </ul>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Simple card without header or footer.
 */
export const Simple: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="p-6">
        <p>Simple card with just content.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Multiple cards example.
 */
export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <Card hover>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 1</p>
        </CardContent>
      </Card>
      <Card hover>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 2</p>
        </CardContent>
      </Card>
      <Card hover>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 3</p>
        </CardContent>
      </Card>
    </div>
  ),
};


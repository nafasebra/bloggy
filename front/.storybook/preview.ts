import type { Preview } from '@storybook/nextjs-vite'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    themes: {
      default: 'dark',
      list: [
        { name: 'light', class: '', color: '#ffffff' },
        { name: 'dark', class: 'dark', color: '#1f2937' },
      ],
    },

    docs: {
      theme: {
        base: 'light',
        brandTitle: 'Bloggy Storybook',
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
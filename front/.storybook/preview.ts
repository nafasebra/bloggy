import type { Preview } from '@storybook/nextjs-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import * as React from 'react';
import '../src/app/globals.css';

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
      test: 'todo',
    },

    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },

    docs: {
      theme: {
        base: 'light',
        brandTitle: 'Bloggy Storybook',
      },
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    // Wrapper decorator for styling context
    (Story) =>
      React.createElement(
        'div',
        {
          style: {
            fontFamily:
              'var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)',
          },
        },
        React.createElement(Story)
      ),
  ],

  tags: ['autodocs'],
};

export default preview;

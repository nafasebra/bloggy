import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const configDir = dirname(fileURLToPath(import.meta.url));
const frontendDir = join(configDir, '../../..');

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../apps/web/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../apps/dashboard/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        dedupe: ['react', 'react-dom'],
      },
      server: {
        fs: {
          allow: [frontendDir],
        },
      },
    });
  },
};

export default config;

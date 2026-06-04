import type { Decorator } from '@storybook/react';
import { addons } from 'storybook/preview-api';
import { ThemeToggle } from '@repo/ui/theme-toggle';

/** Canvas theme toggle — uses channel API (no preview hooks in child components). */
export const withThemeToggle: Decorator = (Story, context) => {
  const theme =
    (context.globals?.theme as 'light' | 'dark' | undefined) ?? 'light';

  return (
    <>
      <div className="fixed top-4 right-4 z-[9999]">
        <ThemeToggle
          theme={theme}
          onToggle={() => {
            const next = theme === 'light' ? 'dark' : 'light';
            addons.getChannel().emit('updateGlobals', {
              globals: { theme: next },
            });
          }}
        />
      </div>
      <Story />
    </>
  );
};

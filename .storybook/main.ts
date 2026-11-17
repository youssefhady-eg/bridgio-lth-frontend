import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

/**
 * Storybook is the component source of truth (C36 LOCKED) and replaces the
 * gallery idea. Docs + a11y are enabled; interaction testing is built into
 * Storybook 10 core, so no separate addon-interactions package is installed.
 *
 * `viteConfigPath` points at `.storybook/vite.config.ts`, NOT the app's
 * `vite.config.ts`. The app config loads TanStack Start + Nitro, whose client
 * manifest plugin rejects Storybook's extra mock entry and fails the build.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  core: {
    disableTelemetry: true,
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: fileURLToPath(new URL('./vite.config.ts', import.meta.url)),
      },
    },
  },
}

export default config
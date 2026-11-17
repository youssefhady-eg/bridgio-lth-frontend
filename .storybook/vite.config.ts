import { fileURLToPath } from 'node:url'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Storybook gets its own Vite config on purpose.
 *
 * The app's `vite.config.ts` loads the TanStack Start and Nitro plugins, which
 * run server-side manifest generation during a client build. Storybook is a
 * static component workshop, not a TanStack Start app, so those plugins must
 * not run here: they fail the build with "multiple entries detected"
 * (`assets/index-*.js` plus Storybook's `vite-inject-mocker-entry.js`).
 *
 * Keep this file free of app-only plugins. If a plugin becomes necessary for
 * *styling* or *assets* inside stories, add it here rather than in the app
 * config.
 */
export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
})
import type { Preview } from '@storybook/react'
import { useEffect, type ReactNode } from 'react'
import '../src/styles/fonts.css'
import '../src/styles/tokens.css'
import '../src/styles/app.css'
import '../src/styles/polish.css'
import '../src/styles/finish.css'
import '../src/styles/ds.css'
import '../src/styles/academy.css'

type StoryTheme = 'light' | 'dark'
type StoryDirection = 'ltr' | 'rtl'

function StoryShell({
  theme,
  direction,
  children,
}: {
  theme: StoryTheme
  direction: StoryDirection
  children: ReactNode
}) {
  useEffect(() => {
    const root = document.documentElement
    const previousTheme = root.dataset.theme
    const previousDir = root.dir
    const previousLang = root.lang

    if (theme === 'dark') root.dataset.theme = 'dark'
    else delete root.dataset.theme
    root.dir = direction
    root.lang = direction === 'rtl' ? 'ar' : 'en'

    return () => {
      if (previousTheme) root.dataset.theme = previousTheme
      else delete root.dataset.theme
      root.dir = previousDir
      root.lang = previousLang
    }
  }, [theme, direction])

  return (
    <div
      className="ds-story"
      dir={direction}
      style={{
        minHeight: '100vh',
        padding: '24px',
        background: 'var(--bridgio-cream)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-stack-reading)',
      }}
    >
      {children}
    </div>
  )
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
    viewport: {
      viewports: {
        desktop1920: {
          name: 'Desktop 1920',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
        phone390: {
          name: 'Phone 390',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
    backgrounds: {
      options: {
        cream: { name: 'Cream', value: '#f9ecd9' },
        paper: { name: 'Paper', value: '#fff6e8' },
        maroon: { name: 'Maroon', value: '#2c0706' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'cream' },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / dark token set',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
    direction: {
      name: 'Direction',
      description: 'LTR / RTL',
      defaultValue: 'ltr',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as StoryTheme) ?? 'light'
      const direction = (context.globals.direction as StoryDirection) ?? 'ltr'
      return (
        <StoryShell theme={theme} direction={direction}>
          <Story />
        </StoryShell>
      )
    },
  ],
}

export default preview
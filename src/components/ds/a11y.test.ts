import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  Avatar,
  Block,
  BlockGrid,
  BreadcrumbsNav,
  Button,
  DsTabs,
  Logo,
  ScoreCard,
  SelectField,
  SkeletonScreen,
  TextField,
} from './index'

/**
 * Accessibility-tree snapshots (Part C gate).
 *
 * These are server-rendered and asserted on the semantic tree that reaches a
 * screen reader — role, accessible name, state, relationship — not on pixels.
 * Anything whose only accessible affordance is colour would fail here.
 */

function html(element: Parameters<typeof renderToStaticMarkup>[0]): string {
  return renderToStaticMarkup(element)
}

describe('design-system accessibility tree', () => {
  it('exposes a named button and its disabled state', () => {
    const primary = html(createElement(Button, null, 'Publish cohort'))
    expect(primary).toContain('type="button"')
    expect(primary).toContain('Publish cohort')

    const disabled = html(
      createElement(Button, { isDisabled: true }, 'Publish cohort'),
    )
    expect(disabled).toMatch(/disabled=""/)
  })

  it('associates a text field label, description and error region', () => {
    const markup = html(
      createElement(TextField, {
        label: 'Learner name',
        description: 'As it appears on the roster.',
        isInvalid: true,
      }),
    )

    expect(markup).toContain('<label')
    expect(markup).toContain('Learner name')
    expect(markup).toContain('As it appears on the roster.')
    // React Aria wires the input to the label and description by id.
    expect(markup).toMatch(/id="[^"]+"[^>]*>Learner name/)
    expect(markup).toMatch(/aria-describedby="[^"]+"/)
  })

  it('names the select trigger and its options', () => {
    const markup = html(
      createElement(SelectField, {
        label: 'Language',
        options: [
          { id: 'de', label: 'German' },
          { id: 'nl', label: 'Dutch' },
        ],
      }),
    )

    expect(markup).toContain('Language')
    expect(markup).toMatch(/aria-haspopup="listbox"/)
  })

  it('marks the current breadcrumb and excludes it from the link list', () => {
    const markup = html(
      createElement(BreadcrumbsNav, {
        items: [
          { id: 'cohorts', label: 'Cohorts', href: '/academy/cohorts' },
          { id: 'roster', label: 'Roster' },
        ],
      }),
    )

    expect(markup).toContain('<nav')
    expect(markup).toContain('aria-label="Breadcrumb"')
    expect(markup).toContain('aria-current="page"')
    expect(markup.match(/<a /g) ?? []).toHaveLength(1)
  })

  it('renders tabs as a tablist with one selected tab', () => {
    const markup = html(
      createElement(DsTabs, {
        label: 'Cohort sections',
        tabs: [
          { id: 'overview', label: 'Overview', content: 'Overview content.' },
          { id: 'roster', label: 'Roster', content: 'Roster content.' },
        ],
      }),
    )

    expect(markup).toContain('role="tablist"')
    expect(markup).toContain('aria-label="Cohort sections"')
    expect(markup.match(/role="tab"/g) ?? []).toHaveLength(2)
    expect(markup).toContain('aria-selected="true"')
    expect(markup).toContain('role="tabpanel"')
  })

  it('gives a standalone avatar an accessible name but hides initials', () => {
    const labelled = html(
      createElement(Avatar, { name: 'Karim Hassan', labelled: true }),
    )
    expect(labelled).toContain('role="img"')
    expect(labelled).toContain('aria-label="Karim Hassan"')
    expect(labelled).toContain('aria-hidden="true"')

    const decorative = html(createElement(Avatar, { name: 'Karim Hassan' }))
    expect(decorative).not.toContain('role="img"')
  })

  it('announces a skeleton screen once, not per block', () => {
    const markup = html(createElement(SkeletonScreen))
    expect(markup).toContain('role="status"')
    expect(markup).toContain('visually-hidden')
    expect(markup).toContain('Loading')
    expect(markup.match(/aria-hidden="true"/g)?.length).toBeGreaterThan(4)
  })

  it('states a score in text and exposes its appeal path', () => {
    const markup = html(
      createElement(ScoreCard, {
        dimension: 'Pronunciation',
        value: 82,
        band: 'Strong',
        explanation: 'Clear consonants; the /r/ drifts in fast speech.',
        appeal: createElement(Button, { variant: 'textlink' }, 'Appeal'),
      }),
    )

    expect(markup).toContain('Pronunciation')
    expect(markup).toContain('82%')
    expect(markup).toContain('aria-label="Pronunciation: 82 percent"')
    expect(markup).toContain('Appeal')
  })

  it('does not expose a missing score as a number', () => {
    const markup = html(
      createElement(ScoreCard, {
        dimension: 'Empathy',
        value: null,
        explanation: 'This rubric version does not assess empathy.',
      }),
    )

    expect(markup).toContain('Not assessed')
    expect(markup).not.toContain('aria-label="Empathy:')
  })

  it('keeps the decorative logo out of the accessibility tree', () => {
    const markup = html(createElement(Logo, { decorative: true }))
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain('alt=""')
  })

  it('lays out blocks with an explicit span, not a visual guess', () => {
    const markup = html(
      createElement(
        BlockGrid,
        null,
        createElement(Block, { span: 4, children: 'A' }),
        createElement(Block, { span: 8, children: 'B' }),
      ),
    )
    expect(markup).toContain('ds-block--4')
    expect(markup).toContain('ds-block--8')
  })
})
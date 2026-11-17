import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, Check, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { stringsFor } from '../../shell/useStrings'
import {
  Avatar,
  Block,
  BlockGrid,
  BreadcrumbsNav,
  Button,
  Dialog,
  Drawer,
  DsTabs,
  Icon,
  Logo,
  ScoreCard,
  SelectField,
  SkeletonScreen,
  SkeletonStats,
  SkeletonTable,
  TextAreaField,
  TextField,
  ToastProvider,
  useToast,
} from './index'

const meta = {
  title: 'Design System/Overview',
  parameters: {
    docs: {
      description: {
        component:
          'BRIDGIO design-system components (Batch 0, brief §12.1). Built on React Aria Components, from tokens.css. Use the Theme and Direction toolbars to check light / dark and LTR / RTL.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {children}
    </div>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section style={{ display: 'grid', gap: '16px' }}>
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-stack-display)',
          fontSize: 'var(--font-display-size-h3)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export const Buttons: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '32px' }}>
      <Panel title="Variants">
        <Row>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="focus">Focus</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="textlink">Text link</Button>
          <Button variant="danger">
            <Icon icon={Trash2} size={16} />
            Danger
          </Button>
        </Row>
      </Panel>
      <Panel title="Sizes and states">
        <Row>
          <Button size="sm">Small</Button>
          <Button>
            <Icon icon={Plus} size={16} />
            With icon
          </Button>
          <Button isDisabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="secondary" isDisabled>
            Disabled secondary
          </Button>
        </Row>
      </Panel>
      <Panel title="Pressed state">
        <Row>
          <Button>Press and hold</Button>
          <Button variant="secondary">Press and hold</Button>
        </Row>
      </Panel>
    </div>
  ),
}

export const Fields: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px', maxWidth: '480px' }}>
      <TextField
        label="Learner name"
        placeholder="Full name"
        description="As it appears on the roster."
      />
      <TextField
        label="Email"
        placeholder="name@example.com"
        isInvalid
        defaultValue="not-an-email"
      />
      <TextField label="Disabled field" isDisabled defaultValue="Read only" />
      <TextAreaField
        label="Lesson note"
        placeholder="What should the learner practise?"
      />
      <SelectField
        label="Language"
        placeholder="Choose a language"
        options={[
          { id: 'de', label: 'German' },
          { id: 'nl', label: 'Dutch' },
          { id: 'it', label: 'Italian' },
        ]}
      />
    </div>
  ),
}

function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        isOpen={open}
        onOpenChange={setOpen}
        title="Publish cohort"
        footer={
          <>
            <Button variant="secondary" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onPress={() => setOpen(false)}>Publish</Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Publishing opens the cohort for enrolment. Seat counts and the
          schedule are re-checked before the cohort goes live.
        </p>
      </Dialog>
    </>
  )
}

function DrawerDemo({ placement }: { placement: 'start' | 'end' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onPress={() => setOpen(true)}>
        Open {placement} drawer
      </Button>
      <Drawer
        isOpen={open}
        onOpenChange={setOpen}
        placement={placement}
        title="Cohort filters"
      >
        <TextField label="Search" placeholder="Cohort or language" />
      </Drawer>
    </>
  )
}

export const Dialogs: Story = {
  render: () => (
    <Row>
      <DialogDemo />
      <DrawerDemo placement="start" />
      <DrawerDemo placement="end" />
    </Row>
  ),
}

/** Static open state, so the dialog surface itself can be reviewed. */
export const DialogOpen: Story = {
  render: () => (
    <Dialog
      isOpen
      onOpenChange={() => {}}
      title="Publish cohort"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button>Publish</Button>
        </>
      }
    >
      <p style={{ margin: 0 }}>
        Publishing opens the cohort for enrolment. Seat counts and the schedule
        are re-checked before the cohort goes live.
      </p>
    </Dialog>
  ),
}

/** Static open drawer (end placement), for the slide-over surface. */
export const DrawerOpen: Story = {
  render: () => (
    <Drawer
      isOpen
      onOpenChange={() => {}}
      placement="end"
      title="Cohort filters"
      footer={
        <>
          <Button variant="secondary">Reset</Button>
          <Button>Apply</Button>
        </>
      }
    >
      <TextField label="Search" placeholder="Cohort or language" />
    </Drawer>
  ),
}

function ToastDemo() {
  const { notify } = useToast()
  return (
    <Row>
      <Button
        variant="secondary"
        onPress={() =>
          notify({ title: 'Attendance saved', tone: 'success' })
        }
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          notify({
            title: 'Publishing blocked',
            description: 'Add one lesson before publishing.',
            tone: 'error',
          })
        }
      >
        Error toast
      </Button>
    </Row>
  )
}

export const Toasts: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
}

function ToastShowcase() {
  const { notify } = useToast()
  useEffect(() => {
    notify({ title: 'Attendance saved', tone: 'success' })
    notify({
      title: 'Publishing blocked',
      description: 'Add one lesson before publishing.',
      tone: 'error',
    })
    notify({
      title: 'Cohort archived',
      description: 'The roster is now read-only.',
      tone: 'info',
    })
  }, [notify])
  return <p style={{ margin: 0 }}>Three toast tones stacked in the region.</p>
}

/** Static toast region, so all three tones can be reviewed at once. */
export const ToastsOpen: Story = {
  render: () => (
    <ToastProvider>
      <ToastShowcase />
    </ToastProvider>
  ),
}

export const Avatars: Story = {
  render: () => (
    <Row>
      <Avatar name="Karim Hassan" size="sm" labelled />
      <Avatar name="Karim Hassan" size="md" labelled />
      <Avatar name="Karim Hassan" size="lg" labelled />
      <Avatar name="Layla Mostafa" tone="maroon" labelled />
    </Row>
  ),
}

export const Breadcrumbs: Story = {
  render: () => (
    <BreadcrumbsNav
      items={[
        { id: 'cohorts', label: 'Cohorts', href: '/academy/cohorts' },
        { id: 'cohort', label: 'German A2 — Evening', href: '/academy/cohorts/1' },
        { id: 'roster', label: 'Roster' },
      ]}
    />
  ),
}

export const Tabs: Story = {
  render: () => (
    <DsTabs
      label="Cohort sections"
      tabs={[
        { id: 'overview', label: 'Overview', content: <p>Overview content.</p> },
        { id: 'roster', label: 'Roster', content: <p>Roster content.</p> },
        { id: 'sessions', label: 'Sessions', content: <p>Sessions content.</p> },
      ]}
    />
  ),
}

export const Logos: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ padding: '24px', background: 'var(--bridgio-cream)' }}>
        <Logo surface="light" />
      </div>
      <div style={{ padding: '24px', background: 'var(--bridgio-maroon)' }}>
        <Logo surface="dark" />
      </div>
    </div>
  ),
}

export const Grid: Story = {
  render: () => (
    <BlockGrid>
      {[4, 4, 4, 6, 6, 8, 4, 12].map((span, index) => (
        <Block key={index} span={span as 4 | 6 | 8 | 12}>
          <div
            style={{
              padding: '24px',
              border: '1.5px solid var(--border-strong)',
              borderRadius: '24px',
              background: 'var(--bridgio-paper)',
            }}
          >
            span {span}
          </div>
        </Block>
      ))}
    </BlockGrid>
  ),
}

export const Skeletons: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '32px' }}>
      <SkeletonStats />
      <SkeletonTable />
      <SkeletonScreen />
    </div>
  ),
}

export const ScoreCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px', maxWidth: '520px' }}>
      <ScoreCard
        dimension="Pronunciation"
        value={82}
        band="Strong"
        explanation="Clear consonant clusters; the /r/ sound drifts toward the Arabic tap in fast speech."
        appeal={<Button variant="textlink">Appeal this score</Button>}
      />
      <ScoreCard
        dimension="Empathy"
        value={null}
        explanation="This rubric version does not assess empathy, so no score is shown."
      />
    </div>
  ),
}

export const TypographyAR: Story = {
  render: () => {
    // Arabic copy is read from the central strings file — never retyped here.
    const ar = stringsFor('ar')
    const joiners = '\u200C\u200D\u200E\u200F'
    return (
      <div dir="rtl" lang="ar" style={{ display: 'grid', gap: '24px' }}>
        <Panel title="Typography AR — C13 / C41">
          <p style={{ margin: 0, fontFamily: 'var(--font-stack-display)', fontSize: 'var(--font-display-size-hero)', fontWeight: 900 }}>
            {ar.head.title}
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--font-stack-display)', fontSize: 'var(--font-display-size-h1)', fontWeight: 700 }}>
            {ar.dashboard.title}
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--font-stack-reading)', fontSize: 'var(--font-body-size)' }}>
            {ar.rubric.lead} {joiners}
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--font-stack-ui)', fontSize: 'var(--font-label-size)', fontWeight: 600 }}>
            {ar.sidebar.helpLabel} — {ar.sidebar.guideLabel}
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--font-stack-ui)', fontSize: 'var(--font-caption-size)' }}>
            {ar.common.loading}
          </p>
        </Panel>
        <Panel title="Latin fallback">
          <p style={{ margin: 0, fontFamily: 'var(--font-stack-display)', fontSize: 'var(--font-display-size-h2)', fontWeight: 700 }}>
            Your bridge to what&apos;s next
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--font-stack-reading)' }}>
            Nunito carries Latin reading; Sora carries Latin display.
          </p>
        </Panel>
      </div>
    )
  },
}

export const Icons: Story = {
  render: () => (
    <Row>
      <Icon icon={Bell} />
      <Icon icon={Check} />
      <Icon icon={Pencil} />
      <Icon icon={Plus} />
      <Icon icon={Trash2} />
    </Row>
  ),
}
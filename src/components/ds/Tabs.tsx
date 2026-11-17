import type { ReactNode } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components'

/**
 * Tabs on React Aria Components. Arrow keys move between tabs; the selected
 * tab is announced with `aria-selected`. Each panel is labelled by its tab.
 */

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

export function DsTabs({
  tabs,
  label,
  defaultSelectedKey,
}: {
  tabs: TabItem[]
  label: string
  defaultSelectedKey?: string
}) {
  return (
    <Tabs className="ds-tabs" defaultSelectedKey={defaultSelectedKey}>
      <TabList className="ds-tabs__list" aria-label={label}>
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} className="ds-tabs__tab">
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} className="ds-tabs__panel">
          {tab.content}
        </TabPanel>
      ))}
    </Tabs>
  )
}
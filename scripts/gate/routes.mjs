/**
 * The LTH surfaces the gate audits. Every route is an academy surface that
 * Batch 0 touched or that hosts the shared shell (sidebar, header, grid).
 */
export const ROUTES = [
  { path: '/academy', name: 'dashboard' },
  { path: '/academy/cohorts', name: 'cohorts' },
  { path: '/academy/cohorts/coh_de_a2_evening', name: 'roster' },
  { path: '/academy/curriculum', name: 'curriculum-list' },
  { path: '/academy/curriculum/cur_de_a2_workplace', name: 'curriculum-builder' },
  { path: '/academy/rubrics', name: 'rubric-list' },
  { path: '/academy/rubrics/rub_de_a2_workplace', name: 'rubric' },
  { path: '/academy/earnings', name: 'earnings' },
  { path: '/academy/onboarding', name: 'onboarding' },
]

export const VARIANTS = [
  { lang: 'en', theme: 'light' },
  { lang: 'en', theme: 'dark' },
  { lang: 'ar', theme: 'light' },
  { lang: 'ar', theme: 'dark' },
]
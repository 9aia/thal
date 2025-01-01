import type { MenuItem } from '~~/layers/ui/components/navigation/types'
import { drawers } from '~/store'

const general: MenuItem[] = [
  {
    id: 'account',
    icon: 'person',
    name: 'Account',
    onClick: () => drawers.account = true,
  },
  {
    id: 'plan',
    name: 'Subscription',
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'subscriptions',
    type: 'external',
  },
  {
    id: 'my-personas',
    icon: 'manage_accounts',
    name: 'My Characters',
    onClick: () => drawers.myPersonas = true,
  },
]

const support: MenuItem[] = [
  /* {
    id: "how_Thal_works",
    name: "How Thal works",
    href: "/how-thal-works",
  }, */
  {
    id: 'feedback',
    icon: 'feedback',
    name: 'Give us feedback',
    type: 'external',
    href: 'https://forms.gle/5ePvXjrebyWGUrM26',
    newTab: true,
    localize: false,
  },
  {
    id: 'bug_report',
    icon: 'bug_report',
    name: 'Report an issue',
    type: 'external',
    href: 'https://forms.gle/ANMv7qnwTHva1k7L8',
    newTab: true,
    localize: false,
  },
]

const legal: MenuItem[] = [
  { id: 'terms', icon: 'gavel', name: 'Terms of Service', href: '/terms' },
  { id: 'privacy', icon: 'policy', name: 'Privacy policy', href: '/privacy' },
]

export const SETTINGS = {
  general,
  support,
  legal,
}

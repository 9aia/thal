import type { MenuItemType } from '~/components/ui/navigation/types'
import { drawers, isRootDrawerOpen } from '~/store'
import { useWhatsNewModal } from '~/composables/useWhatsNewModal'

const { focusMainField: focusSearch } = useDiscoverFocus()

const t = (x: string) => x

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')

  await nextTick()

  focusSearch()
}

const general: MenuItemType[] = [
  {
    id: 'account',
    icon: 'person',
    name: t('Account'),
    onClick: () => drawers.account = true,
  },
  {
    id: 'plan',
    name: t('Subscription'),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'subscriptions',
    type: 'external',
  },
  {
    id: 'my-characters',
    icon: 'manage_accounts',
    name: t('My characters'),
    onClick: () => drawers.myCharacters = true,
  },
  {
    id: 'discover-characters',
    icon: 'person_search',
    name: t('Discover characters'),
    onClick: () => goToDiscover(),
  },
]

const { open: openWhatsNewModal } = useWhatsNewModal()

const support: MenuItemType[] = [
  {
    id: 'whats-new',
    icon: 'news',
    name: 'What\'s New',
    onClick: () => openWhatsNewModal(),
    type: 'accordion',
  },
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
  // TODO
  // {
  //   id: 'about-thal',
  //   icon: 'info',
  //   name: 'About Thal',
  //   // onClick: () => openAboutThalModal(),
  //   type: 'accordion',
  // },
  // {
  //   id: 'help-center',
  //   icon: 'help_center',
  //   name: 'Help Center',
  //   href: '/help',
  //   type: 'external',
  // },
]

const legal: MenuItemType[] = [
  // { id: 'guidelines', icon: 'gavel', name: 'Guidelines'/* , href: '/guidelines' */ },
  // { id: 'reports', icon: 'flag', name: 'Reports'/* , href: '/reports' */ },
  { id: 'terms', icon: 'gavel', name: 'Terms of Service', href: '/terms', type: 'external', newTab: true },
  { id: 'privacy', icon: 'policy', name: 'Privacy Policy', href: '/privacy', type: 'external', newTab: true },
]

export const SETTINGS = {
  general,
  support,
  legal,
}

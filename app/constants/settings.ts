import type { MenuItemType } from '~/components/ui/navigation/types'
import { drawers, isRootDrawerOpen, openWhatsNewModal } from '~/store'

const t = (x: string) => x

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}

const general: MenuItemType[] = [
  {
    id: 'account',
    icon: 'material-symbols:person-outline',
    name: t('Account'),
    onClick: () => drawers.accountSettings = true,
  },
  {
    id: 'plan',
    name: t('Subscription'),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'material-symbols:subscriptions-outline',
    type: 'external',
  },
  {
    id: 'my-characters',
    icon: 'material-symbols:manage-accounts-outline',
    name: t('My characters'),
    onClick: () => drawers.myCharacters = true,
  },
  {
    id: 'discover-characters',
    icon: 'material-symbols:person-search-outline',
    name: t('Discover characters'),
    onClick: () => goToDiscover(),
  },
]

const support: MenuItemType[] = [
  {
    id: 'whats-new',
    icon: 'material-symbols:news-outline',
    name: 'What\'s New',
    onClick: () => openWhatsNewModal(),
    type: 'accordion',
  },
  {
    id: 'feedback',
    icon: 'material-symbols:feedback-outline',
    name: 'Give us feedback',
    type: 'external',
    href: 'https://forms.gle/5ePvXjrebyWGUrM26',
    newTab: true,
    localize: false,
  },
  {
    id: 'bug_report',
    icon: 'material-symbols:bug-report-outline',
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
  { id: 'terms', icon: 'material-symbols:gavel', name: 'Terms of Service', href: '/terms', type: 'external', newTab: true },
  { id: 'privacy', icon: 'material-symbols:policy-outline', name: 'Privacy Policy', href: '/privacy', type: 'external', newTab: true },
]

export const SETTINGS = {
  general,
  support,
  legal,
}

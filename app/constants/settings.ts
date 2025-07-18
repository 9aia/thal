import type { MenuItemType } from '~/components/ui/navigation/types'
// import { dummyT as t } from '@psitta/vue'

const t = (x: string) => x

const general: MenuItemType[] = [
  {
    id: 'account',
    icon: 'material-symbols:person-outline-rounded',
    name: t('Manage account'),
    onClick: () => navigateTo('/app/settings/account'),
  },
  {
    id: 'plan',
    name: t('Manage subscription'),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'material-symbols:subscriptions-outline-rounded',
    type: 'external',
  },
  {
    id: 'my-characters',
    icon: 'material-symbols:manage-accounts-outline-rounded',
    name: t('My characters'),
    onClick: () => navigateTo('/app/settings/my-characters'),
  },
]

const legal: MenuItemType[] = [
  // TODO: add Guidelines and Reports
  // { id: 'guidelines', icon: 'gavel', name: t('Guidelines')/* , href: '/guidelines' */ },
  // { id: 'reports', icon: 'flag', name: t('Reports')/* , href: '/reports' */ },

  { id: 'terms', icon: 'material-symbols:gavel-rounded', name: t('Terms of Service'), href: '/legal/terms', type: 'external', newTab: true },
  { id: 'privacy', icon: 'material-symbols:policy-outline-rounded', name: t('Privacy Policy'), href: '/legal/privacy', type: 'external', newTab: true },
  { id: 'security', icon: 'material-symbols:security-rounded', name: t('Security Policy'), href: '/legal/security', type: 'external', newTab: true },
]

export const SETTINGS = {
  general,
  legal,
}

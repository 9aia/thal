import type { MenuItemType } from '~/components/ui/navigation/types'
import { isWhatsNewModalOpen } from '~/store'
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

const support: MenuItemType[] = [
  {
    id: 'whats-new',
    icon: 'material-symbols:campaign-outline-rounded',
    name: t('What\'s New'),
    onClick: () => isWhatsNewModalOpen.value = true,
    type: 'accordion',
  },
  {
    id: 'rate-thal',
    icon: 'material-symbols:star-outline-rounded',
    name: t('Rate Thal'),
    type: 'external',
    href: 'https://forms.gle/yHaiExzsQvv1mTdM8',
    newTab: true,
    localize: false,
  },
  {
    id: 'submit-problem-or-suggestion',
    icon: 'material-symbols:feedback-outline-rounded',
    name: t('Send feedback'),
    description: t('Report a problem or send us suggestions'),
    type: 'external',
    href: 'https://forms.gle/UyGBzPrBeNfFgwLD6',
    newTab: true,
    localize: false,
  },
  // TODO: add About Thal and Help Center
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
  // TODO: add Guidelines and Reports
  // { id: 'guidelines', icon: 'gavel', name: t('Guidelines')/* , href: '/guidelines' */ },
  // { id: 'reports', icon: 'flag', name: t('Reports')/* , href: '/reports' */ },

  { id: 'terms', icon: 'material-symbols:gavel-rounded', name: t('Terms of Service'), href: '/terms', type: 'external', newTab: true },
  { id: 'privacy', icon: 'material-symbols:policy-outline-rounded', name: t('Privacy Policy'), href: '/privacy', type: 'external', newTab: true },
]

export const SETTINGS = {
  general,
  support,
  legal,
}

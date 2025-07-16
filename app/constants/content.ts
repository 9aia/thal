// import { dummyT as t } from '@psitta/vue'

export const t = (x: string) => x

export const ARTICLE_TYPES = [
  { id: 'public-release', name: t('Public Release'), icon: 'material-symbols:star-outline-rounded' },
  { id: 'early-access-release', name: t('Early Access Release'), icon: 'material-symbols:star-outline-rounded' },
  { id: 'announcement', name: t('Announcement'), icon: 'material-symbols:campaign-outline-rounded' },
]

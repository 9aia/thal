// import { dummyT as t } from '@psitta/vue'

export const t = (x: string) => x

export interface ArticleType {
  id: string
  name: string
  color: 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success' | 'neutral'
  icon: string
}

export const ARTICLE_TYPES: ArticleType[] = [
  { id: 'release', name: t('Release'), color: 'primary', icon: 'material-symbols:release-alert-outline-rounded' },
  { id: 'announcement', name: t('Announcement'), color: 'warning', icon: 'material-symbols:campaign-outline-rounded' },
]

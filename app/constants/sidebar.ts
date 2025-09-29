import type { AsyncComponentOptions } from 'vue'
import { hydrateOnVisible } from 'vue'
import CommonSidebarError from '~/components/app/common/CommonSidebarError.vue'
import type { SidebarState } from '~~/shared/types'

const config: Partial<AsyncComponentOptions> = {
  hydrate: hydrateOnVisible(),
  delay: 0,
  errorComponent: CommonSidebarError,
}

const Chats = defineAsyncComponent({
  loader: () => import(`~/components/app/sidebar/ChatsView.vue`),
  ...config,
})
const BuildCharacter = defineAsyncComponent({
  loader: () => import(`~/components/app/sidebar/BuildCharacterView.vue`),
  ...config,
})
const ManageContact = defineAsyncComponent({
  loader: () => import(`~/components/app/sidebar/ManageContactView.vue`),
  ...config,
})
const NewChat = defineAsyncComponent({
  loader: () => import(`~/components/app/sidebar/NewChatView.vue`),
  ...config,
})

export const LEFT_SIDEBAR_COMPONENTS = {
  'chats': Chats,
  'build-character': BuildCharacter,
  'manage-contact': ManageContact,
  'new-chat': NewChat,
} as const

export type LeftSidebarView = keyof typeof LEFT_SIDEBAR_COMPONENTS

export const LEFT_SIDEBAR_ROOT_STATE: SidebarState<LeftSidebarView> = {
  view: 'chats',
}

export const LEFT_SIDEBAR_PROVIDE_KEY = 'LEFT_SIDEBAR' as const

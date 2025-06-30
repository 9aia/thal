import type { AsyncComponentOptions } from 'vue'
import { hydrateOnVisible } from 'vue'

const config: Partial<AsyncComponentOptions> = {
  hydrate: hydrateOnVisible(),
  delay: 0,
  // errorComponent // TODO: Add error component
}

const Chats = defineAsyncComponent({
  loader: () => import(`~/components/app/sidebar/chats.vue`),
  ...config,
})
const BuildCharacter = defineAsyncComponent({
  loader: () => import(`~/components/app/sidebar/build-character.vue`),
  ...config,
})
const ManageContact = defineAsyncComponent({
  loader: () => import(`~/components/app/sidebar/manage-contact.vue`),
  ...config,
})
const NewChat = defineAsyncComponent({
  loader: () => new Promise<any>((resolve) => {
    setTimeout(async () => {
      resolve(await import(`~/components/app/sidebar/new-chat.vue`))
    }, 1000)
  }),
  ...config,
})

export const SIDEBAR_COMPONENTS = {
  'chats': Chats,
  'build-character': BuildCharacter,
  'manage-contact': ManageContact,
  'new-chat': NewChat,
} as const

export type SidebarView = keyof typeof SIDEBAR_COMPONENTS

export const SIDEBAR_DEFAULT_VIEW: SidebarView = 'chats'

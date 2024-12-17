<script setup lang="ts">
import { useI18n, useLocale } from "@psitta/vue"
import { categories } from "~/constants/discover"
import { isRootDrawerOpen } from "~/store"

const props = defineProps<{
  name: string
  description: string
  username?: string
  categoryId?: number
  avatar?: string
  showCopy?: boolean
  showSendMessage?: boolean
}>()

const { t } = useI18n()
const toast = useToast()

function sendMessage() {
  isRootDrawerOpen.value = false

  navigateTo(`/app/chat/${props.username}`)
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.username!)

    toast.success(t("Username copied to clipboard"))
  }
  catch (error) {
    toast.error(t("Failed to copy username to clipboard"))
  }
}

function onClick() {
  if (props.showSendMessage && props.username)
    sendMessage()
}

useLocale()

const category = computed(() => {
  return categories.find(category => category.id === props.categoryId)
})
</script>

<template>
  <div
    tabindex="0"
    role="button"
    class="py-1 flex gap-2 rounded items-center group"
    @click.prevent="onClick"
  >
    <Avatar :name="name" class="w-10 text-sm" type="button" />

    <div class="flex-1 flex flex-col justify-center">
      <div class="flex justify-between">
        <div class="flex flex-col">
          <div class="flex gap-2 items-center text-base text-slate-900 font-bold">
            {{ name }}

            <div class="text-slate-600 flex gap-1 font-normal">
              @{{ username }}

              <button
                v-if="showCopy && username"
                size="sm"
                class="text-teal-500 hover:text-teal-600 flex items-center"
                @click.stop.prevent="copy"
              >
                <Icon name="content_copy" style="font-size: 1.15rem" />
              </button>
            </div>
          </div>

          <div v-if="username" class="text-sm text-slate-600 flex gap-1 items-center">
            <Badge class="bg-transparent border-none flex gap-1 px-0 py-3 text-xs text-slate-500">
              <Icon :name="category?.icon" class="" style="font-size: 1.15rem" />

              {{ category?.name }}
            </Badge>
          </div>

          <div
            class="text-xs text-slate-600 line-clamp-2 mt-1"
            :title="description"
          >
            {{ description }}
          </div>
        </div>

        <div class="flex gap-2 items-center">
          <button
            v-if="showSendMessage && username"
            class="text-teal-500 hover:text-teal-600"
          >
            <Icon name="chat" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

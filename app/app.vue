<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { LEFT_SIDEBAR_COMPONENTS, LEFT_SIDEBAR_PROVIDE_KEY, LEFT_SIDEBAR_ROOT_STATE } from './constants/sidebar'
import { isPastDueModalOpen, isWhatsNewModalOpen, openContactView } from '~/store'
import { usernameSchema } from '~~/db/schema'

useInternetConnectionIndicator()
useAppSeo()

const { state: localeModalState } = useLocaleModal()
const route = useRoute()
const toast = useToast()

// #region Navigation

const navigationDirection = useNavigationDirection()

watch(route, () => {
  navigationDirection.value = 'forward'
}, { immediate: true })

useEventListener(window, 'popstate', () => {
  navigationDirection.value = 'back'
})

// #endregion

// #region Drawers

function openContactViewByQuery() {
  const usernameQueryValue = route.query['contact-info']

  if (!usernameQueryValue) {
    return
  }

  const usernameValidation = usernameSchema.safeParse(usernameQueryValue)

  if (!usernameValidation.success) {
    toast.error('Failed to open contact view by username query. Invalid username. Usage: /?contact-info=username')
    return
  }

  const username = usernameValidation.data
  openContactView(username)
}

onMounted(() => {
  openContactViewByQuery()
})

// #endregion

const pageAnimation = computed(() => {
  if (route.meta.pageTransitionType === 'fade-up') {
    return 'fade-up'
  }

  if (route.meta.pageTransitionType === 'fade') {
    return 'fade'
  }

  if (route.meta.pageTransitionType === 'slide') {
    return navigationDirection.value === 'forward' ? 'slide-tl' : 'slide-tr'
  }

  return undefined
})

const userReactivatedCookie = useCookie('user_reactivated')
</script>

<template>
  <Sidebar
    :provide-key="LEFT_SIDEBAR_PROVIDE_KEY"
    :root-state="LEFT_SIDEBAR_ROOT_STATE"
    :component-keys="Object.keys(LEFT_SIDEBAR_COMPONENTS)"
  >
    <NuxtLoadingIndicator
      color="repeating-linear-gradient(to right, #00ffff 0%, #0000ff 100%)"
      error-color="repeating-linear-gradient(to right, #ff0000 0%, #ff6600 100%)"
    />

    <NuxtLayout>
      <div class="overflow-hidden">
        <NuxtPage :transition="{ name: pageAnimation }" />
      </div>
    </NuxtLayout>

    <LazyWhatsNewModal
      v-if="isWhatsNewModalOpen"
      v-model="isWhatsNewModalOpen"
    />

    <LazyLocaleModal
      v-if="localeModalState"
      v-model="localeModalState"
    />

    <LazyPastDuePlanModal
      v-if="isPastDueModalOpen"
      v-model="isPastDueModalOpen"
    />

    <LazyAccountReactivatedModal
      v-if="userReactivatedCookie"
      :model-value="userReactivatedCookie"
    />
  </Sidebar>
</template>

<style>
@reference '~/assets/css/main.css';

.slide-tr-leave-active, .slide-tl-enter-active, .slide-tr-enter-active, .slide-tl-leave-active {
  @apply transition-transform duration-200 ease-linear;
}

.slide-tl-enter-from { transform: translateX(100%); }
.slide-tl-enter-to { transform: translateX(0%); }
.slide-tl-leave-from { transform: translateX(0%); }
.slide-tl-leave-to { transform: translateX(-100%); }

.slide-tr-enter-from { transform: translateX(-100%); }
.slide-tr-enter-to { transform: translateX(0%); }
.slide-tr-leave-from { transform: translateX(0%); }
.slide-tr-leave-to { transform: translateX(100%); }

.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-enter-active, .fade-up-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

/* Define the fade transition classes */

/* State when element is entering, before it starts animating */
.fade-enter-from {
  opacity: 0;
}

/* State during the entering animation */
.fade-enter-active {
  transition: opacity 300ms ease-out; /* Smooth transition over 0.5 seconds */
}

/* State when element has finished entering (optional, often not needed for simple fades) */
.fade-enter-to {
  opacity: 1;
}

/* State when element is leaving, before it starts animating (optional, often not needed for simple fades) */
.fade-leave-from {
  opacity: 1;
}

/* State during the leaving animation */
.fade-leave-active {
  transition: opacity 300ms ease-in; /* Smooth transition over 0.5 seconds */
}

/* State when element is leaving, just before it is removed from the DOM */
.fade-leave-to {
  opacity: 0;
}
</style>

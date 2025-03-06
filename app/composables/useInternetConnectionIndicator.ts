import { useOnline } from '@vueuse/core'
import { watch } from 'vue'

export default function useInternetConnectionIndicator() {
  const { t } = useI18nExperimental()

  const isOnline = useOnline()
  const toast = useToast()

  watch(isOnline, (value) => {
    if (value) {
      toast.success(t('Internet is back'), undefined, {
        icon: 'wifi',
        position: 'center-top',
      })
    }
    else {
      toast.error(t('No internet'), 0, {
        position: 'center-top',
        icon: 'wifi_off',
      })
    }
  })
}

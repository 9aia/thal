<script setup lang="ts">
import { useOnline } from "@vueuse/core"
import { useI18n } from "@psitta/vue"
import { watch } from "vue"
import { useToast } from "~~/layers/ui/composables/useToast"

const { t } = useI18n()

const isOnline = useOnline()
const toast = useToast()

watch(isOnline, (value) => {
  if (value) {
    toast.success(t("Internet is back"), undefined, {
      icon: "wifi",
      position: "center-top",
    })
  }
  else {
    toast.error(t("No internet"), 0, {
      position: "center-top",
      icon: "wifi_off",
    })
  }
})
</script>

import type { Mask } from "maska"
import type { Ref } from "vue"
import { computed } from "vue"

function mask(data: Ref, mask: Mask) {
  return computed({
    get: () => mask.masked(data.value),
    set: value => (data.value = mask.unmasked(value)),
  })
}

export default mask

import type { FormatCallback, FormatOptions, InferPlaceholders, Key, Segment, Values } from '../types.d'
import { format } from './format'

function formatToSegments<T extends Key, V extends Values>(
  text: T,
  values: V = {} as V,
  options: FormatOptions,
) {
  type Placeholders = InferPlaceholders<typeof text>

  const cb: FormatCallback<Segment<Placeholders, V>[]> = (c) => {
    const segment: Segment<Placeholders, V> = {
      type: !c.dynamic ? 'text' : 'placeholder',
      part: c.part,
      key: c.key as keyof Placeholders,
      form: c.form,
      values,
    }

    return [...c.prev, segment]
  }

  return format(text, values, cb, [], options)
}

export default formatToSegments

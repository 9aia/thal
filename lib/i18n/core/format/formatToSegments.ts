import type { FormatCallback, FormatOptions, InferValues, Segment, Text, Values } from '../types.d'
import { format } from './format'

function formatToSegments(
  text: Text,
  values: Partial<Values> = {},
  options: FormatOptions,
) {
  type Placeholders = InferValues<typeof text>

  const cb: FormatCallback<Segment<Placeholders, Values>[]> = (c) => {
    const segment: Segment<Placeholders, Values> = {
      type: !c.dynamic ? 'text' : 'placeholder',
      part: c.part,
      key: c.key as keyof Placeholders,
      values,
      decline: c.decline,
    }

    return [...c.prev, segment]
  }

  return format(text, values, cb, [], options)
}

export default formatToSegments

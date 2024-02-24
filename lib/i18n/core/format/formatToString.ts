import type { FormatCallback, FormatFunction } from '../types.d'
import { format } from './format'

const formatToString: FormatFunction<string> = (
  text,
  values = {},
  options,
) => {
  const cb: FormatCallback<string> = (c) => {
    return c.prev + c.part
  }

  return format(text, values, cb, '', options)
}

export default formatToString

import type { RegisteredMessages, Values } from '../index'
import { collection } from './context'

function collect(key: keyof RegisteredMessages, values?: Values) {
  collection[key] = values || {}
}

export default collect

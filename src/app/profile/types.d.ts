import type { User } from './schemas/user'
import type { HOBBIES } from './utils'

export interface Item { id: keyof User, icon: string, label: string }
export type Interest = typeof HOBBIES[number]

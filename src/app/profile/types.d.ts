import type { Profile } from './schemas/profile'
import type { HOBBIES } from './utils'

export interface Item { id: keyof Profile, icon: string, label: string }
export type Interest = typeof HOBBIES[number]

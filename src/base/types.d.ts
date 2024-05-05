import type { UserSelect } from "./server/db/schema"
import type { HOBBIES } from "./utils"

export interface Item { id: keyof UserSelect, icon: string, label: string }
export type Interest = typeof HOBBIES[number]

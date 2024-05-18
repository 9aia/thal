import type { HOBBIES } from "./utils"
import type { UserSelect } from "~~/db/schema"

// #region Settings

export interface Item { id: keyof UserSelect, icon: string, label: string }
export type Interest = typeof HOBBIES[number]

// #endregion

// #region Payment

export interface PlanType {
  amount: number
  name: string
  lookupKey: string
}

// #endregion

// #region Learn

export interface Course {
  name: string
  sections: Section[]
}

export interface Section {
  id: "a1" | "a2" | "b1" | "b2" | "c1" | "c2"
  name: string
  description: string
  units: Unit[]
}

export interface Unit {
  id: string
  name: string
  nodes: Node[]
}

export interface Node {
  id?: string
  name: string
  type?: "concept" | "question" | "exercise" | "none" | "info" | "vocab"
  icon?: string
  description?: string
  position?: "start" | "end"
  active?: boolean
  optional?: boolean
  maxLevel?: number
  level?: number
}

// #endregion

// #region Exercise

export interface ExerciseQA {
  text: string
  question: string
  alternatives: string[]
}

export interface ExerciseFillInTheBlank {
  text: string
  correctLength: number
  alternatives: string[]
}

// #endregion

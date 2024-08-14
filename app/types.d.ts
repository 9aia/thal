import type { SectionName } from "./constants/course"
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
  slug: SectionName
  name: string
  description: string
  units: Unit[]
}

export interface Unit {
  slug: string
  name: string
  levels: Level[]
}

export interface Level {
  slug: string
  name: string
  type?: "concept" | "question" | "exercise" | "none" | "info" | "vocab"
  icon?: string
  description?: string
  align?: "start" | "end"
  active?: boolean
  completed?: boolean
  optional?: boolean
  maxLessonAmount?: number
  lessonAmount?: number
  maxExerciseAmount?: number
  exercisePosition?: number
}

// #endregion

// #region Exercise

export interface Exercise {
  type: string
  data: ExerciseQA | ExerciseFillInTheBlank
}

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

export interface ExerciseQAWithCorrect extends ExerciseQA {
  correct: number
}

// DTOs

export interface LessonGetDto {
  exercise: {
    id: number
    type: string
    data: Record<string, any>
  } | null
  lastExercisePosition: number
  lessonIndex: number
}

export interface ExerciseGenerateDto {
  unitSlug: string
  levelSlug: string
  position: number
  lessonIndex: number
}

// #endregion

// #region Chat

export interface MessageData {
  type: "text"
  value: string
}

export type MessageStatus = "seen" | "sent" | "received" | "sending"

export interface MessageContent {
  date: Date
  text: string
  status: MessageStatus
}

export interface Persona {
  name: string
  username: string
  avatar?: string
}

export interface Chat {
  id: number
  persona: Persona
  lastMessage: MessageContent
}

export interface Message {
  id: string
  from: "user" | "bot"
  message: string
  text: string
  status: MessageStatus
}

// #endregion

export type LessonContent = {
  name: string
} & PromptImplementation

export interface ExercisePromptOptions {
  languageTo: string
  languageFrom: string
  level: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'
  goals: string
  hobbies: string
  profession: string
  observation: string
}
export interface PromptImplementation {
  instructions: string
  criteria?: string
  example: object
}

export interface ExerciseImplementation {
  name: string
  verify: (question: any, answer: any) => boolean
  prompt:
    | ((options: ExercisePromptOptions) => PromptImplementation)
    | (() => PromptImplementation)
  postprocess: (prev: any) => any
}

export interface ExerciseQA {
  text: string
  question?: string
  alternatives: string[]
}

export interface ExerciseFillInTheBlank {
  text: string
  question?: string
  alternatives: string[]
  correctLength: number
}

export type ExerciseQAWithCorrect = ExerciseQA & {
  correct: number
}

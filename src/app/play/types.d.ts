import { Component } from "vue";

export type LessonContent = {
  name: string;
} & PromptImplementation;

export type ExercisePromptOptions = {
  languageTo: string;
  languageFrom: string;
  level: "a1" | "a2" | "b1" | "b2" | "c1" | "c2";
  goals: string;
  hobbies: string;
  profession: string;
  observation: string;
};
export type PromptImplementation = {
  instructions: string;
  criteria?: string;
  example: object;
};

export type ExerciseImplementation = {
  name: string;
  verify: (question: any, answer: any) => boolean;
  prompt:
    | ((options: ExercisePromptOptions) => PromptImplementation)
    | (() => PromptImplementation);
};

export type ExerciseQA = {
  text: string;
  question?: string;
  alternatives: string[];
  correct: number;
};

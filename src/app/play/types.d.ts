import { Component } from "vue";

export type PromptOptions = {
  languageTo: string;
  languageFrom: string;
  level: "a1" | "a2" | "b1" | "b2" | "c1" | "c2";
  interests: string;
};
export type PromptImplementation = {
  instructions: string;
  criteria?: string;
  example: object;
};

export type LessonImplementation = {
  name: string;
  verify: (question: any, answer: any) => boolean;
  prompt:
    | ((options: PromptOptions) => PromptImplementation)
    | (() => PromptImplementation);
};

export type LessonQA = {
  text: string;
  question?: string;
  alternatives: string[];
  correct: number;
};

export type Prompt = {
  system: string;
  user: string;
};

export type LessonContent = {
  name: string;
} & PromptImplementation;

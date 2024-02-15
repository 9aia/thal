import { LessonImplementation } from "./types";

const lessons: LessonImplementation[] = [
  {
    name: "ReadAndAnswer",
    prompt: ({ languageTo, level, interests }) => ({
      instructions: `Generate a short text (2 lines) in the language ${languageTo} and in the level ${level} that is related to ${interests}. Then, generate a comprehension-only question for the text. Finally, generate exactly 3 alternatives with only 1 correct interpretation of the text.`,
      criteria: `
      - The correct key should have a respective value as the index of the correct alternative (starting from 0);
    `,
      example: {
        text: "David is not thirsty, but he feels a little hungry. He's not usually hungry at two o'clock, but he wants a sandwich.",
        question: "David...",
        alternatives: ["wants to eat", "feels tired", "wants to drink"],
        correct: 0,
      },
    }),
    verify(question, answer) {
      return answer === question.correct;
    },
  },
];

export default lessons;

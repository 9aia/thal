import { ExerciseImplementation } from "./types";

const EXERCISES: ExerciseImplementation[] = [
  {
    name: "ReadAndAnswer",
    prompt: ({ languageTo, level, goals, hobbies, profession, observation }) => ({
      instructions: `
      Generate a short text (2 lines) in the language ${languageTo} and in the language level ${level}. The text should be based on user's profile data. Then, generate a comprehension-only question for the text. Finally, generate exactly 3 alternatives with only 1 correct interpretation of the text.
      Be creative and have fun!
      
      ## Profile Data

      - Learning goals: ${goals}
      - Hobbies: ${hobbies}
      - Profession: ${profession}
      - Observation: ${observation}
      `,
      criteria: `
      - The correct key should have a respective value as the index of the correct alternative (starting from 0);
      - It is necessary that the language be ${languageTo};
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

export function findExerciseImplementation(type: string) {
  const implementation = EXERCISES.find(
    (e) => e.name === type
  );
  if(!implementation) {
    throw new Error(`No exercise implementation found: ${type}`)
  }

  return implementation;
}

export default EXERCISES;

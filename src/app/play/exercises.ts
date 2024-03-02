import { BLANK } from './constants'
import type { ExerciseImplementation } from './types'

const EXERCISES: ExerciseImplementation[] = [
  {
    name: 'ReadAndAnswer',
    prompt: ({ languageTo, level, goals, hobbies, profession, observation }) => ({
      instructions: `
      Generate a short text (2 lines) in the language ${languageTo}. The text should be based on user's profile data. Then, generate a comprehension-only question for the text. Finally, generate exactly 3 alternatives with only 1 correct interpretation of the text.
      Be creative and have fun!
      
      ## User Data

      - Language level: ${level}
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
        text: 'David is not thirsty, but he feels a little hungry. He\'s not usually hungry at two o\'clock, but he wants a sandwich.',
        question: 'David...',
        alternatives: ['wants to eat', 'feels tired', 'wants to drink'],
        correct: 0,
      },
    }),
    verify(question, answer) {
      return answer === question.correct
    },
    postprocess(prev) {
      delete prev.correct

      return prev
    },
  },
  {
    name: 'FillInTheBlank',
    prompt: ({ languageTo, level, goals, hobbies, profession, observation }) => ({
      instructions: `
      You are expected to generate a short text (2 lines) in the language ${languageTo} with exactly one blank placeholder that can be inferred just by reading and English knowledge. Also, generate exactly 3 alternatives with only 1 correct word or short phrase that fills in the blank.
      
      ## User Data

      - Language level: ${level}
      - Learning goals: ${goals}
      - Hobbies: ${hobbies}
      - Profession: ${profession}
      - Observation: ${observation}
      `,
      criteria: `
      - You should provide a 'correct' key that should have a respective value as the index of the correct alternative (starting from 0);
      - The text should be personalized to user preferences, so the learning can be more engaging.
      - The placeholder should be exactly demarked by '{blank}'.
      - The text language should be in ${languageTo};
    `,
      example: {
        text: `I always ${BLANK} hungry when I'm in the kitchen!`,
        alternatives: ['eat', 'make', 'feel'],
        correct: 2,
      },
    }),
    verify(question, answer) {
      return answer === question.correct
    },
    postprocess(prev) {
      const correct = prev.correct
      delete prev.correct

      return {
        ...prev,
        correctLength: prev.alternatives[correct].length,
      }
    },
  },
]

export function findExerciseImplementation(type: string) {
  const implementation = EXERCISES.find(
    e => e.name === type,
  )
  if (!implementation)
    throw new Error(`No exercise implementation found: ${type}`)

  return implementation
}

export default EXERCISES

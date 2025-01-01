import { z } from 'zod'

export const profileDataSchema = z.object({
  goals: z.string().nullable().optional(),
  profession: z.string().nullable().optional(),
  hobbies: z.string().nullable().optional(),
  observation: z.string().nullable().optional(),
})

export type ProfileData = z.infer<typeof profileDataSchema>

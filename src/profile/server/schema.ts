import { z } from 'zod'

export const profileDataSchema = z.object({
  goals: z.string().optional(),
  profession: z.string().optional(),
  hobbies: z.string().optional(),
  observation: z.string().optional(),
})

export type ProfileData = z.infer<typeof profileDataSchema>

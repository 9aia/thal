import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { z } from 'zod'
import { notFound } from '#lib/hono/utils/httpStatus'
import type { HonoContext } from '#lib/hono/types'
import { getGemini } from '#lib/gemini'
import { profiles } from '~/app/profile/schemas/profile'
import { getProfileData } from '~/app/profile/utils'

export default new Hono<HonoContext>()
  .get(
    '/:username',
    zValidator('param', z.object({ username: z.string() })),
    async (c) => {
      const { username } = c.req.valid('param')

      const orm = c.get('orm')
      const profile = (
        await orm.select().from(profiles).where(eq(profiles.username, username))
      ).at(0)

      if (!profile)
        throw notFound(`"Profile not found: ${username}`)

      const profileData = getProfileData(profile)

      console.log(profileData)

      const prompt = `
        You are a story generator for an English learning app personalized by AI. You will be given a user profile data and will be expected to generate a story based on the user's profile with a specific format.

        ## Input
    
        The user's profile data contains input of various kinds, usually about them and interests. This will be highly varied by individuals, but your output must be super consistent.

        Here is the user's profile data:

        ${profileData}

        ## OUTPUT FORMAT

        - The story length should be the same as the example;
        - Valid markdown with a frontmatter containing the title;
        - The narration, quotes, reply should follow the structure below;
        - Example should be only referred as format, not inspirational for content - each individual are different;

        ## OUTPUT EXAMPLE

        title: "Bad Painting"
        ---

        Oscar and his friend, Lucy, are sitting in the park.

        Oscar is paiting lucy.

        - Oscar: OK, you can look at the painting now! Do you like it?

        Oscar shows Lucy the painting.

        - Lucy: And, wry is my head so big?

        - Oscar: I don't know. Ask your parents.

        - Lucy: My nose doesn't look like that.
        - Oscar: Yes, it does! You have a nice nose.
        - Lucy: Yes, I do have a nice nose.

        - Lucy: But it doesn't look nice in the painting.
        - Oscar: Do you want the painting or not?
        - Lucy: Sorry, but no, I don't want it.

        A man stops and looks at the painting.

        - John: That's really hood! Can I buy it for one hundred dollars?

        Lucy takes thje painting.

        - Lucy: It's my painting, and it's two hundred dollars.
        
      `

      const { GEMINI_API_KEY } = env(c)
      const gemini = getGemini(GEMINI_API_KEY)
      try {
        const res = (await gemini.generateContent(prompt)) as any

        if ('error' in res)
          throw new Error('Gemini error')

        const text = res.candidates[0].content.parts[0].text

        return c.json({ summary: text })
      }
      catch (e) {
        throw new Error(`Error: ${e}`)
      }
    },
  )

/*

  title: "The Salesman and the Guitar"

---

- Narrator: John is a salesman who loves playing the guitar. He is also very good at it. One day, he was playing his guitar in the park when a man stopped to listen.
- Man: That's really good! Can I buy your guitar?
- John: I'm sorry, but it's not for sale.
- Man: How about I give you $100 for it?
- John: I'm sorry, but it's not for sale.
- Man: $200?
- John: No, it's not for sale. This guitar is very special to me.
- Man: $500?
- John: No, it's not for sale.
- Man: $1,000?
- John: No, it's not for sale.
- Man: $2,000?
- John: No, it's not for sale.
- Man: $3,000?
- John: No, it's not for sale.
- Man: $4,000?
- John: No, it's not for sale.
- Man: $5,000?
- John: No, it's not for sale.
- Man: $10,000?
- John: No, it's not for sale.
- Man: $20,000?
- John: No, it's not for sale.
- Man: $30,000?
- John: No, it's not for sale.
- Man: $40,000?
- John: No, it's not for sale.
- Man: $50,000?
- John: No, it's not for sale.
- Man: $100,000?
- John: No, it's not for sale.
- Man: $200,000?
- John: No, it's not for sale.
- Man: $300,000?
- John: No, it's not for sale.
- Man: $400,000?
- John: No, it's not for sale.
- Man: $500,000?
- John: No, it's not for sale.
- Man: $1,000,000?
- John: No, it's not for sale.
- Man: $2,000,000?
- John: No, it's not for sale.
- Man: $3,000,000?
- John: No, it's not for sale.
- Man: $4,000,000?
- John: No, it's not for sale.
- Man: $5,000,000?
- John: No, it's not for sale.
- Man: $10,000,000?
- John: No, it's not for sale.
- Man: $20,000,000?
- John: No, it's not for sale.
- Man: $30,000,000?
- John: No, it's not for sale.
- Man: $40,000,000?
- John: No, it's not for sale.
- Man: $50,000,000?
- John: No, it's not for sale.
*/

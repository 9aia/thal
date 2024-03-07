import { z } from 'zod'
import { APP_URL } from '~/public_keys.json'
import getValidated from '~/src/base/utils/getValidated'

export default eventHandler(async (event) => {
  const { type } = await getValidated(event, 'body', z.object({
    type: z.enum(['success', 'canceled']),
  }))

  const url = `${APP_URL}/checkout/${type}`

  return `<meta http-equiv="refresh" content="1;URL='${url}'" />`
})

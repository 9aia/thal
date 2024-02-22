import type { PageContext } from 'vike/types'

interface Data {
  type?: 'pricing'
}

export default async (c: PageContext): Promise<Data> => {
  const queryParams = c.urlOriginal.split('?')[1]

  const type = queryParams?.split('=')[1]

  return {
    type: type as 'pricing' | undefined,
  }
}

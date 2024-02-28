import { render } from 'vike/abort'
import type { PageContext } from 'vike/types'

export default (c: PageContext) => {
  if (!c.user)
    throw render('/authentication')
}

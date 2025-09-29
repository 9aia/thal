import { block } from '@9aia/castor'
import { messageAnalysisExplanations } from '~~/server/db/schema'

block('List all message analysis explanations', {
  query: db => db.select().from(messageAnalysisExplanations),
})

block('Delete all message analysis explanations', {
  danger: true,
  query: db => (
    db.delete(messageAnalysisExplanations)
  ),
})

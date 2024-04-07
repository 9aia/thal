import type { Node } from '../types'

export function getUnits (nodes: Node[], i = 100) {
  return nodes.map<Node>((node, j) => {
    const isEven = Boolean(j % 2)

    return {
      id: String(j),
      ...node,
      position: !isEven ? 'start' : 'end',
      active: j < i,
    }
  })
}

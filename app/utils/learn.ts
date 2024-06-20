import type { Level } from "../types"

export function getLevels(nodes: Level[], i = 100) {
  return nodes.map<Level>((unit, j) => {
    const isEven = Boolean(j % 2)

    return {
      ...unit,
      align: !isEven ? "start" : "end",
      active: j < i,
    }
  })
}

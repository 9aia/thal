export type Course = {
  name: string
  sections: Section[]
}

export type Section = {
  id: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2',
  name: string
  description: string
  units: Unit[]
}

export type Unit = {
  id: string
  name: string
  nodes: Node[]
}

export type Node = {
  id?: string
  name: string
  type?: 'concept' | 'question' | 'exercise' | 'none' | 'info' | 'vocab'
  icon?: string
  description?: string
  position?: 'start' | 'end'
  active?: boolean
  optional?: boolean
  maxLevel?: number
  level?: number
}

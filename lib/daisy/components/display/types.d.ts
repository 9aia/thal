export interface TimelineItem {
  id: string
  name: string
  icon?: string
  position?: 'start' | 'end'
  active?: boolean
}

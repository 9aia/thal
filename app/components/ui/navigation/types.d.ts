export type BreadcrumbItem = MenuItemType

export interface MenuItemType {
  id: string
  name?: string
  description?: string
  icon?: string
  href?: string
  for?: string
  action?: string
  method?: string
  type?: 'external' | 'internal' | 'accordion'
  meaning?: 'warning' | 'danger' | 'info' | 'normal'
  newTab?: boolean
  emit?: string
  localize?: boolean
  onSubmit?: (e: Event) => void
  onClick?: (e: Event) => void
  closeMenu?: boolean
}

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
  onSubmit?: (e: Event) => MaybePromise<void>
  onClick?: (e: Event) => MaybePromise<void>
  closeMenu?: boolean
  indicator?: 'warning' | 'danger' | 'info' | 'normal'
}

export type MenuItemTypeOrFalse = MenuItemType | false

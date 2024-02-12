export type MenuItem = {
  id: string;
  name: string;
  icon?: string;
  href?: string;
  action?: string;
  method?: string;
  type?: "external" | "internal" | "accordion";
  meaning?: "warning" | "danger";
  newTab?: boolean;
};

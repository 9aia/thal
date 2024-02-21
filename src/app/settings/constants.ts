import type { MenuItem as MenuItemType } from "../../../lib/daisy/components/layout/types";

const general: MenuItemType[] = [
  {
    id: "profile",
    icon: "face",
    name: "Profile",
    type: "accordion",
    href: "/app/settings/profile",
  },
  {
    id: "account",
    icon: "person",
    name: "Account",
    type: "accordion",
    href: "/app/settings/account",
  },
  {
    id: "plan",
    name: "Plan",
    href: "/api/payment/stripe/create-portal-session",
    icon: "subscriptions",
    type: "external",
  },
  /* {
    id: "privacy",
    icon: "disabled_visible",
    name: "Privacy",
    type: "accordion",
    href: "/app/settings/privacy",
  }, */
  /* {
    id: "notifications",
    icon: "notifications",
    name: "Notifications",
    type: "accordion",
    href: "/app/settings/notifications",
  }, */
  /* {
    id: "accessibility",
    icon: "accessibility",
    name: "Accessibility",
    type: "accordion",
    href: "/app/settings/accessibility",
  }, */
];

const support: MenuItemType[] = [
  {
    id: "how_maratongue_works",
    icon: "directions_run",
    name: "How Maratongue works",
    href: "/how-maratongue-works",
  },
  {
    id: "feedback",
    icon: "feedback",
    name: "Give us feedback",
    type: "external",
    href: "https://forms.gle/5ePvXjrebyWGUrM26",
    newTab: true,
  },
  {
    id: "bug_report",
    icon: "bug_report",
    name: "Report a issue",
    type: "external",
    href: "https://forms.gle/ANMv7qnwTHva1k7L8",
    newTab: true,
  },
];

const legal: MenuItemType[] = [
  { id: "terms", icon: "gavel", name: "Terms of Service", href: "/terms" },
  { id: "privacy", icon: "policy", name: "Privacy policy", href: "/privacy" },
];

export const SETTINGS = {
  general,
  support,
  legal,
};

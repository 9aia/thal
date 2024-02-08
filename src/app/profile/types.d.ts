import { Profile } from "./schemas/profile";
import { INTERESTS } from "./utils";

export type Item = { id: keyof Profile; icon: string; label: string };
export type Interest = typeof INTERESTS[number];

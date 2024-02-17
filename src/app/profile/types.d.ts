import { Profile } from "./schemas/profile";
import { HOBBIES } from "./utils";

export type Item = { id: keyof Profile; icon: string; label: string };
export type Interest = typeof HOBBIES[number];

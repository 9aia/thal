import { Item, Profile } from "./types";

export function getProfileData(data: Profile) {
  let profileData = "";

  ITEMS.forEach((item) => {
    profileData += `${item.label} ${data[item.id]}\n`;
  });
  profileData += `Interests: ${data.interests}`

  return profileData;
}

export const EXAMPLE = {
  name: "Luis",
  lastName: "Float",
  username: "luisfloat",
  signupDate: new Date("2024-01-20"),
  worktime: "Experimenting with software",
  uselessSkill: "Count in binary",
  bioTitle: "Tomorrow Awaits Him",
  obsession: "Thinking about the future",
  location: "Cyberspace",
  interests: ["anime", "art", "design", "music", "reading", "tech", "videogames"].join(", ")
};

export const ITEMS: Item[] = [
  { id: "worktime", icon: "schedule", label: "Gasto muito tempo com" },
  { id: "uselessSkill", icon: "stars", label: "Habilidade mais inútil:" },
  { id: "bioTitle", icon: "auto_stories", label: "Título da minha biografia:" },
  { id: "obsession", icon: "favorite", label: "Eu sou obcecado por:" },
  { id: "location", icon: "location_on", label: "Onde eu vivo:" },
];

export const INTERESTS = [
  { id: "anime", icon: "nights_stay", name: "Anime" },
  { id: "art", icon: "brush", name: "Arte" },
  { id: "design", icon: "stylus_note", name: "Design" },
  { id: "music", icon: "music_note", name: "Música" },
  { id: "reading", icon: "book_5", name: "Leitura" },
  { id: "tech", icon: "memory", name: "Tecnologia" },
  { id: "videogames", icon: "videogame_asset", name: "Video games" },
];
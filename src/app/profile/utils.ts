import { Item, Profile } from "./types";

export function getProfileData(data: Profile) {
  let profileData = "";

  ITEMS.forEach((item) => {
    profileData += `${item.label} ${data[item.id]}\n`;
  });
  profileData += `Interests: ${data.interests}`;

  return profileData;
}

export const EXAMPLE: Profile = {
  name: "Luis",
  lastName: "Float",
  username: "luisfloat",
  signupDate: new Date("2024-01-20"),
  worktime: "Experimenting with software",
  uselessSkill: "Count in binary",
  bioTitle: "Tomorrow Awaits Him",
  obsession: "Thinking about the future",
  location: "Cyberspace",
  interests: "anime, art, design, music, reading, tech, videogames",
};

export const ITEMS: Item[] = [
  { id: "worktime", icon: "schedule", label: "Gasto muito tempo com" },
  { id: "uselessSkill", icon: "stars", label: "Habilidade mais inútil:" },
  { id: "bioTitle", icon: "auto_stories", label: "Título da minha biografia:" },
  { id: "obsession", icon: "favorite", label: "Eu sou obcecado por:" },
  { id: "location", icon: "location_on", label: "Onde eu vivo:" },
];

export const INTERESTS = [
  { id: "animals", icon: "pets", name: "Animais" },
  { id: "cooking", icon: "cooking", name: "Culinária" },
  { id: "food", icon: "restaurant", name: "Comida" },
  { id: "movies", icon: "movie", name: "Filmes" },
  { id: "travel", icon: "map", name: "Viagem" },
  { id: "outdoors", icon: "nature_people", name: "Ar livre" },
  { id: "videogames", icon: "videogame_asset", name: "Video games" },
  { id: "boardgames", icon: "casino", name: "Jogos de tabuleiro" },
  { id: "reading", icon: "book_5", name: "Leitura" },
  { id: "museums", icon: "museum", name: "Museus" },
  { id: "anime", icon: "nights_stay", name: "Anime" },
  { id: "architecture", icon: "architecture", name: "Arquitetura" },
  { id: "art", icon: "brush", name: "Arte" },
  { id: "aviation", icon: "flight", name: "Aviação" },
  { id: "building_things", icon: "construction", name: "Construir coisas" },
  { id: "camping", icon: "camping", name: "Acampamento" },
  { id: "cardgames", icon: "playing_cards", name: "Jogos de cartas" },
  { id: "cars", icon: "directions_car", name: "Carros" },
  { id: "comedy", icon: "sentiment_very_satisfied", name: "Comédia" },
  { id: "crafting", icon: "chair", name: "Construção de decorativos" },
  { id: "cultural_heritage", icon: "fort", name: "Herança cultural" },
  { id: "design", icon: "stylus_note", name: "Design" },
  { id: "fashion", icon: "apparel", name: "Moda" },
  { id: "gardening", icon: "yard", name: "Jardinagem" },
  { id: "hair", icon: "cut", name: "Cabelo" },
  { id: "hiking", icon: "hiking", name: "Hiking" },
  {
    id: "home_improvement",
    icon: "home_improvement_and_tools",
    name: "Melhoramento de casa",
  },

  { id: "live_music", icon: "music_note", name: "Música ao vivo" },
  { id: "live_sports", icon: "hiking", name: "Esportes ao vivo" },

  { id: "makeup", icon: "health_and_beauty", name: "Maquiagem" },
  { id: "photography", icon: "photo_camera", name: "Fotografia" },
  { id: "music", icon: "music_note", name: "Música" },
  { id: "podcasts", icon: "mic", name: "Podcasts" },
  { id: "puzzles", icon: "extension", name: "Quebra-cabeças" },
  { id: "self_care", icon: "self_care", name: "Autocuidados" },
  { id: "shopping", icon: "local_mall", name: "Compras" },
  { id: "singing", icon: "mic_external_on", name: "Canto" },
  { id: "social_activism", icon: "campaign", name: "Ativismo social" },
  { id: "sustainability", icon: "recycling", name: "Sustentabilidade" },
  { id: "tv", icon: "tv", name: "TV" },
  { id: "tech", icon: "memory", name: "Tecnologia" },
  { id: "theater", icon: "theater_comedy", name: "Teatro" },
  { id: "walking", icon: "directions_walk", name: "Caminhada" },
  { id: "wine", icon: "wine_bar", name: "Vinho" },
  { id: "writing", icon: "edit_document", name: "Escrita" },
  { id: "yoga", icon: "self_improvement", name: "Yoga" },
];

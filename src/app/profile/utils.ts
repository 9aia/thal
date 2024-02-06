import { Interest, Item, Profile } from "./types";

export function getProfileData(data: Profile) {
  let profileData = "";

  ITEMS.forEach((item) => {
    profileData += `${item.label} ${data[item.id]}\n`;
  });
  profileData += `Interests: ${data.interests}`;

  return profileData;
}

export function parseInterests(keys: string) {
  const array: any = keys.split(", ").reduce<Interest[]>((prev, interestId) => {
    const interest = INTERESTS.find((interest) => interest.id === interestId);

    if (!interest) {
      return prev;
    }

    return [...prev, interest];
  }, []);

  return array as Interest[];
}

export const MAX_INTERESTS_AMOUNT = 7;

export const ITEMS: Item[] = [
  { id: "worktime", icon: "schedule", label: "Spending too much time on: " },
  { id: "uselessSkill", icon: "stars", label: "Most useless skill:" },
  { id: "bioTitle", icon: "auto_stories", label: "Title of my biography:" },
  { id: "obsession", icon: "favorite", label: "I'm obsessed with:" },
  { id: "location", icon: "location_on", label: "Where I live:" },
];

export const INTERESTS = [
  { id: "animals", icon: "pets", name: "Animals" },
  { id: "cooking", icon: "cooking", name: "Cooking" },
  { id: "food", icon: "restaurant", name: "Food" },
  { id: "movies", icon: "movie", name: "Movies" },
  { id: "travel", icon: "map", name: "Travel" },
  { id: "outdoors", icon: "nature_people", name: "Outdoors" },
  { id: "videogames", icon: "videogame_asset", name: "Video games" },
  { id: "boardgames", icon: "casino", name: "Board games" },
  { id: "reading", icon: "book_5", name: "Reading" },
  { id: "museums", icon: "museum", name: "Museums" },
  { id: "anime", icon: "nights_stay", name: "Animes" },
  { id: "architecture", icon: "architecture", name: "Architecture" },
  { id: "art", icon: "brush", name: "Art" },
  { id: "aviation", icon: "flight", name: "Aviation" },
  { id: "building_things", icon: "construction", name: "Building things" },
  { id: "camping", icon: "camping", name: "Camping" },
  { id: "cardgames", icon: "playing_cards", name: "Card games" },
  { id: "cars", icon: "directions_car", name: "Cars" },
  { id: "comedy", icon: "sentiment_very_satisfied", name: "Comedy" },
  { id: "crafting", icon: "chair", name: "Crafting" },
  { id: "cultural_heritage", icon: "fort", name: "Cultural heritage" },
  { id: "design", icon: "stylus_note", name: "Design" },
  { id: "fashion", icon: "apparel", name: "Fashion" },
  { id: "gardening", icon: "yard", name: "Gardening" },
  { id: "hair", icon: "cut", name: "Hair" },
  { id: "hiking", icon: "hiking", name: "Hiking" },
  {
    id: "home_improvement",
    icon: "home_improvement_and_tools",
    name: "Home improvement",
  },

  { id: "live_music", icon: "music_note", name: "Live music" },
  { id: "live_sports", icon: "hiking", name: "Live sports" },

  { id: "makeup", icon: "health_and_beauty", name: "Makeup" },
  { id: "photography", icon: "photo_camera", name: "Photography" },
  { id: "music", icon: "music_note", name: "Music" },
  { id: "podcasts", icon: "mic", name: "Podcasts" },
  { id: "puzzles", icon: "extension", name: "Puzzles" },
  { id: "self_care", icon: "self_care", name: "Self-care" },
  { id: "shopping", icon: "local_mall", name: "Shopping" },
  { id: "singing", icon: "mic_external_on", name: "Singing" },
  { id: "social_activism", icon: "campaign", name: "Social activism" },
  { id: "sustainability", icon: "recycling", name: "Sustainability" },
  { id: "tv", icon: "tv", name: "TV" },
  { id: "tech", icon: "memory", name: "Technology" },
  { id: "theater", icon: "theater_comedy", name: "Theater" },
  { id: "walking", icon: "directions_walk", name: "Walking" },
  { id: "wine", icon: "wine_bar", name: "Wine" },
  { id: "writing", icon: "edit_document", name: "Writing" },
  { id: "yoga", icon: "self_improvement", name: "Yoga" },
];

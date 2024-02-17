import { Profile } from "./schemas/profile";

const ITEMS = [
  { id: "goals", label: "Goals:" },
  { id: "hobbies", label: "Hobbies:" },
  { id: "profession", label: "Profession:" },
  { id: "observation", label: "Observation:" },
];

export function getProfileData(data: Profile) {
  let profileData = "";

  ITEMS.forEach((item) => {
    profileData += `${item.label} ${data[item.id]}\n`;
  });
  profileData += `Hobbies: ${data.hobbies}`;

  return profileData;
}

export function parseJoin<T extends { id: string }>(keys: string, items: T[]) {
  const array: any = keys.split(", ").reduce<T[]>((prev, interestId) => {
    const item = items.find((item) => item.id === interestId);

    if (!item) {
      return prev;
    }

    return [...prev, item];
  }, []);

  return array as T[];
}

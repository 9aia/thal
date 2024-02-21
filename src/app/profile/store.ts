import { Ref, inject } from "vue";
import { Profile } from "./schemas/profile";

function useProfile() {
  const profile = inject<Ref<Profile>>("profile")!;

  return profile;
}

export default useProfile;

import listenToPrefersDark from "#framework/theme/listenToPrefersDark";
import { OnHydrationEndSync } from "vike/types";

export const onHydrationEnd: OnHydrationEndSync = (
  pageContext
): ReturnType<OnHydrationEndSync> => {
  document.body.classList.add("is-hydrated");
  listenToPrefersDark();
};

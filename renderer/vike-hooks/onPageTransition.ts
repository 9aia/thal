import { OnPageTransitionEndSync, OnPageTransitionStartSync } from "vike/types";

export const onPageTransitionStart: OnPageTransitionStartSync = (
  pageContext
): ReturnType<OnPageTransitionStartSync> => {
  document.body.classList.add("route-transition");
  pageContext.isBackwardNavigation &&
    document.body.classList.add("is-backward-navigation");
};

export const onPageTransitionEnd: OnPageTransitionEndSync = (
  pageContext
): ReturnType<OnPageTransitionEndSync> => {
  document.body.classList.remove("route-transition");
};

import { BreadcrumbItem } from "#design/components/navigation/types";
import { usePageContext } from "#framework/composables/usePageContext";
import { navigate } from "vike/client/router";
import { computed } from "vue";

type Options = {
  urlPathname?: string;
  root: BreadcrumbItem;
  config: BreadcrumbItem[];
};

function useBreadcrumbs(options: Options) {
  const pageContext = usePageContext();

  const path = computed(() => {
    return pageContext.urlPathname
      .replaceAll(options?.urlPathname!, "")
      .split("/")
      .filter((o) => o !== "");
  });
  const items = computed(() => {
    const currentItem = options.config.find((o) => o.id === path.value[0]);
    if (!currentItem) return [options.root];

    return [options.root, currentItem];
  });

  const back = () => {
    navigate(options?.urlPathname!);
  };

  return { items, path, back };
}

export default useBreadcrumbs;

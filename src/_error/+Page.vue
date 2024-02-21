<script lang="ts" setup>
import { t } from "#lib/i18n";
import { usePageContext } from "#lib/vike/composables/usePageContext";
import { computed } from "vue";

const pageContext = usePageContext();

const errorMessage = computed(() => {
  const makeReturn = (message: string, statusCode: number) => {
    return {
      color: statusCode === 404 ? "text-orange-500" : "text-red-500",
      statusCode,
      message,
    };
  };

  const options: Record<number, string> = {
    403: "You do not have permission to access this page.",
    404: "We could not find this page.",
    410: "This page has been removed.",
    429: "You are making too many requests.",
    500: "There was a problem on the server.",
    401: "You are not logged in.",
    503: "The server is undergoing maintenance.",
  };

  const statusCode = pageContext.is404
    ? 404
    : options.hasOwnProperty(pageContext.abortStatusCode || "")
    ? pageContext.abortStatusCode
    : 500;

  const message =
    pageContext.abortReason ||
    (options.hasOwnProperty(statusCode!) ? options[statusCode!] : options[500]);

  if (typeof message === "object") {
    if (message.notAdmin) {
      return makeReturn(options[403], 403);
    }

    return makeReturn(options[500], 500);
  }

  return makeReturn(message, statusCode!);
});
</script>

<template>
  <div
    class="flex flex-col items-center absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2"
  >
    <h1 class="text-5xl font-bold text-center mb-4" :class="errorMessage.color">
      {{ errorMessage.statusCode }}
    </h1>
    <p class="text-center">{{ t(errorMessage.message) }}</p>

    <a href="/" class="mt-4 btn btn-primary">
      {{ t("Access the home page") }}
    </a>
  </div>
</template>

<script setup lang="ts">
import Btn from "#lib/daisy/components/action/Btn.vue";
import Icon from "#lib/daisy/components/display/Icon.vue";
import client from "#lib/hono/client";
import useSpringState from "#lib/vue/composables/useSpringState";
import { getConfig } from "../utils";
import { useAsyncState } from "@vueuse/core";
import { collected } from "../collect";

const translation = useAsyncState(
  async () => {
    const config = getConfig();
    const boilerplate = getBoilerplate();

    const res = await client.translate.$post({
      json: {
        defaultLocale: config.defaultLocale,
        translations: boilerplate,
      },
    });

    return res.json();
  },
  null,
  { immediate: false }
);

const ok = useSpringState<boolean>(false);

const getBoilerplate = () => {
  const config = getConfig();
  const boilerplate: any = {};

  Object.keys(collected).forEach((text) => {
    boilerplate[text] = {};

    config.locales
      .filter((locale) => locale !== config.defaultLocale)
      .forEach((locale) => {
        boilerplate[text][locale] = "";
      });
  });

  return boilerplate;
};

const translate = async () => {
  await translation.execute();

  const data = translation.state.value;
  console.log(JSON.stringify(data?.translations, null, 2));

  ok.set(true, 1000);
};

const DEV = import.meta.env.DEV;
</script>

<template>
  <div class="fixed z-10 bottom-4 left-4">
    <Btn
      v-if="DEV"
      :loading="translation.isLoading.value"
      :success="ok.state.value"
      @click="translate"
      class="rounded-full shadow-2xl btn-primary"
    >
      <Icon>translate</Icon>
    </Btn>
  </div>
</template>

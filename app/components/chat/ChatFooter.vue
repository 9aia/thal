<script lang="ts" setup>
const text = ref("")
</script>

<template>
  <footer class="px-3 py-2 bg-slate-200 flex items-end justify-center gap-2">
    <div class="flex-1 flex">
      <ContentEditable is="span" v-model="text" class="input w-full h-auto p-[10px] textarea" placeholder="Type a message" />
    </div>

    <div role="button" class="btn btn-ghost btn-circle avatar">
      <Icon :name="!text ? 'mic' : 'send'" />
    </div>
  </footer>
</template>

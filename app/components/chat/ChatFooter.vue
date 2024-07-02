<template>
  <footer class="px-3 py-2 bg-slate-200 flex items-end justify-center gap-2">
    <!-- <div role="button" class="btn btn-ghost btn-circle avatar">
      <Icon name="mood" />
    </div>

    <div role="button" class="btn btn-ghost btn-circle avatar">
      <Icon name="add" />
    </div> -->

    <div class="flex-1 flex">
      <span class="input w-full h-auto p-[10px] textarea" role="textbox" contenteditable />
    </div>

    <div role="button" class="btn btn-ghost btn-circle avatar">
      <Icon name="mic" />
    </div>
  </footer>
</template>

<style scoped>
.textarea[contenteditable]:empty::before {
  content: "Type a message";
  color: gray;
}
</style>

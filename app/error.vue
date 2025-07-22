<script lang="ts" setup>
const error = useError()

function handleError() {
  clearError({
    redirect: '/',
  })
}
</script>

<template>
  <div class="flex flex-col w-full h-dvh justify-center items-center bg-white p-4">
    <CommonRouteError
      :error="error.statusCode"
      @error="handleError"
    />
  </div>
</template>

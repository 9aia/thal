<template>
  <header class="sticky top-0 w-full z-[1000] bg-slate-800 text-primary">
    <nav class="px-4 navbar max-w-[800px] mx-auto">
      <div class="navbar-start">
        <A href="/" class="text-xl flex gap-1 items-center justify-center">
          <span class="font-bold">Thal</span>

          <div
            class="badge badge-primary badge-outline uppercase"
          >
            Experimental
          </div>
        </A>
      </div>
      <div class="navbar-end">
        <slot name="navbar-end" />
      </div>
    </nav>
  </header>
</template>

<template>
  <div>
    <slot name="navbar-top" />
  </div>

  <header class="sticky top-0 w-full z-[1000] bg-white">
    <nav class="px-4 navbar max-w-[800px] mx-auto">
      <div class="navbar-start flex items-center gap-2">
        <A href="/" class="text-xl flex gap-2 items-center justify-center border border-transparent focus:border-b-2 focus:border-b-primary focus:outline-hidden">
          <img src="/thal-logo.svg" alt="Thal logo — a rounded chat bubble icon with a lowercase letter T inside" class="w-7 h-7">
          <span class="font-medium text-gray-800">Thal</span>
        </A>

        <ReleaseBadge />
      </div>
      <div class="navbar-end">
        <slot name="navbar-end" />
      </div>
    </nav>
  </header>
</template>

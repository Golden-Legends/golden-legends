<script setup lang="ts"></script>

<template>
  <button
    id="open-objects-menu"
    class="py-2 px-6 flex items-center justify-center border-4 border-black bg-gradient-to-b from-begin-light-blue-gradient to-end-light-blue-gradient rounded-lg hover:from-begin-light-blue-gradient/60 hover:to-end-light-blue-gradient/60 transition-all"
  >
    <img src="@/../public/backpack.svg" alt="home" class="w-8 h-8 mr-2" />
    <span class="text-3xl font-black text-stroke"> Objets trouvés </span>
  </button>
  <button
    id="open-tips-menu"
    class="py-2 px-6 flex items-center justify-center border-4 border-black bg-gradient-to-b from-begin-light-blue-gradient to-end-light-blue-gradient rounded-lg hover:from-begin-light-blue-gradient/60 hover:to-end-light-blue-gradient/60 transition-all"
  >
    <img src="@/../public/easterEgg.svg" alt="home" class="w-8 h-8 mr-2" />
    <span class="text-3xl font-black text-stroke"> Easter eggs </span>
  </button>
  <button
    id="open-aide-menu"
    class="py-2 px-6 flex items-center justify-center border-4 border-black bg-gradient-to-b from-begin-light-blue-gradient to-end-light-blue-gradient rounded-lg hover:from-begin-light-blue-gradient/60 hover:to-end-light-blue-gradient/60 transition-all"
  >
    <img src="@/../public/info.svg" alt="home" class="w-8 h-8 mr-2" />
    <span class="text-3xl font-black text-stroke"> Aide </span>
  </button>
  <button
    id="back-menu"
    class="py-2 px-6 flex items-center justify-center border-4 border-black bg-gradient-to-b from-begin-light-blue-gradient to-end-light-blue-gradient rounded-lg hover:from-begin-light-blue-gradient/60 hover:to-end-light-blue-gradient/60 transition-all"
  >
    <img src="@/../public/home.svg" alt="home" class="w-8 h-8 mr-2" />
    <span class="text-3xl font-black text-stroke"> Quitter </span>
  </button>
</template>

<style scoped></style>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
<template>
<div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white p-2 px-4 rounded-lg h-fit"
  >
  <div class="pb-4">
    <h1 class="text-3xl font-bold"> {{ props.title }}</h1>
  </div>
    <div class="w-full flex gap-8">
        <div class="bg-red-200 w-1/2">
            <div class="flex flex-col items-center gap-4">
                <h1 class="text-2xl">SOLO</h1>
                <button>
                    Facile
                </button>
                <button>
                    Moyen
                </button>
                <button>
                    Difficile
                </button>
            </div>
        </div>
        <div class="bg-blue-200 w-1/2">
            <div class="flex flex-col items-center gap-4">
                <h1 class="text-2xl">MULTI</h1>
                <button>
                    Créer
                </button>
                <input type="text" class="w-24 text-xl"/>
                <button>
                    Rejoindre
                </button>
            </div>
        </div>
    </div>
  </div></template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import RDSText from "@/components/gui/running/RDSText.vue";

const ready = ref(true);
const steady = ref(false);
const go = ref(false);

onMounted(() => {
  setTimeout(() => {
    ready.value = true;
    setTimeout(() => {
      ready.value = false;
      steady.value = true;
      setTimeout(() => {
        steady.value = false;
        go.value = true;
      }, 1000);
    }, 1000);
  }, 1000);
});
</script>

<template>
  <div>
    <RDSText text="À vos marques" v-if="ready" />
    <RDSText text="Prêt" v-if="steady" />
    <RDSText text="Partez !" v-if="go" />
  </div>
</template>

<style scoped></style>

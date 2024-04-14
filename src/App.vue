<script setup lang="ts">
import { Toaster } from "vue-sonner";
</script>

<template>
  <Toaster closeButton position="top-right" />
  <router-view></router-view>
</template>

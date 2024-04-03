<script setup lang="ts">
import ClassicButton from "@/components/landing/ClassicButton.vue";
import ClassicInput from "@/components/landing/ClassicInput.vue";
import SandboxContainer from "@/components/SandboxContainer.vue";
import Timer from "@/components/gui/Timer.vue";
import Position from "@/components/gui/Position.vue";
</script>

<template>
  <div class="overflow-auto flex flex-col gap-6 m-4">
    <h1 class="text-3xl font-bold">Sandbox Page</h1>
    <div class="flex flex-col gap-4">
      <SandboxContainer name="Classic Button">
        <ClassicButton text="Text here" />
      </SandboxContainer>
      <SandboxContainer name="Classic Input">
        <ClassicInput placeholder="Text here" />
      </SandboxContainer>
      <SandboxContainer name="Timer">
        <Timer />
      </SandboxContainer>
      <SandboxContainer name="Medals">
        <div class="flex gap-4 w-fit mt-8">
          <Position position="1" />
          <Position position="2" />
          <Position position="3" />
          <Position position="4" />
          <Position position="5" />
          <Position position="6" />
        </div>
      </SandboxContainer>
    </div>
  </div>
</template>

<style scoped></style>

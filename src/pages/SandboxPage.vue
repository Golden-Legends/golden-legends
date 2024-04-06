<script setup lang="ts">
import ClassicButton from "@/components/landing/ClassicButton.vue";
import ClassicInput from "@/components/landing/ClassicInput.vue";
import SandboxContainer from "@/components/SandboxContainer.vue";
import Timer from "@/components/gui/Timer.vue";
import Position from "@/components/gui/Position.vue";
import Options from "@/components/gui/options/Options.vue";
import Dialog from "@/components/gui/Dialog.vue";
import Results from "@/components/gui/results/Results.vue";
import ResultsContent, {
  Result,
} from "@/components/gui/results/ResultsContent.vue";

const longDialogText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const results: Result[] = [
  { place: 1, name: "Sebastien", result: "10.12" },
  { place: 2, name: "Nicolas", result: "10.15" },
  { place: 3, name: "Théo", result: "10.20" },
  { place: 4, name: "Rémi", result: "10.25" },
  { place: 5, name: "John", result: "10.30" },
  { place: 6, name: "Doe", result: "10.35" },
];
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
        <div class="flex mt-2 gap-4">
          <Position position="1" />
          <Position position="2" />
          <Position position="3" />
          <Position position="4" />
          <Position position="5" />
          <Position position="6" />
        </div>
      </SandboxContainer>
      <SandboxContainer name="Options">
        <Options>
          <div class="flex justify-between">
            <span class="text-2xl">Son global</span>
            <input type="range" min="0" max="100" class="accent-black" />
          </div>
          <div class="flex justify-between">
            <span class="text-2xl">Musique</span>
            <input type="range" min="0" max="100" class="accent-black" />
          </div>
          <div class="flex justify-between">
            <span class="text-2xl">Montrer les noms</span>
            <input type="checkbox" class="accent-black w-6 h-6" />
          </div>
        </Options>
      </SandboxContainer>
      <SandboxContainer name="Dialog">
        <Dialog name="Gladiator" :text="longDialogText" />
        <Dialog
          name="Nicolas"
          text="Bientôt fini la map la team :) Et vous, vous en êtes où ? "
        />
        <Dialog name="Théo" text="Bientôt fini le 100m la team :)" />
      </SandboxContainer>
      <SandboxContainer name="Result">
        <Results title="100m">
          <ResultsContent :results="results" />
        </Results>
      </SandboxContainer>
    </div>
  </div>
</template>

<style scoped></style>

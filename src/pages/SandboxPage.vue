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
import CommandContainer from "@/components/gui/commands/CommandContainer.vue";
import RDSText from "@/components/gui/running/RDSText.vue";
import KeyPressInteraction from "@/components/gui/KeyPressInteraction.vue";
import Finish from "@/components/gui/running/Finish.vue";
import FoundObjectsContainer, {
  TBF_OBJECT,
} from "@/components/gui/foundobjects/FoundObjectsContainer.vue";
import SoundButton from "@/components/SoundButton.vue";
import KeybindHint from "@/components/gui/KeybindHint.vue";
import SpeedBar from "@/components/gui/running/SpeedBar.vue";

import {ref} from "vue";
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

const objects = [
  {
    name: "Ballon de basket",
    path: "ball",
    found: false,
  },
  {
    name: "Vélo",
    path: "bike",
    found: true,
  },
  {
    name: "Arc",
    path: "bow",
    found: true,
  },
  {
    name: "Gants de boxe",
    path: "gloves",
    found: true,
  },
  {
    name: "Haies",
    path: "hurdles",
    found: false,
  },
  {
    name: "Raquette de tennis",
    path: "racket",
    found: true,
  },
  {
    name: "Chaussures",
    path: "shoes",
    found: false,
  },
  {
    name: "Skateboard",
    path: "skate",
    found: false,
  },
] as TBF_OBJECT[];

const speed = ref(0);
setInterval(() => {
  // Speed should vary between 0 and 20 by 1 (+ 1 or -1) every 100ms
  speed.value = speed.value + (Math.random() > 0.5 ? 1 : -1);
  if (speed.value < 0) {
    speed.value = 0;
  } else if (speed.value > 20) {
    speed.value = 20;
  }
}, 75);

</script>

<template>
  <div class="overflow-auto flex flex-col gap-6 m-4">
    <h1 class="text-3xl font-bold">Sandbox Page</h1>
    <div class="flex flex-col gap-4 mb-4">
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
      <SandboxContainer name="Commands">
        <CommandContainer class="mb-4" name="COURIR" :keys="['s', 'd']" />
        <CommandContainer
          class="mb-4"
          name="NAGER"
          :keys="['espace', 'd']"
          width="240"
        />
        <CommandContainer class="mb-4" name="ACTION" :keys="['espace']" />
      </SandboxContainer>
      <SandboxContainer name="Départ">
        <RDSText text="À vos marques" />
        <RDSText text="Prêt ?" />
        <RDSText text="Partez" />
      </SandboxContainer>
      <SandboxContainer name="Terminée">
        <Finish class="mt-4" />
      </SandboxContainer>
      <SandboxContainer name="Keypress interactions">
        <KeyPressInteraction :keys="['s', 'd']" />
      </SandboxContainer>
      <SandboxContainer name="Keypress interactions">
        <FoundObjectsContainer :objects="objects" />
      </SandboxContainer>
      <SandboxContainer name="Sound">
        <SoundButton />
      </SandboxContainer>
      <SandboxContainer name="Keybind hint">
        <KeybindHint keybind="Esc" name="Options" event-key="escape"/>
        <KeybindHint keybind="M" name="Carte" event-key="m" />
      </SandboxContainer>
      <SandboxContainer name="Speed bar">
        <SpeedBar :speed="speed" :min="0" :max="20" />
      </SandboxContainer>
    </div>
  </div>
</template>

<style scoped></style>

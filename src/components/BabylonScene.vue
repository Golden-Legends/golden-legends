<template>
  <canvas ref="bjsCanvas" />
  <SoundButton id="sound-button" class="absolute bottom-6 left-8 z-10" />
  <Dialog
    name="Gladiator"
    :text="jumpGameText"
    id="jump-game-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Gladiator"
    :text="objectGameText"
    id="object-game-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Gladiator"
    :text="tpGameText"
    id="tp-game-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Gladiator"
    :text="footGameText"
    id="foot-game-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Olympic object"
    :text="objetHaieText"
    id="haie-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Olympic object"
    :text="objetgGantText"
    id="gant-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Olympic object"
    :text="objetRaquetteText"
    id="raquette-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Olympic object"
    :text="objetBallonText"
    id="ballon-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Olympic object"
    :text="objetSkateText"
    id="skate-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Olympic object"
    :text="objetArcText"
    id="arc-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Olympic object"
    :text="objetChaussureText"
    id="chaussure-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Olympic object"
    :text="objetVeloText"
    id="velo-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Game"
    :text="objetRecupText"
    id="recup-object-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Game"
    :text="allObjetRecupText"
    id="recup-allObject-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Game"
    :text="victoryJumpText"
    id="victory-jump-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Game"
    :text="loseJumpText"
    id="lose-jump-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Scoreboard"
    :text="stationScoreboard"
    id="scoreboard-station-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Game"
    :text="tpGame"
    id="tpGame-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <MainOptions />
  <!-- RUNNING GAME -->
  <ClassicButton
    text="Passer"
    name="runningGame-skip-button"
    id="runningGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Prêt"
    name="runningGame-ready-button"
    id="runningGame-ready-button"
    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
  />
  <Timer 
    name="runningGame-timer"
    id="runningGame-timer"
    class="hidden absolute bottom-12 right-12" 
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MainOptions from "./MainOptions.vue";
import App from "../../src/models/App.ts";
import Dialog from "@/components/gui/Dialog.vue";
import ClassicButton from "@/components/landing/ClassicButton.vue";
import SoundButton from "@/components/SoundButton.vue";
import Timer from "@/components/gui/Timer.vue";

const bjsCanvas = ref<HTMLCanvasElement | null>(null);
//Gladiator Dialogs
const jumpGameText =
  "Arriveras tu à la fin du parcours sans toucher l'eau ? Appuie sur Espace pour commencer le jeu !";
const objectGameText =
  "Des objets en référence aux JO sont cachés dans cette ville, sauras tu les retrouver ?!";
const tpGameText =
  "Approche toi des portails pour te téléporter dans différents stades olympiques pour défier tes amis !";
const footGameText =
  "Arriveras tu à marquer le plus de but ? Appuie sur Espace pour commencer le jeu !";
//Objects message
const objetHaieText = "Récupére la Haie olympique en appuyant sur Espace";
const objetgGantText = "Récupére le Gant de boxe en appuyant sur Espace";
const objetRaquetteText =
  "Récupére la Raquette de tennis en appuyant sur Espace";
const objetBallonText = "Récupére le Ballon de basket en appuyant sur Espace";
const objetSkateText = "Récupére le Skateboard en appuyant sur Espace";
const objetArcText = "Récupére l'Arc olympique en appuyant sur Espace";
const objetChaussureText =
  "Récupére les Chaussures de course en appuyant sur Espace";
const objetVeloText = "Récupére le Vélo olympique en appuyant sur Espace";
const objetRecupText = "Objet récupéré avec succès !";
const allObjetRecupText = "Tous les objets olympiques ont été ramassés !";
//jump message
const victoryJumpText =
  "Vous avez réussi à dompter les plateformes mouvantes. Voici une trainée en récompense !";
const loseJumpText = "Pas pour cette fois... Retente ta chance !";
//scoreboard station
const stationScoreboard = "GUI Scoreboard TODO...";
//TP game
const tpGame = "GUI TP GAME TODO...";
onMounted(() => {
  if (bjsCanvas.value) {
    new App(bjsCanvas.value);
  }
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>

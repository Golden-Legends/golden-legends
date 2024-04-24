<template>
  <canvas ref="bjsCanvas" />
  <SoundButton id="sound-button" class="absolute bottom-6 left-8 z-10" />
  <KeybindHint
    class="absolute top-4 left-4"
    keybind="O"
    name="Options"
    eventKey="o"
    id="options-keybind"
  />
  <KeybindHint
    class="absolute top-20 left-4"
    keybind="N"
    name="Objets à trouver"
    eventKey="n"
    id="objects-keybind"
  />
  <KeybindHint
    class="absolute top-36 left-4"
    keybind="M"
    name="Carte"
    eventKey="m"
    id="map-keybind"
  />
  <FoundObjectsContainer
    title="objectsFound"
    name="objectsFound"
    :objects="storeObjects.state.objects"
    id="objectsFound"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <!-- log test carte a supprimer-->
  <Dialog
    name="Carte"
    text="carte log"
    id="carte-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
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
  <!-- RUNNINGGAME -->
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
  <Results
    title="100m"
    name="runningGame-results"
    id="runningGame-results"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
  <ResultsContent />
  </Results>
  <SpeedBar
    :min="0"
    :max="100"
    :speed="50"
    name="runningGame-speed-bar"
    id="runningGame-speed-bar"
    class="hidden absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <KeyPressInteraction
    :keys="['s', 'd']"
    name="runningGame-keyPressed"
    id="runningGame-keyPressed"
    class="hidden absolute left-1/2 bottom-12 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <RDSText
    text="À vos marques"
    name="runningGame-text-1"
    id="runningGame-text-1"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Prêt ?"
    name="runningGame-text-2"
    id="runningGame-text-2"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Partez"
    name="runningGame-text-3"
    id="runningGame-text-3"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Finish
    name="runningGame-text-finish"
    id="runningGame-text-finish"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
import ResultsContent from "@/components/gui/results/ResultsContent.vue";
import Results from "@/components/gui/results/Results.vue";
import KeyPressInteraction from "@/components/gui/KeyPressInteraction.vue";
import RDSText from "@/components/gui/running/RDSText.vue";
import Finish from "@/components/gui/running/Finish.vue";
import SpeedBar from "./gui/running/SpeedBar.vue";
import KeybindHint from "./gui/KeybindHint.vue";
import FoundObjectsContainer from "@/components/gui/foundobjects/FoundObjectsContainer.vue";
import { storeObjects } from "./gui/storeObjects";

const bjsCanvas = ref<HTMLCanvasElement | null>(null);
//Gladiator Dialogs
const jumpGameText =
  "Arriveras tu à la fin du parcours sans toucher l'eau ? Appuie sur R pour commencer le jeu !";
const objectGameText =
  "Des objets en référence aux JO sont cachés dans cette ville, sauras tu les retrouver ?!";
const tpGameText =
  "Approche toi des portails pour te téléporter dans différents stades olympiques pour défier tes amis !";
const footGameText =
  "Arriveras tu à marquer le plus de but ? Appuie sur R pour commencer le jeu !";
//Objects message
const objetHaieText = "Récupére la Haie olympique en appuyant sur R";
const objetgGantText = "Récupére le Gant de boxe en appuyant sur R";
const objetRaquetteText =
  "Récupére la Raquette de tennis en appuyant sur R";
const objetBallonText = "Récupére le Ballon de basket en appuyant sur R";
const objetSkateText = "Récupére le Skateboard en appuyant sur R";
const objetArcText = "Récupére l'Arc olympique en appuyant sur R";
const objetChaussureText =
  "Récupére les Chaussures de course en appuyant sur R";
const objetVeloText = "Récupére le Vélo olympique en appuyant sur R";
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

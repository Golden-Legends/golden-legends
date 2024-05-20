<template>
  <canvas ref="bjsCanvas" />
  <!-- <SoundButton id="sound-button" class="absolute bottom-6 left-8 z-10" /> -->
  <KeybindHint
    class="absolute top-4 left-4"
    keybind="O"
    name="Options"
    eventKey="o"
    id="options-keybind"
  />
  <Options
    title="options"
    name="options"
    id="options"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
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
  <OnboardingContainer
    id="onboarding-container"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
  <GameGate
    title="100m"
    name="100mtp"
    id="100mtp"
    class="hidden relative left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <GateButton id="100mFacile" name="Facile" difficulty="easy" />
    <GateButton id="100mMoyen" name="Moyen" difficulty="medium" />
    <GateButton id="100mDifficile" name="Difficile" difficulty="hard" />
  </GameGate>
  <GameGate
    title="Natation"
    name="natationtp"
    id="natationtp"
    class="hidden relative left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <GateButton id="natationFacile" name="Facile" difficulty="easy" />
    <GateButton id="natationMoyen" name="Moyen" difficulty="medium" />
    <GateButton id="natationDifficile" name="Difficile" difficulty="hard" />
  </GameGate>
  <GameGate
    title="Plongeon"
    name="plongeontp"
    id="plongeontp"
    class="hidden relative left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <GateButton id="plongeonFacile" name="Facile" difficulty="easy" />
    <GateButton id="plongeonMoyen" name="Moyen" difficulty="medium" />
    <GateButton id="plongeonDifficile" name="Difficile" difficulty="hard" />
  </GameGate>
  <GameGate
    title="Boxe"
    name="boxetp"
    id="boxetp"
    class="hidden relative left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <GateButton id="boxeDefense" name="Défense" difficulty="easy" />
  </GameGate>
  <GameGate
    title="Tir à l'arc"
    name="tirArctp"
    id="tirArctp"
    class="hidden relative left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <GateButton id="tirArcFacile" name="Facile" difficulty="easy" />
    <GateButton id="tirArcMoyen" name="Moyen" difficulty="medium" />
    <GateButton id="tirArcDifficile" name="Difficle" difficulty="hard" />
  </GameGate>
  <GameGate title="Javelot" name="javelottp" id="javelottp" class="hidden relative left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <GateButton id="javelotFacile" name="Facile" difficulty="easy" />
    <GateButton id="javelotMoyen" name="Moyen" difficulty="medium" />
  </GameGate>
  <Position
    id="position-1"
    position="1"
    class="hidden ml-24 absolute top-3/4 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <Position
    id="position-2"
    position="2"
    class="hidden ml-24 absolute top-3/4 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <Position
    id="position-3"
    position="3"
    class="hidden ml-24 absolute top-3/4 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <Position
    id="position-4"
    position="4"
    class="hidden ml-24 absolute top-3/4 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <Position
    id="position-5"
    position="5"
    class="hidden ml-24 absolute top-3/4 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <Position
    id="position-6"
    position="6"
    class="hidden ml-24 absolute top-3/4 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <MainOptions />
  <!-- RUNNINGGAME -->
  <CommandContainer
    name="COURIR"
    :keys="['s', 'd']"
    id="runningGame-command-container"
    class="hidden -mt-20 absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
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
    :timer="store.state.timer"
  />
  <Results
    title="100m"
    name="runningGame-results"
    id="runningGame-results"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="store.state.results" />
  </Results>
  <SpeedBar
    :min="0"
    :max="100"
    :speed="50"
    name="runningGame-speed-bar"
    id="runningGame-speed-bar"
    class="hidden absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="À vos marques"
    name="runningGame-text-1"
    id="runningGame-text-1"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Prêt ?"
    name="runningGame-text-2"
    id="runningGame-text-2"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Partez"
    name="runningGame-text-3"
    id="runningGame-text-3"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Finish
    name="runningGame-text-finish"
    id="runningGame-text-finish"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <SpeedBar
    name="runningGame-text-speedbar"
    id="runningGame-text-speedbar"
    class="hidden absolute left-1/2 bottom-10 transform -translate-x-1/2 -translate-y-1/2"
    :speed="store.state.setSpeedBar"
    :min="0"
    :max="2.7"
  />
  <KeyPressInteraction
    :keys="['s', 'd']"
    name="runningGame-keyPressed"
    id="runningGame-keyPressed"
    class="hidden absolute left-1/2 bottom-20 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <!-- NATATION -->
  <CommandContainer
    name="NAGER"
    :keys="['s', 'd']"
    id="natationGame-command-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="ACTION"
    :keys="['espace']"
    id="natationGame-action-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <ClassicButton
    text="Passer"
    name="natationGame-skip-button"
    id="natationGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Prêt"
    name="natationGame-ready-button"
    id="natationGame-ready-button"
    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
  />
  <Timer
    name="natationGame-timer"
    id="natationGame-timer"
    class="hidden absolute bottom-12 right-12"
    :timer="storeNatation.state.timer"
  />
  <Timer
    name="jumpGame-timer"
    id="jumpGame-timer"
    class="hidden absolute bottom-12 right-12"
    :timer="storeJump.state.timer"
  />
  <Results
    title="natation"
    name="natationGame-results"
    id="natationGame-results"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="storeNatation.state.results" />
  </Results>
  <SpeedBar
    :min="0"
    :max="100"
    :speed="50"
    name="natationGame-speed-bar"
    id="natationGame-speed-bar"
    class="hidden absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="À vos marques"
    name="natationGame-text-1"
    id="natationGame-text-1"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Prêt ?"
    name="natationGame-text-2"
    id="natationGame-text-2"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text=""
    name="natationGame-text-3"
    id="natationGame-text-3"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Finish
    name="natationGame-text-finish"
    id="natationGame-text-finish"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <SpeedBar
    name="natationGame-text-speedbar"
    id="natationGame-text-speedbar"
    class="hidden absolute left-1/2 bottom-10 transform -translate-x-1/2 -translate-y-1/2"
    :speed="store.state.setSpeedBar"
    :min="0"
    :max="0.3"
  />
  <KeyPressInteraction
    :keys="['s', 'd', ' ']"
    name="natationGame-keyPressed"
    id="natationGame-keyPressed"
    class="hidden absolute left-1/2 bottom-16 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <RDSText
    text="Plongez !"
    subText="Appuyez sur Espace"
    name="natationGame-text-plongeon"
    id="natationGame-text-plongeon"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Demi-tour !"
    subText="Appuyez sur Espace"
    name="natationGame-text-demitour"
    id="natationGame-text-demitour"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />

  <!-- Plongeon -->
  <CommandContainer
    name="FIGURES"
    :keys="['f', 'g', 'h', 'j']"
    width="260"
    id="plongeonGame-command-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="ACTION"
    :keys="['espace']"
    id="plongeonGame-action-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <ClassicButton
    text="Passer"
    name="plongeonGame-skip-button"
    id="plongeonGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Prêt"
    name="plongeonGame-ready-button"
    id="plongeonGame-ready-button"
    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
  />
  <RDSText
    text="3"
    name="plongeonGame-text-1"
    id="plongeonGame-text-1"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="2"
    name="plongeonGame-text-2"
    id="plongeonGame-text-2"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="1"
    name="plongeonGame-text-3"
    id="plongeonGame-text-3"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text=""
    name="plongeonGame-text-4"
    id="plongeonGame-text-4"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Plongez !"
    subText="Appuyez sur Espace"
    name="plongeonGame-text-plongeon"
    id="plongeonGame-text-plongeon"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Retenez !"
    name="plongeonGame-text-retenir"
    id="plongeonGame-text-retenir"
    class="hidden absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="À vous !"
    name="plongeonGame-text-avous"
    id="plongeonGame-text-avous"
    class="hidden absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <KeyLetters
    :keys="storePlongeon.state.letters"
    name="plongeonGame-suiteLetters"
    id="plongeonGame-suiteLetters"
    class="hidden absolute left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <KeyPressInteraction
    :keys="['f', 'g', 'h', 'j']"
    name="plongeonGame-keyPressed"
    id="plongeonGame-keyPressed"
    class="hidden absolute left-1/2 bottom-20 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <Score
    name="plongeonGame-score"
    id="plongeonGame-score"
    class="hidden absolute bottom-12 right-12"
    :score="storePlongeon.state.score"
  />
  <RDSText
    text="✅"
    name="plongeonGame-correct"
    id="plongeonGame-correct"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="❌"
    name="plongeonGame-incorrect"
    id="plongeonGame-incorrect"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Results
    title="plongeon"
    name="plongeonGame-results"
    id="plongeonGame-results"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="storePlongeon.state.results" />
  </Results>
  <Saut
    name="plongeonGame-text-finish"
    id="plongeonGame-text-finish"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />

  <!-- Tir à l'arc -->
  <ClassicButton
    text="Passer"
    name="tirArcGame-skip-button"
    id="tirArcGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Prêt"
    name="tirArcGame-ready-button"
    id="tirArcGame-ready-button"
    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
  />
  <RDSText
    text="3"
    name="tirArcGame-text-1"
    id="tirArcGame-text-1"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="2"
    name="tirArcGame-text-2"
    id="tirArcGame-text-2"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="1"
    name="tirArcGame-text-3"
    id="tirArcGame-text-3"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="En place !"
    name="tirArcGame-text-4"
    id="tirArcGame-text-4"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Score
    name="tirArcGame-score"
    id="tirArcGame-score"
    class="hidden absolute bottom-12 right-12"
    :score="storeTirArc.state.score"
  />
  <CommandContainer
    name="ACTION"
    :keys="['espace']"
    id="tirArcGame-action-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  /> 
  <CommandContainer
    name="VISÉE↕️"
    :keys="['V']"
    id="tirArcGame-vertical-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="VISÉE↔️"
    :keys="['H']"
    id="tirArcGame-horizontal-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <RDSText
    text="Tirez !"
    subText="Appuyez sur Espace"
    name="tirArcGame-text-tir"
    id="tirArcGame-text-tir"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Tir
    name="tirArcGame-text-finish"
    id="tirArcGame-text-finish"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Results
    title="tir à l'arc"
    name="tirArcGame-results"
    id="tirArcGame-results"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
  <ResultsContent :results="storeTirArc.state.results" />
  </Results>
  <div id="tirArcGame-verticalgui" class="hidden absolute top-1/3 left-2/3 transform -translate-x-1/2 -ml-24">
    <ArcheryContainer
      orientation="vertical"
      :ms="storeTirArc.state.speed"
      @update-position="positionV"
    />
  </div>
  <div id="tirArcGame-horizontalgui" class="hidden absolute top-2/3 left-1/2 transform -translate-x-1/2 mt-12">
    <ArcheryContainer
      orientation="horizontal"
      :ms="storeTirArc.state.speed"
      @update-position="positionH"
    />
  </div>

  <!-- Javelot -->
  <ClassicButton
    text="Passer"
    name="javelotGame-skip-button"
    id="javelotGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Prêt"
    name="javelotGame-ready-button"
    id="javelotGame-ready-button"
    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
  />
  <RDSText
    text="3"
    name="javelotGame-text-1"
    id="javelotGame-text-1"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="2"
    name="javelotGame-text-2"
    id="javelotGame-text-2"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="1"
    name="javelotGame-text-3"
    id="javelotGame-text-3"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="En place !"
    name="javelotGame-text-4"
    id="javelotGame-text-4"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Score
    name="javelotGame-score"
    id="javelotGame-score"
    class="hidden absolute bottom-12 right-12"
    :score="storeJavelot.state.score"
  />
  <CommandContainer
    name="ACTION"
    :keys="['espace']"
    id="javelotGame-action-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  /> 
  <CommandContainer
    name="VISÉE↕️"
    :keys="['V']"
    id="javelotGame-vertical-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="VISÉE↔️"
    :keys="['H']"
    id="javelotGame-horizontal-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <RDSText
    text="Lancez !"
    subText="Appuyez sur Espace"
    name="javelotGame-text-tir"
    id="javelotGame-text-tir"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Lancer
    name="javelotGame-text-finish"
    id="javelotGame-text-finish"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Results
    title="Javelot"
    name="javelotGame-results"
    id="javelotGame-results"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
  <ResultsContent :results="storeJavelot.state.results" />
  </Results>

  <!-- BOXE -->
  <ClassicButton
    text="Passer"
    name="boxeGame-skip-button"
    id="boxeGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Prêt"
    name="boxeGame-ready-button"
    id="boxeGame-ready-button"
    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
  />
  <RDSText
    text="3"
    name="boxeGame-text-1"
    id="boxeGame-text-1"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="2"
    name="boxeGame-text-2"
    id="boxeGame-text-2"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="1"
    name="boxeGame-text-3"
    id="boxeGame-text-3"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Fight !"
    name="boxeGame-text-4"
    id="boxeGame-text-4"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />

  
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MainOptions from "./MainOptions.vue";
import App from "../../src/models/App.ts";
import Dialog from "@/components/gui/Dialog.vue";
import ClassicButton from "@/components/landing/ClassicButton.vue";
import Timer from "@/components/gui/Timer.vue";
import ResultsContent from "@/components/gui/results/ResultsContent.vue";
import Results from "@/components/gui/results/Results.vue";
import KeyPressInteraction from "@/components/gui/KeyPressInteraction.vue";
import RDSText from "@/components/gui/running/RDSText.vue";
import Finish from "@/components/gui/running/Finish.vue";
import Saut from "@/components/gui/finish/Saut.vue";
import Tir from "@/components/gui/finish/Tir.vue";
import Lancer from "@/components/gui/finish/Lancer.vue";
import SpeedBar from "./gui/running/SpeedBar.vue";
import KeybindHint from "./gui/KeybindHint.vue";
import KeyLetters from "./gui/KeyLetters.vue";
import FoundObjectsContainer from "@/components/gui/foundobjects/FoundObjectsContainer.vue";
import GameGate from "./gui/tp/GameGate.vue";
import GateButton from "./gui/tp/GateButton.vue";
import Score from "@/components/gui/Score.vue";
import CommandContainer from "./gui/commands/CommandContainer.vue";
import Position from "./gui/Position.vue";
import { storeObjects } from "./gui/storeObjects";
import { store } from "@/components/gui/store.ts";
import { storeNatation } from "@/components/gui/storeNatation.ts";
import { storeJump } from "@/components/gui/storeJump.ts";
import { storePlongeon } from "@/components/gui/storePlongeon.ts";
import { storeTirArc } from "@/components/gui/storeTirArc.ts";

import Options from "./gui/options/Options.vue";
import OnboardingContainer from "@/components/gui/onboarding/OnboardingContainer.vue";
import { storeJavelot } from "./gui/storeJavelot";
import ArcheryContainer from "./gui/archery/ArcheryContainer.vue";

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
const objetRaquetteText = "Récupére la Raquette de tennis en appuyant sur R";
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
const tpGame = "Comeback later...";

const positionH = (position: number) => {
  // You can get the position in params from the child
  // console.log(position);
  storeTirArc.commit('setPosH', position);
};

const positionV = (position: number) => {
  // You can get the position in params from the child
  // console.log(position);
  storeTirArc.commit('setPosV', position);
};


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

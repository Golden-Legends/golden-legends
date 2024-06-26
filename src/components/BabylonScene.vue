<template>
  <canvas ref="bjsCanvas" />
  <!-- <SoundButton id="sound-button" class="absolute bottom-6 left-8 z-10" /> -->
  <KeybindHint
    class="absolute top-4 left-4"
    keybind="O"
    name="Menu"
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
      <button
        id="close-options"
        class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
      >
        <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
      </button>
      <span class="text-2xl">Music</span>
      <input
        id="son"
        type="range"
        min="0"
        max="100"
        :value="storeSound.state.sound"
        class="accent-black"
      />
    </div>
  </Options>
  <MapButton
    text="TPs"
    id="tp-button"
    class="hidden absolute -mt-36 top-1/4 left-1/4 ml-20"
  />
  <MapButton
    text="Jump"
    id="jump-button"
    class="hidden absolute mt-20 top-1/2 left-1/4 -ml-32"
  />
  <MapButton
    text="Forest"
    id="foret-button"
    class="hidden absolute mt-32 top-1/2 left-3/4 -ml-8"
  />
  <MapButton
    text="NPC"
    id="pnj-button"
    class="hidden absolute -mt-24 top-1/4 left-2/4 ml-20"
  />
  <!-- <KeybindHint
    class="absolute top-20 left-4"
    keybind="N"
    name="Objets trouvés"
    eventKey="n"
    id="objects-keybind"
  /> -->
  <KeybindHint
    class="absolute top-20 left-4"
    keybind="C"
    name="Map"
    eventKey="c"
    id="map-keybind"
  />
  <OnboardingContainer
    id="onboarding-container"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Aide
    id="aide-container"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Tips
    id="tips-container"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <FoundObjectsContainer
    title="objectsFound"
    name="objectsFound"
    :objects="storeObjects.state.objects"
    id="objectsFound"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Dialog
    name="Map"
    text="Golden Legends minimap"
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
  <ScoreboardContainer
    id="scoreboard-station-dialog"
    class="hidden absolute -top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
    class="hidden relative left-1/2 -top-1/2 mt-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  >
    <GateButton
      id="100mFacile"
      name="Easy"
      difficulty="easy"
      game="level100m"
    />
    <GateButton
      id="100mMoyen"
      name="Medium"
      difficulty="intermediate"
      game="level100m"
    />
    <GateButton
      id="100mDifficile"
      name="Hard"
      difficulty="hard"
      game="level100m"
    />
    <template #duel>
      <GateButton
        id="runningGame-duel"
        name="1v1"
        difficulty="easy"
        game="100m"
      />
    </template>
  </GameGate>
  <GameGate
    title="100m breaststroke"
    name="natationtp"
    id="natationtp"
    class="hidden relative left-1/2 -top-1/2 mt-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  >
    <GateButton
      id="natationFacile"
      name="Easy"
      difficulty="easy"
      game="levelNatation"
    />
    <GateButton
      id="natationMoyen"
      name="Medium"
      difficulty="intermediate"
      game="levelNatation"
    />
    <GateButton
      id="natationDifficile"
      name="Hard"
      difficulty="hard"
      game="levelNatation"
    />
  </GameGate>
  <GameGate
    title="Diving"
    name="plongeontp"
    id="plongeontp"
    class="hidden relative left-1/2 -top-1/2 mt-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  >
    <GateButton
      id="plongeonFacile"
      name="Easy"
      difficulty="easy"
      game="levelPlongeon"
    />
    <GateButton
      id="plongeonMoyen"
      name="Medium"
      difficulty="intermediate"
      game="levelPlongeon"
    />
    <GateButton
      id="plongeonDifficile"
      name="Hard"
      difficulty="hard"
      game="levelPlongeon"
    />
  </GameGate>
  <GameGate
    title="Boxing"
    name="boxetp"
    id="boxetp"
    class="hidden relative left-1/2 -top-1/2 mt-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  >
    <GateButton
      id="boxeFacile"
      name="Easy"
      difficulty="easy"
      game="levelBoxe"
    />
    <GateButton
      id="boxeMoyen"
      name="Medium"
      difficulty="intermediate"
      game="levelBoxe"
    />
    <GateButton
      id="boxeDifficile"
      name="Hard"
      difficulty="hard"
      game="levelBoxe"
    />
  </GameGate>
  <GameGate
    title="Archery"
    name="tirArctp"
    id="tirArctp"
    class="hidden relative left-1/2 -top-1/2 mt-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  >
    <GateButton
      id="tirArcFacile"
      name="Easy"
      difficulty="easy"
      game="levelTirArc"
    />
    <GateButton
      id="tirArcMoyen"
      name="Medium"
      difficulty="intermediate"
      game="levelTirArc"
    />
    <GateButton
      id="tirArcDifficile"
      name="Hard"
      difficulty="hard"
      game="levelTirArc"
    />
  </GameGate>
  <GameGate
    title="Javelin"
    name="javelottp"
    id="javelottp"
    class="hidden relative left-1/2 -top-1/2 mt-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  >
    <GateButton
      id="javelotFacile"
      name="Easy"
      difficulty="easy"
      game="levelJavelot"
    />
    <GateButton
      id="javelotMoyen"
      name="Medium"
      difficulty="intermediate"
      game="levelJavelot"
    />
    <GateButton
      id="javelotDifficile"
      name="Hard"
      difficulty="hard"
      game="levelJavelot"
    />
  </GameGate>
  <GameGate
    title="Tennis"
    name="tennistp"
    id="tennistp"
    class="hidden relative mt-24 left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  >
    <GateButton
      id="tennisBot"
      name="Against a bot"
      difficulty="easy"
      game="levelJavelot"
    />
    <GateButton
      id="tennisDuel"
      name="1v1"
      difficulty="easy"
      game="levelJavelot"
    />
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
  <!-- RUNNINGGAME -->
  <CommandContainer
    name="RUN"
    :keys="['s', 'd']"
    id="runningGame-command-container"
    class="hidden -mt-20 absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="RUN"
    :keys="['k', 'l']"
    id="runningGame-command-container-2"
    class="hidden -mt-20 absolute -top-2/3 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <GameHelpContainer
    id="runningGame-help"
    title="100m"
    class="hidden -mt-40 -top-3/4 left-1/2 transform -translate-x-1/2"
  >
    <button
      id="close-help-100m"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <template #commands>
      <CommandContainer class="w-fit" name="RUN" :keys="['s', 'd']" />
      <CommandContainer
        id="runningGame-help-2"
        class="w-fit hidden"
        name="RUN"
        :keys="['k', 'l']"
      />
    </template>
    <template #tips>
      <Info :content="['To run faster, alternate keys without mistaking !']" />
    </template>
    <div class="flex justify-center mt-4"></div>
  </GameHelpContainer>
  <ClassicButton
    text="Skip"
    name="runningGame-skip-button"
    id="runningGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Ready"
    name="runningGame-ready-button"
    id="runningGame-ready-button"
    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
  />
  <!-- TIMER J1 -->
  <Timer
    name="runningGame-timer"
    id="runningGame-timer"
    class="hidden absolute bottom-10 right-12"
    :timer="store.state.timer"
  />
  <SpeedBar
    name="runningGame-text-speedbar"
    id="runningGame-text-speedbar"
    class="hidden absolute left-1/2 bottom-10 transform -translate-x-1/2 -translate-y-1/2"
    :speed="store.state.setSpeedBar0"
    :min="0"
    :max="2.7"
  /><SpeedBar
    name="runningGame-text-speedbar1"
    id="runningGame-text-speedbar1"
    class="hidden absolute left-1/2 bottom-40 transform -translate-x-1/2 -translate-y-1/2"
    :speed="store.state.setSpeedBar0"
    :min="0"
    :max="2.7"
    player="Player 1"
  />
  <SpeedBar
    name="runningGame-text-speedbar0"
    id="runningGame-text-speedbar0"
    class="hidden absolute left-1/2 bottom-10 transform -translate-x-1/2 -translate-y-1/2"
    :speed="store.state.setSpeedBar1"
    :min="0"
    :max="2.7"
    player="Player 2"
  />
  <SpeedBar
    name="runningGame-text-speedbar1"
    id="runningGame-text-speedbar1"
    class="hidden absolute left-2/3 bottom-10 transform -translate-x-1/2 -translate-y-1/2"
    :speed="store.state.setSpeedBar1"
    :min="0"
    :max="2.7"
  />
  <Results
    title="100m"
    name="runningGame-results"
    id="runningGame-results"
    class="hidden left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="store.state.results" />
  </Results>
  <RDSText
    text="Ready ?"
    name="runningGame-text-1"
    id="runningGame-text-1"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Steady"
    name="runningGame-text-2"
    id="runningGame-text-2"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Go !"
    name="runningGame-text-3"
    id="runningGame-text-3"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Finish
    name="runningGame-text-finish"
    id="runningGame-text-finish"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <KeyPressInteraction
    :keys="['s', 'd']"
    name="runningGame-keyPressed"
    id="runningGame-keyPressed"
    class="hidden absolute left-1/2 bottom-20 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <!-- DUEL RUNNING GAME KEY PRESSED -->
  <KeyPressInteraction
    :keys="['s', 'd']"
    name="runningGame-keyPressed0"
    id="runningGame-keyPressed0"
    class="hidden absolute left-1/2 bottom-56 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <KeyPressInteraction
    :keys="['k', 'l']"
    name="runningGame-keyPressed1"
    id="runningGame-keyPressed1"
    class="hidden absolute left-1/2 bottom-40 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />

  <!-- NATATION -->
  <CommandContainer
    name="SWIM"
    :keys="['s', 'd']"
    id="natationGame-command-container"
    class="hidden absolute -mt-20 -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="ACTION"
    :keys="['space']"
    id="natationGame-action-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <GameHelpContainer
    id="natationgame-help"
    title="100m Breaststroke"
    class="hidden -mt-48 -top-3/4 left-1/2 transform -translate-x-1/2"
  >
    <button
      id="close-help-natation"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <template #commands>
      <CommandContainer class="w-fit" name="SWIM" :keys="['s', 'd']" />
      <CommandContainer name="ACTION" :keys="['space']" />
    </template>
    <template #tips>
      <Info
        :content="[
          'Press SPACE to dive and turning back.',
          'To swim faster, alternate keybinds without mistaking, a bad technique will slow you down...',
        ]"
      />
    </template>
    <div class="flex justify-center mt-4"></div>
  </GameHelpContainer>
  <ClassicButton
    text="Skip"
    name="natationGame-skip-button"
    id="natationGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Ready"
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
    title="100m breaststroke"
    name="natationGame-results"
    id="natationGame-results"
    class="hidden -mt-24 left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="storeNatation.state.results" />
  </Results>
  <RDSText
    text="Ready ?"
    name="natationGame-text-1"
    id="natationGame-text-1"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Steady ?"
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
    :speed="storeNatation.state.setSpeedBar"
    :min="0"
    :max="0.23"
  />
  <KeyPressInteraction
    :keys="['s', 'd', ' ']"
    name="natationGame-keyPressed"
    id="natationGame-keyPressed"
    class="hidden absolute left-1/2 bottom-44 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <RDSText
    text="Dive !"
    subText="Appuyez sur Espace"
    name="natationGame-text-plongeon"
    id="natationGame-text-plongeon"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Turn back !"
    subText="Appuyez sur Espace"
    name="natationGame-text-demitour"
    id="natationGame-text-demitour"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />

  <!-- Plongeon -->
  <CommandContainer
    name="ACTION"
    :keys="['space']"
    id="plongeonGame-action-container"
    class="hidden absolute -mt-20 -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="FIGURES"
    :keys="['f', 'g', 'h', 'j']"
    width="260"
    id="plongeonGame-command-container"
    class="hidden absolute -top-3/4 left-36 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <GameHelpContainer
    id="plongeongame-help"
    title="Plongeon"
    class="hidden -mt-48 -top-3/4 left-1/2 transform -translate-x-1/2"
  >
    <button
      id="close-help-plongeon"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <template #commands>
      <CommandContainer class="w-fit" name="ACTION" :keys="['espace']" />
      <CommandContainer
        name="FIGURES"
        width="260"
        :keys="['f', 'g', 'h', 'j']"
      />
    </template>
    <template #tips>
      <Info
        :content="[
          'Press ESPACE to dive.',
          'You have to remember a streak of letters and writing it back when needed.',
        ]"
      />
    </template>
    <div class="flex justify-center mt-4"></div>
  </GameHelpContainer>
  <ClassicButton
    text="Skip"
    name="plongeonGame-skip-button"
    id="plongeonGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Ready"
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
    text="Dive !"
    subText="Appuyez sur Espace"
    name="plongeonGame-text-plongeon"
    id="plongeonGame-text-plongeon"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Remember !"
    name="plongeonGame-text-retenir"
    id="plongeonGame-text-retenir"
    class="hidden absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="Your turn !"
    name="plongeonGame-text-avous"
    id="plongeonGame-text-avous"
    class="hidden absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <KeyLetters
    :keys="storePlongeon.state.letters"
    name="plongeonGame-suiteLetters"
    id="plongeonGame-suiteLetters"
    class="hidden absolute -mt-8 left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <KeyPressInteraction
    :keys="['f', 'g', 'h', 'j']"
    name="plongeonGame-keyPressed"
    id="plongeonGame-keyPressed"
    class="hidden absolute left-1/2 bottom-44 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <DiveCommands
    :keybinds="storePlongeon.state.letters"
    :index="storePlongeon.state.index"
    :result-state="storePlongeon.state.lettersBolleanArray"
    name="plongeonGame-diveCommands"
    id="plongeonGame-diveCommands"
    class="hidden absolute -mt-40 left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
    title="Diving"
    name="plongeonGame-results"
    id="plongeonGame-results"
    class="hidden -mt-40 left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
    text="Skip"
    name="tirArcGame-skip-button"
    id="tirArcGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Ready"
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
    text="On your mark !"
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
    :keys="['space']"
    id="tirArcGame-action-container"
    class="hidden absolute -mt-20 -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="AIMING↔️"
    :keys="['H']"
    id="tirArcGame-horizontal-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="AIMING↕️"
    :keys="['V']"
    id="tirArcGame-vertical-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <GameHelpContainer
    id="tirArcgame-help"
    title="Archery"
    class="hidden -mt-80 -top-3/4 left-1/2 transform -translate-x-1/2"
  >
    <button
      id="close-help-tirArc"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <template #commands>
      <CommandContainer name="ACTION" :keys="['ESPACE']" class="w-fit my-4" />
      <CommandContainer name="VISÉE↔️" :keys="['H']" class="w-fit my-4" />
      <CommandContainer name="VISÉE↕️" :keys="['V']" class="w-fit my-4" />
    </template>
    <template #tips>
      <Info
        :content="[
          'Press ESPACE to start.',
          'You have 2 gauges to aim the center of the target. Press H for horizontal aim, V for vertical aim.',
        ]"
      />
    </template>
    <div class="flex justify-center mt-4"></div>
  </GameHelpContainer>
  <RDSText
    text="Shoot !"
    subText="Press Space"
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
    title="Archery"
    name="tirArcGame-results"
    id="tirArcGame-results"
    class="hidden -mt-48 left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="storeTirArc.state.results" />
  </Results>
  <div
    id="tirArcGame-verticalgui"
    class="hidden absolute top-1/3 left-2/3 transform -translate-x-1/2 -ml-24"
  >
    <ArcheryContainer orientation="vertical" @update-position="positionV" />
  </div>
  <div
    id="tirArcGame-horizontalgui"
    class="hidden absolute top-2/3 left-1/2 transform -translate-x-1/2 mt-12"
  >
    <ArcheryContainer orientation="horizontal" @update-position="positionH" />
  </div>

  <!-- Javelot -->
  <ClassicButton
    text="Skip"
    name="javelotGame-skip-button"
    id="javelotGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Ready"
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
    text="Spam !"
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
    name="POWER"
    :keys="['s', 'd']"
    width="180"
    id="javelotGame-puissance-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <CommandContainer
    name="ANGLE"
    :keys="['space']"
    id="javelotGame-action-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <GameHelpContainer
    id="javelotgame-help"
    title="Javelot"
    class="hidden -mt-72 -top-3/4 left-1/2 transform -translate-x-1/2"
  >
    <button
      id="close-help-javelot"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <template #commands>
      <CommandContainer
        class="w-fit"
        name="POWER"
        :keys="['s', 'd']"
        width="180"
      />
      <CommandContainer name="ANGLE" :keys="['space']" />
    </template>
    <template #tips>
      <Info
        :content="[
          'Press SPACE to start.',
          'When the power bar will show, you\'ll have 5 seconds to spam S D to gain power.',
          'Then, after your power is set up, you\'ll adjust your angle by pressing SPACE (you can keep SPACE pressed to adjust the angle).',
        ]"
      />
    </template>
    <div class="flex justify-center mt-4"></div>
  </GameHelpContainer>
  <KeyPressInteraction
    :keys="['s', 'd']"
    name="F"
    id="javelotGame-keyPressed"
    class="hidden absolute left-1/2 -top-1/3 mt-4 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <RDSText
    text="Throw !"
    subText="Press SPACE"
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
    title="Javelin"
    name="javelotGame-results"
    id="javelotGame-results"
    class="hidden left-1/2 -top-3/4 -mt-16 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="storeJavelot.state.results" />
  </Results>
  <JavelinAngle
    id="javelotGame-angle"
    class="hidden absolute -ml-24 mt-4 top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <SpeedBar
    name="javelotGame-text-speedbar"
    id="javelotGame-text-speedbar"
    :speed="storeJavelot.state.speedBar"
    :min="0"
    :max="100"
    class="hidden -rotate-90 absolute -ml-36 top-2/3 -mt-11 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />

  <!-- BOXE -->
  <CommandContainer
    name="ACTION"
    :keys="['mouse']"
    id="boxeGame-action-container"
    class="hidden absolute -top-3/4 left-24 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <GameHelpContainer
    id="boxeGame-help"
    title="Boxing"
    class="hidden -mt-32 -top-3/4 left-1/2 transform -translate-x-1/2"
  >
    <button
      id="close-help-boxe"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <template #commands>
      <CommandContainer class="w-fit" name="ACTION" :keys="['souris']" />
    </template>
    <template #tips>
      <Info :content="['To strike, click on the target with your mouse.']" />
    </template>
    <div class="flex justify-center mt-4"></div>
  </GameHelpContainer>
  <ClassicButton
    text="Skip"
    name="boxeGame-skip-button"
    id="boxeGame-skip-button"
    class="hidden absolute bottom-12 right-12"
  />
  <ClassicButton
    text="Ready"
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
  <BoxingContainer
    id="boxeGame-container"
    class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Score
    name="boxeGame-score"
    id="boxeGame-score"
    class="hidden absolute bottom-12 right-12"
    :score="storeBoxe.state.score"
  />
  <Combat
    name="boxeGame-text-finish"
    id="boxeGame-text-finish"
    class="hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <Results
    title="Boxing"
    name="boxeGame-results"
    id="boxeGame-results"
    class="hidden -mt-28 left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="storeBoxe.state.results" />
  </Results>
  <!-- TENNISGAME GUI -->
  <GameHelpContainer
    id="tennis-help"
    title="Tennis"
    class="hidden -top-3/4 left-1/2 transform -translate-x-1/2"
  >
    <button
      id="close-help-tennis"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <template #commands>
      <CommandContainer
        class="w-fit"
        name="P1"
        :keys="['ArrowUp', 'ArrowDown']"
      />
      <CommandContainer
        id="tennis-help-2"
        class="w-fit"
        name="P2"
        :keys="['s', 'x']"
      />
    </template>
    <template #tips>
      <Info
        :content="[
          'You have to return as many balls as possible ! Multiplayer : 3 rounds to determine the winner.',
        ]"
      />
    </template>
    <div class="flex justify-center mt-4"></div>
  </GameHelpContainer>
  <GameHelpContainer
    id="tennis-help-solo"
    title="Tennis"
    class="hidden -top-3/4 left-1/2 transform -translate-x-1/2"
  >
    <button
      id="close-help-tennis-solo"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img src="../../public/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <template #commands>
      <CommandContainer
        class="w-fit"
        name="P1"
        :keys="['ArrowUp', 'ArrowDown']"
      />
    </template>
    <template #tips>
      <Info
        :content="[
          'You have to return as many balls as possible ! Multiplayer : 3 rounds to determine the winner.',
        ]"
      />
    </template>
    <div class="flex justify-center mt-4"></div>
  </GameHelpContainer>
  <RDSText
    text="3"
    name="tennis-text-1"
    id="tennis-text-1"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="2"
    name="tennis-text-2"
    id="tennis-text-2"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <RDSText
    text="1"
    name="tennis-text-3"
    id="tennis-text-3"
    class="hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <ClassicButton
    text="Ready"
    name="tennis-ready-button"
    id="tennis-ready-button"
    class="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
  />
  <Score
    name="tennis-score"
    id="tennis-score"
    class="hidden absolute bottom-12 right-12"
    :score="storeTennis.state.score"
  />
  <KeyPressInteraction
    :keys="['ArrowUp', 'ArrowDown']"
    name="tennis-keyPressed"
    id="tennis-keyPressed"
    class="hidden absolute left-1/3 bottom-20 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <KeyPressInteraction
    :keys="['s', 'x']"
    name="tennis-keyPressed0"
    id="tennis-keyPressed0"
    class="hidden absolute left-1/3 bottom-28 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <KeyPressInteraction
    :keys="['ArrowUp', 'ArrowDown']"
    name="tennis-keyPressed1"
    id="tennis-keyPressed1"
    class="hidden absolute left-2/3 bottom-40 transform -translate-x-1/2 -translate-y-1/2 w-fit"
  />
  <Results
    title="tennis"
    name="tennis-results"
    id="tennis-results"
    class="hidden -mt-40 left-1/2 -top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <ResultsContent :results="storeTennis.state.results" />
  </Results>
  <div
    id="loading-container"
    class="hidden fixed top-0 left-0 w-screen h-screen bg-white z-0"
  >
    <Loading
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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
import Combat from "@/components/gui/finish/Combat.vue";
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
import MapButton from "./gui/MapButton.vue";
import { storeObjects } from "./gui/storeObjects";
import { store } from "@/components/gui/store.ts";
import { storeNatation } from "@/components/gui/storeNatation.ts";
import { storeJump } from "@/components/gui/storeJump.ts";
import { storePlongeon } from "@/components/gui/storePlongeon.ts";
import { storeTirArc } from "@/components/gui/storeTirArc.ts";
import { storeSound } from "@/components/gui/storeSound.ts";
import { storeBoxe } from "@/components/gui/storeBoxe.ts";
import { storeTennis } from "@/components/gui/storeTennis.ts";

import Options from "./gui/options/Options.vue";
import OnboardingContainer from "@/components/gui/onboarding/OnboardingContainer.vue";
import GameHelpContainer from "@/components/gui/games/GameHelpContainer.vue";
import { storeJavelot } from "./gui/storeJavelot";
import ArcheryContainer from "./gui/archery/ArcheryContainer.vue";
import Aide from "@/components/gui/onboarding/Aide.vue";
import Tips from "@/components/gui/onboarding/Tips.vue";
import Info from "@/components/gui/games/Tips.vue";
import JavelinAngle from "@/components/gui/javelin/JavelinAngle.vue";
import BoxingContainer from "@/components/gui/boxing/BoxingContainer.vue";
import DiveCommands from "@/components/gui/dive/DiveCommands.vue";
import ScoreboardContainer from "@/components/gui/scoreboard/ScoreboardContainer.vue";
import Loading from "@/components/gui/Loading.vue";

const bjsCanvas = ref<HTMLCanvasElement | null>(null);
//Gladiator Dialogs
const jumpGameText =
  "Can you get to the end of the course without touching the water? Press R to start the game!";
const objectGameText =
  "8 objects relating to the Olympic Games are hidden around the city. Can you find them?";
const tpGameText =
  "Use the portals to teleport to different Olympic stadiums and challenge your friends!";
const footGameText = "Team football ⚽ or rugby 🏉 ? 😉";
//Objects message
const objetHaieText = "Retrieve the Olympic Hurdle by pressing R";
const objetgGantText = "Retrieve the Boxing Glove by pressing R";
const objetRaquetteText = "Retrieve the tennis racket by pressing R";
const objetBallonText = "Retrieve the basketball by pressing R";
const objetSkateText = "Retrieve the Skateboard by pressing R";
const objetArcText = "Retrieve the Olympic Arc by pressing R";
const objetChaussureText = "Retrieve running shoes by pressing R";
const objetVeloText = "Retrieve the Olympic Bike by pressing R";
const objetRecupText = "Item successfully collected!";
const allObjetRecupText = "All the Olympic objects have been collected!";
//jump message
const victoryJumpText =
  "You've managed to tame the moving platforms. You've unlocked 2 new characters,  go to the character selection screen!";
const loseJumpText = "Not this time... Take another chance!";
//scoreboard station
const stationScoreboard = "GUI Scoreboard TODO...";
//TP game
const tpGame = "Comeback later...";

const positionH = (position: number) => {
  // You can get the position in params from the child
  // console.log(position);
  storeTirArc.commit("setPosH", position);
};

const positionV = (position: number) => {
  // You can get the position in params from the child
  // console.log(position);
  storeTirArc.commit("setPosV", position);
};

// const updateSound = (event) => {
//   const newValue = event.target.value;
//   storeSound.commit('setSound', newValue);
//   setSoundVolume();
// }

// const setSoundVolume = () => {
//   if(storeSound.state.sound > storeSound.state.oldSound){
//     console.log(1+(storeSound.state.sound - storeSound.state.oldSound)/100)
//   }
//   else if(storeSound.state.sound < storeSound.state.oldSound){
//     console.log(1-(storeSound.state.oldSound - storeSound.state.sound)/100)
//   }
//   else{
//     console.log(1)
//   }
// }

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

import {
  Animation,
  Color3,
  FreeCamera,
  HemisphericLight,
  Mesh,
  Vector3,
} from "@babylonjs/core";
import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";
import { PlayerRunningGame } from "../../controller/PlayerRunningGame";
import { Bot } from "../../controller/Bot";
import RunningGameSettings from "@/../public/runningGame.json";
import { store } from "@/components/gui/store.ts";
import { Result } from "@/components/gui/results/ResultsContent.vue";
import { InGameState } from "../InGameState";
import { GameState } from "@/models/GameState.ts";
import { db } from "@/firebase.ts";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { handleNewRecord } from "@/services/result-service.ts";
import { timerToSMS } from "@/utils/utils.ts";
import { storeSound } from "@/components/gui/storeSound.ts";

interface line {
  start: string;
  end: string;
}

interface botInfo {
  name: string;
  speed: number;
  pathFile: string;
}

interface level {
  maxSpeed: number;
  botInfo: botInfo[];
}

interface IRunningGameState {
  placement: line[];
  level: {
    easy: level;
    intermediate: level;
    hard: level;
  };
}

export interface IPlayer {
  fileName: string;
  keys: { KeyLeft: string; KeyRight: string };
  color: Color3;
}

const ACCELERATION_FACTOR = 0.01;

const jouersSupplementaires: IPlayer[] = [
  {
    fileName: "perso3.glb",
    keys: { KeyLeft: "KeyK", KeyRight: "KeyL" },
    color: new Color3(1, 0, 0),
  },
  {
    fileName: "perso4.glb",
    keys: { KeyLeft: "KeyV", KeyRight: "KeyB" },
    color: new Color3(0, 1, 0),
  },
];

export class RunningGameState extends GameState {
  private readonly limitTime = 25;
  public _camera!: FreeCamera;
  private endGame: boolean = false;
  private raceStartTime: number = 0;

  private playerName: string = "PlayerPseudo";

  private botArray: Bot[] = [];
  private playerArray: PlayerRunningGame[] = [];

  private settings: IRunningGameState;
  private startPlacement: Mesh[] = [];
  private endPlacement: Mesh[] = [];

  private countdownInProgress: boolean = false;

  private isMultiplayer: boolean = false;
  private difficulty: "easy" | "intermediate" | "hard";
  private timer: number = 0;

  private results: Result[] = [];
  private scoreboardIsShow: boolean = false;
  private currentTime: number = 0;

  private posFinale: number = -1;
  private numberPlayer: number = 1;
  private timerPlayerArray: number[] = [0, 0, 0];

  constructor(
    game: Game,
    canvas: HTMLCanvasElement,
    difficulty?: "easy" | "intermediate" | "hard",
    multi?: boolean,
    numberPlayer?: number,
  ) {
    super(game, canvas);
    this.playerName = localStorage.getItem("username") || "Playertest";
    this.settings = RunningGameSettings;
    this.difficulty = difficulty ? difficulty : "easy";
    this.isMultiplayer = multi ? multi : false;
    this.numberPlayer = numberPlayer ? numberPlayer : 1;

    const soundActive = storeSound.state.etat;
    if (!soundActive) {
      this.game.playTrack("100m");
    } else {
      this.game.changeActive("100m");
    }
  }

  async enter(): Promise<void> {
    try {
      //load the gui iin the mainmenu and not here only for prod
      this.game.engine.displayLoadingUI();
      this.scene.detachControl();

      // Inspector.Show(this.scene, {});
      await this.setEnvironment();
      this.createLight();
      this.setLinePlacement();

      // init player
      const getFileName = localStorage.getItem("pathCharacter");
      const firstPlayer: IPlayer = {
        keys: { KeyLeft: "KeyS", KeyRight: "KeyD" },
        fileName: getFileName ? getFileName : "character1.glb",
        color: new Color3(0, 0, 1),
      };

      await this.initPlayer(2, this.playerName, firstPlayer);
      // on init le jeu
      if (this.isMultiplayer) {
        // ON EST DANS LE MODE MULTI ON CREER NOS JOUEURS SUPPLEMENTAIRES
        for (let i = 1; i < this.numberPlayer; i++) {
          await this.initPlayer(
            2,
            this.playerName + "_" + i,
            jouersSupplementaires[i - 1],
          );
        }
      }

      await this.runSoloGame();
      this.runUpdateAndRender();

      this._camera = new FreeCamera(
        "camera100m",
        new Vector3(-2, 10, 20),
        this.scene,
      );
      this._camera.rotation = new Vector3(0, Math.PI, 0);

      const target = new Vector3(
        -9.704194068908691,
        2.3620247840881348,
        -37.589664459228516,
      );
      this._camera.setTarget(target);

      document.getElementById("map-keybind")!.classList.add("hidden");
      document.getElementById("100mtp")!.classList.add("hidden");
      document
        .getElementById("runningGame-skip-button")!
        .classList.remove("hidden");
      document.getElementById("runningGame-help")!.classList.remove("hidden");
      this.addEventListenerById("close-help-100m", "click", () => {
        document.getElementById("runningGame-help")!.classList.add("hidden");
      });
      document
        .getElementById("runningGame-command-container")!
        .classList.remove("hidden");
      this.addEventListenerById("runningGame-skip-button", "click", () => {
        document.getElementById("runningGame-help")!.classList.add("hidden");
        this.scene.stopAnimation(this._camera);
        this.AfterCamAnim();
      });

      await this.scene.whenReadyAsync();
      this.scene.attachControl();
      this.game.engine.hideLoadingUI();

      this.CreateCameraMouv().then(() => {
        document
          .getElementById("runningGame-ready-button")!
          .classList.remove("hidden");
        document.getElementById("runningGame-help")!.classList.add("hidden");
        this.addEventListenerById("runningGame-ready-button", "click", () => {
          this.startCountdown([
            "runningGame-text-1",
            "runningGame-text-2",
            "runningGame-text-3",
          ]);
          this.AfterCamAnim();
          if (this.isMultiplayer) {
            this.initGuiMulti();
          } else {
            this.initGuiSolo();
          }
          document
            .getElementById("runningGame-ready-button")!
            .classList.add("hidden");
          this.game.canvas.focus();
          document
            .getElementById("runningGame-skip-button")!
            .classList.add("hidden");
        });
      });
    } catch (error) {
      throw new Error("erreur -> " + error);
    }
  }

  public async initPlayer(
    index: number,
    playerName: string,
    settignsPlayer: IPlayer,
  ): Promise<void> {
    const player = new PlayerRunningGame(
      playerName,
      this.startPlacement[index].getAbsolutePosition().x || 0,
      this.startPlacement[index].getAbsolutePosition().y || 0,
      this.startPlacement[index].getAbsolutePosition().z || 0,
      this.scene,
      this.endPlacement[index],
      settignsPlayer,
    );
    await player.init();

    this.startPlacement.splice(index, 1);
    this.endPlacement.splice(index, 1);

    this.playerArray.push(player);
  }

  /**
   *
   * @description Permet de lancer le jeu en solo
   * @description Allows you to start the game solo
   */
  private async runSoloGame() {
    // mettre de l'aléatoire dans les positions des bots
    {
      this.startPlacement, this.endPlacement;
    }
    this.shuffleArray(this.startPlacement, this.endPlacement);
    await this.initSoloWithBot(this.difficulty);
    this.buildScoreBoard();
  }

  initGuiMulti() {
    this.timer = 0;
    this.raceStartTime = 0;
    this.endGame = false;
    this.scoreboardIsShow = false;
    this.currentTime = 0;

    document
    .getElementById("runningGame-command-container-2")!
    .classList.remove("hidden");
    
    document.getElementById("runningGame-timer")!.classList.remove("hidden");

    // set les valeurs du store
    this.playerArray.forEach((player, index) => {
      store.commit("setTimer" + index, 0.0);
      store.commit("setSpeedBar" + index, 0);
      document
      .getElementById("runningGame-text-speedbar" + index)!
      .classList.remove("hidden");
      document
      .getElementById("runningGame-keyPressed" + index)!
      .classList.remove("hidden");
    });
  } 

  initGuiSolo() {
    this.timer = 0;
    this.raceStartTime = 0;
    this.endGame = false;
    this.scoreboardIsShow = false;
    this.currentTime = 0;

    document.getElementById("runningGame-timer")!.classList.remove("hidden");
    document
      .getElementById("runningGame-keyPressed")!
      .classList.remove("hidden");
    document
      .getElementById("runningGame-text-speedbar")!
      .classList.remove("hidden");

    this.playerArray.forEach((player, index) => {
      store.commit("setTimer" + index, 0.0);
      store.commit("setSpeedBar" + index, 0);

      document
        .getElementById("runningGame-text-speedbar" + index)!
        .classList.remove("hidden");
        document
        .getElementById("runningGame-keyPressed" + index)!
        .classList.remove("hidden");
    });
  }

  /**
   *
   * @param countdownElements
   * @returns
   * @description Permet de démarrer le compte à rebours
   * @description Allows you to start the countdown
   */
  private startCountdown(countdownElements: string[]) {
    if (this.countdownInProgress) return; // Évite de démarrer le compte à rebours multiple fois
    let countdownIndex = 0;
    let previousElement = "";

    const countdownInterval = setInterval(() => {
      const countdownElement = countdownElements[countdownIndex];
      if (previousElement !== "")
        document.getElementById(previousElement)!.classList.add("hidden");
      document.getElementById(countdownElement)!.classList.remove("hidden");
      previousElement = countdownElement;
      countdownIndex++;

      if (countdownIndex >= countdownElements.length) {
        clearInterval(countdownInterval);

        // Cache le dernier élément après une seconde
        setTimeout(() => {
          document.getElementById(previousElement)!.classList.add("hidden");
        }, 1000);

        // Permet au joueur de jouer ou exécutez d'autres actions nécessaires
        this.countdownInProgress = true;
        this.raceStartTime = performance.now();
      }
    }, 1000);
  }

  async exit(): Promise<void> {
    console.log("exit running game");

    document.getElementById("runningGame-timer")!.classList.add("hidden");
    document.getElementById("runningGame-keyPressed")!.classList.add("hidden");
    document
      .getElementById("runningGame-text-speedbar")!
      .classList.add("hidden");
    document.getElementById("runningGame-results")!.classList.add("hidden");
    document.getElementById("runningGame-text-finish")!.classList.add("hidden");
    document
      .getElementById("runningGame-command-container")!
      .classList.add("hidden");
    if (this.isMultiplayer) {
      document
      .getElementById("runningGame-command-container-2")!
      .classList.add("hidden");
      this.playerArray.forEach((player, index) => {
        document
        .getElementById("runningGame-text-speedbar" + index)!
        .classList.add("hidden");
        document
        .getElementById("runningGame-keyPressed" + index)!
        .classList.add("hidden");
      });
    }
  
    this.undisplayPosition();
    this.cleanup();
  }

  buildScoreBoard(): void {
    let index = 1;
    this.playerArray.forEach((bot) => {
      this.results.push({
        place: index,
        name: bot.getName(),
        result: "No score !",
      });
      index++;
    });
    this.botArray.forEach((bot, index) => {
      this.results.push({
        place: index + 2,
        name: bot.getName(),
        result: "No score !",
      });
      index++;
    });
    store.commit("setResults", this.results);
  }

  async handleResult(): Promise<void> {
    for (const player of this.playerArray) {
      if (!player.getIsEndGame()) continue;
      const playerScore = Math.round(player.getEndTime() - this.raceStartTime);
      await handleNewRecord("running", Number(playerScore), player.getName());
    }
  }

  async showScoreBoard(): Promise<void> {
    document
      .getElementById("runningGame-text-finish")!
      .classList.remove("hidden");

    await this.handleResult();

    // attendre 2 secondes avant d'afficher le tableau des scores
    setTimeout(() => {
      this.createFinaleScoreBoard();
      if (!this.isMultiplayer) {
        this.displayPosition();
      }
      document
        .getElementById("runningGame-text-finish")!
        .classList.add("hidden");
      document
        .getElementById("runningGame-keyPressed")!
        .classList.add("hidden");
      document
        .getElementById("runningGame-text-speedbar")!
        .classList.add("hidden");
      document
        .getElementById("runningGame-results")!
        .classList.remove("hidden");
      this.addEventListenerByQuerySelector(
        "#runningGame-results #continue-button",
        "click",
        () => {
          this.game.changeState(new InGameState(this.game, this.game.canvas));
        },
      );
      this.addEventListenerByQuerySelector(
        "#runningGame-results #replay-button",
        "click",
        () => {
          this.game.changeState(
            new RunningGameState(
              this.game,
              this.game.canvas,
              this.difficulty,
              this.isMultiplayer,
              this.numberPlayer
            ),
          );
        },
      );
    }, 2000);
  }

  public displayPosition() {
    switch (this.posFinale) {
      case 1:
        document.getElementById("position-1")!.classList.remove("hidden");
        break;
      case 2:
        document.getElementById("position-2")!.classList.remove("hidden");
        break;
      case 3:
        document.getElementById("position-3")!.classList.remove("hidden");
        break;
      case 4:
        document.getElementById("position-4")!.classList.remove("hidden");
        break;
      case 5:
        document.getElementById("position-5")!.classList.remove("hidden");
        break;
      case 6:
        document.getElementById("position-6")!.classList.remove("hidden");
        break;
      default:
        console.log("Position non trouvée");
        break;
    }
  }

  public undisplayPosition() {
    switch (this.posFinale) {
      case 1:
        document.getElementById("position-1")!.classList.add("hidden");
        break;
      case 2:
        document.getElementById("position-2")!.classList.add("hidden");
        break;
      case 3:
        document.getElementById("position-3")!.classList.add("hidden");
        break;
      case 4:
        document.getElementById("position-4")!.classList.add("hidden");
        break;
      case 5:
        document.getElementById("position-5")!.classList.add("hidden");
        break;
      case 6:
        document.getElementById("position-6")!.classList.add("hidden");
        break;
      default:
        console.log("Position non trouvée");
        break;
    }
  }

  createFinaleScoreBoard() {
    const resultsTemp: Result[] = [];

    // Résultat du joueur
    let index = 1;
    this.playerArray.forEach((player) => {
      const playerRes = player.getEndTime()
        ? timerToSMS(Math.round(player.getEndTime() - this.raceStartTime))
        : "no score";
      resultsTemp.push({
        place: index,
        name: player.getName(),
        result: playerRes,
      });
      index++;
    });

    // Résultats des bots
    this.botArray.forEach((bot) => {
      const botResult = bot.getEndTime()
        ? timerToSMS(Math.round(bot.getEndTime() - this.raceStartTime))
        : "no score";
      resultsTemp.push({
        place: index + 1,
        name: bot.getName(),
        result: botResult,
      });
      index++;
    });

    // Tri des résultats
    this.results = resultsTemp.sort((a, b) => {
      if (a.result === "no score") return 1; // Si le résultat de a est "no score", a est considéré comme plus grand
      if (b.result === "no score") return -1; // Si le résultat de b est "no score", b est considéré comme plus grand
      return parseFloat(a.result) - parseFloat(b.result); // Sinon, on compare les résultats normalement
    });
    this.results.forEach((result, index) => {
      result.place = index + 1;
    });

    this.posFinale =
      this.results.findIndex((result) => result.name === this.playerName) + 1;

    if (this.posFinale === 1 || this.posFinale === 2 || this.posFinale === 3) {
      if (
        this.difficulty === "easy" &&
        localStorage.getItem("level100m") === "easy"
      ) {
        localStorage.setItem("level100m", "intermediate");
      }
      if (
        this.difficulty === "intermediate" &&
        localStorage.getItem("level100m") === "intermediate"
      ) {
        localStorage.setItem("level100m", "hard");
      }
    }

    // Enregistrement des résultats dans le store
    store.commit("setResults", this.results);
  }

  /**
   *
   * @returns
   * @description Permet de mettre à jour le jeu
   * @description Allows you to update the game
   */
  update(): void {
    try {
      if (
        this.playerArray.every((bot) => bot.getIsEndGame()) &&
        this.botArray.every((bot) => bot.getIsEndGame())
      ) {
        this.endGame = true;
      }

      if (this.endGame && !this.scoreboardIsShow) {
        this.scoreboardIsShow = true;
        this.showScoreBoard();
        console.log("Game over: All players have finished.");
        return;
      }

      if (this.endGame) return;
      if (!this.countdownInProgress) return;
      this.currentTime = performance.now();
      const deltaTime = this.scene.getEngine().getDeltaTime();
      this.checkGameIsOutOfTime();

      this.playerPlay(deltaTime);

      this.botArray.forEach((bot) => {
        bot.play(deltaTime, this.currentTime);
      });

      // TODO : voir pour gérer le timer correctement
      this.playerArray.forEach((player, index) => {
        if (!player.getIsEndGame()) {
          this.timer = Math.round(this.currentTime - this.raceStartTime);
          this.timerPlayerArray[index] = this.timer;
          store.commit("setTimer" + index, this.timer);
          store.commit("setSpeedBar" + index, player.getSpeed());
        }
      });
    } catch (error) {
      throw new Error("error : Running game class update." + error);
    }
  }

  private playerPlay(deltaTime: number) {
    let minZ = this._camera.position.z;
    let maxZ = this._camera.position.z;

    this.playerArray.forEach((player) => {
      player.play(deltaTime, this.currentTime);
      if (player.transform.position.z < minZ) {
        minZ = player.transform.position.z;
      }
      if (player.transform.position.z > maxZ) {
        maxZ = player.transform.position.z;
      }
    });
    if (minZ !== maxZ) {
      // Calculer le milieu entre les deux joueurs sur l'axe x
      const midPointZ = (minZ + maxZ) / 2;

      // Calculer la différence entre la position x de la caméra et le milieu
      const diffZ = midPointZ - this._camera.position.z;
      // Calculer le vecteur d'accélération (vous pouvez ajuster le facteur d'accélération comme vous le souhaitez)
      const accelerationZ = diffZ * deltaTime * (ACCELERATION_FACTOR + 0.1);
      if (this._camera.position.z + accelerationZ > -31.21) {
        // Mettre à jour la position x de la caméra
        this._camera.position.z += accelerationZ;
      }
      let distance = Math.abs(Math.round(maxZ - minZ));
      // si l'écart du milieu entre les joueurs est trop grand on déplace la caméra
      if (distance > 10) {
        if (this._camera.position.y < 30) {
          this._camera.position.y += deltaTime * ACCELERATION_FACTOR;
        }
        if (this._camera.position.x < 35) {
          this._camera.position.x += deltaTime * ACCELERATION_FACTOR;
        }
      } else {
        if (this._camera.position.y >= 22) {
          this._camera.position.y -= deltaTime * ACCELERATION_FACTOR;
        }
        if (this._camera.position.x >= 22) {
          this._camera.position.x -= deltaTime * ACCELERATION_FACTOR;
        }
      }
    } else {
      this._camera.position.z = minZ;
    }
  }

  checkGameIsOutOfTime() {
    // regarde si la course dure plus de 25 secondes
    const elapsedTime = (this.currentTime - this.raceStartTime) / 1000;
    // affiche le temps dans la console
    if (elapsedTime > this.limitTime) {
      this.endGame = true;
      console.log("Game over: Time limit reached.");
      if (!this.scoreboardIsShow) {
        this.showScoreBoard();
      }
      return;
    }
  }

  /**
   *
   * @param difficulty
   * @description Permet d'initialiser le jeu en solo avec des bots en mettant une difficulter
   * @description Allows you to initialize the game solo with bots by putting a difficulty
   */
  private async initSoloWithBot(difficulty: string) {
    const infoBot = this.settings.level[difficulty].botInfo;
    for (let i = 0; i < 5; i++) {
      const startMesh = this.startPlacement[i];
      const endMesh = this.endPlacement[i];
      if (startMesh && endMesh) {
        const bot = new Bot(
          "bot" + i,
          startMesh.getAbsolutePosition(),
          endMesh as Mesh,
          this.scene,
          infoBot[i].pathFile,
          infoBot[i].speed,
        );
        await bot.init();
        this.botArray.push(bot);
      }
    }
  }

  async setEnvironment(): Promise<void> {
    try {
      const maps = new runningGameEnv(this.scene);
      await maps.load();
    } catch (error) {
      throw new Error("Method not implemented.");
    }
  }

  /**
   * @description Permet de récupérer les positions de départ et d'arrivée des joueurs
   * @description Allows you to get the start and end positions of the players
   */
  private setLinePlacement() {
    const startTab: Mesh[] = [];
    const endTab: Mesh[] = [];
    const placement = this.settings.placement;
    placement.forEach((line) => {
      const startMesh = this.scene.getMeshByName(line.start) as Mesh;
      const endMesh = this.scene.getMeshByName(line.end) as Mesh;
      startMesh.isVisible = false;
      endMesh.isVisible = false;
      if (startMesh && endMesh) {
        startTab.push(startMesh);
        endTab.push(endMesh);
      }
    });
    this.startPlacement = startTab;
    this.endPlacement = endTab;
  }

  private createLight() {
    const light = new HemisphericLight(
      "light",
      new Vector3(0, 2, 0),
      this.scene,
    );
    light.intensity = 0.7;
  }

  /**
   *
   * @param array1
   * @param array2
   * @returns
   * @description Mélange deux tableaux en même temps me permet
   * de garder la correspondance entre les positions de début et de fin de course
   * @description Shuffle two arrays at the same time allows me to keep the correspondence
   * between the start and end positions
   */
  private shuffleArray(array1: any[], array2: any[]) {
    for (let i = array1.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Génère un indice aléatoire entre 0 et i inclus
      [array1[i], array1[j]] = [array1[j], array1[i]]; // Échange les éléments à l'indice i et j
      [array2[i], array2[j]] = [array2[j], array2[i]]; // Échange les éléments à l'indice i et j
    }
    return { array1, array2 };
  }

  // CAMERA EARLY
  async CreateCameraMouv(): Promise<void> {
    const fps = 60;
    const camAnim = new Animation(
      "camAnim",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      true,
    );

    const rotationAnim = new Animation(
      "rotationAnim",
      "rotation",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      true,
    );

    const camKeys: { frame: number; value: Vector3 }[] = [];
    const rotationKeys: { frame: number; value: Vector3 }[] = [];

    camKeys.push({ frame: 0, value: new Vector3(-2, 10, 20) });
    camKeys.push({ frame: 6 * fps, value: new Vector3(-15, 2, -30) });
    camKeys.push({ frame: 11 * fps, value: new Vector3(0.5, 2, -30) });
    camKeys.push({ frame: 12 * fps, value: new Vector3(0.5, 2, -30) });
    camKeys.push({ frame: 16 * fps, value: new Vector3(-6, 6, -10) });
    camKeys.push({ frame: 17 * fps, value: new Vector3(-6, 6, -10) });
    camKeys.push({ frame: 21 * fps, value: new Vector3(22.72, 22.07, -31.21) });

    rotationKeys.push({ frame: 0, value: new Vector3(0, -Math.PI, 0) });
    rotationKeys.push({ frame: 6 * fps, value: new Vector3(0, Math.PI, 0) });
    rotationKeys.push({ frame: 11 * fps, value: new Vector3(0, Math.PI, 0) });
    rotationKeys.push({ frame: 12 * fps, value: new Vector3(0, Math.PI, 0) });
    rotationKeys.push({ frame: 16 * fps, value: new Vector3(0, Math.PI, 0) });
    rotationKeys.push({ frame: 17 * fps, value: new Vector3(0, Math.PI, 0) });
    rotationKeys.push({
      frame: 21 * fps,
      value: new Vector3(
        0.5737997121226636,
        -1.7815811050152932 + 2 * Math.PI,
        0,
      ),
    });

    camAnim.setKeys(camKeys);
    rotationAnim.setKeys(rotationKeys);

    this._camera.animations.push(camAnim);
    this._camera.animations.push(rotationAnim);

    await this.scene.beginAnimation(this._camera, 0, 21 * fps).waitAsync();
    document.getElementById("runningGame-skip-button")!.classList.add("hidden");
  }

  AfterCamAnim(): void {
    this._camera.dispose();
    this._camera = this.createCameraPlayer(this.playerArray[0].transform);
  }

  private createCameraPlayer(mesh: Mesh): FreeCamera {
    const camera = new FreeCamera(
      "camera1",
      new Vector3(22.72, 22.07, -31.21),
      this.scene,
    );
    camera.setTarget(
      new Vector3(mesh.position.x, mesh.position.y, mesh.position.z),
    );
    return camera;
  }
}

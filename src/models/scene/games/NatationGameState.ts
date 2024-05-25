import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { natationGameEnv } from "@/models/environments/natatonGameEnv";
import {
  Animation,
  Color3,
  FreeCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Texture,
  Vector3,
} from "@babylonjs/core";
import NatationGameSettings from "@/../public/natationGameSettings.json";
import { PlayerNatationGame } from "@/models/controller/PlayerNatationGame";
import { storeNatation } from "@/components/gui/storeNatation";
import { InGameState } from "../InGameState";
import { Result } from "@/components/gui/results/ResultsContent.vue";
import { BotNatation } from "@/models/controller/BotNatation";
import { PlayerInputNatationGame } from "@/models/inputsMangement/PlayerInputNatationGame";
import { SkyMaterial, WaterMaterial } from "@babylonjs/materials";

interface line {
  start: string;
  firstEnd: string;
  secondEnd: string;
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

interface INatationGameState {
  placement: line[];
  level: {
    easy: level;
    intermediate: level;
    hard: level;
  };
}

export class NatationGameState extends GameState {
  private difficulty: "easy" | "intermediate" | "hard";
  private isMultiplayer: boolean;
  public _camera!: FreeCamera;

  private settings: INatationGameState;
  private startPlacement: Mesh[] = [];
  private firstEndPlacement: Mesh[] = [];
  private secondEndPlacement: Mesh[] = [];

  private player!: PlayerNatationGame;
  private playerName: string;
  private _input: PlayerInputNatationGame;

  private botArray: BotNatation[] = [];

  private results: Result[] = [];
  private scoreboardIsShow: boolean = false;
  private currentTime: number = 0;
  private raceStartTime: number = 0;
  private timer: number = 0;
  private endGame: boolean = false;

  private countdownInProgress: boolean = false;
  private readonly limitTime = 35;

  private continueButtonIsPressed: boolean = false;
  private rectangleReturn: Mesh;

  public waterMaterial!: WaterMaterial;
  private skyBox!: Mesh;

  private posFinale: number = -1;

  constructor(
    game: Game,
    canvas: HTMLCanvasElement,
    difficulty?: "easy" | "intermediate" | "hard",
    multi?: boolean,
  ) {
    super(game, canvas);
    this.difficulty = difficulty ? difficulty : "easy";
    this.isMultiplayer = multi ? multi : false;
    this.settings = NatationGameSettings;
    this._input = new PlayerInputNatationGame(this.scene);
    this.playerName = localStorage.getItem("username") || "Playertest";
    this.rectangleReturn = MeshBuilder.CreateBox("rectangleReturn");
    this.game.playTrack("100m");
  }

  async enter(): Promise<void> {
    try {
      //load the gui iin the mainmenu and not here only for prod
      this.game.engine.displayLoadingUI();
      this.scene.detachControl();

      document.getElementById("map-keybind")!.classList.add("hidden");

      // Inspector.Show(this.scene, {});
      await this.setEnvironment();
      this.invisiblePlatform();
      // this.createSkybox();
      this.addTextureEau();
      this.createLight();
      this.setLinePlacement();

      // Init player
      await this.initPlayer();

      // lancer le bon mode de jeu
      // on init le jeu
      if (!this.isMultiplayer) {
        await this.runSoloGame();
      }

      this.runUpdateAndRender();

      this._camera = new FreeCamera(
        "cameraNatation",
        new Vector3(4.78, 2, 20),
        this.scene,
      );
      // Vector3(4.78, 3.27, 6.38)

      // this._camera.rotation = new Vector3(0, -Math.PI, 0);
      this._camera.setTarget(this.player.transform.position);
      // console.log(this._camera.rotation);
      // console.log(this._camera.position);

      document.getElementById("map-keybind")!.classList.add("hidden");
      document.getElementById("natationtp")!.classList.add("hidden");
      document
        .getElementById("natationGame-skip-button")!
        .classList.remove("hidden");
      document.getElementById("natationgame-help")!.classList.remove("hidden");
      this.addEventListenerById("close-help-natation", "click", () => {
        document.getElementById("natationgame-help")!.classList.add("hidden");
      });
      document
        .getElementById("natationGame-command-container")!
        .classList.remove("hidden");
      document
        .getElementById("natationGame-action-container")!
        .classList.remove("hidden");
      this.addEventListenerById("natationGame-skip-button", "click", () => {
        document.getElementById("natationgame-help")!.classList.add("hidden");
        this.scene.stopAnimation(this._camera);
        this.AfterCamAnim();
      });

      await this.scene.whenReadyAsync(); // on attends que la scene soit bien chargé
      this.scene.attachControl();
      this.game.engine.hideLoadingUI();

      this.CreateCameraMouv().then(() => {
        document
          .getElementById("natationGame-ready-button")!
          .classList.remove("hidden");
        document
          .getElementById("natationGame-skip-button")!
          .classList.add("hidden");
        document.getElementById("natationgame-help")!.classList.add("hidden");
        this.addEventListenerById("natationGame-ready-button", "click", () => {
          this.startCountdown([
            "natationGame-text-1",
            "natationGame-text-2",
            "natationGame-text-3",
          ]);
          this.AfterCamAnim();
          this.initGui();
          document
            .getElementById("natationGame-ready-button")!
            .classList.add("hidden");
          this.game.canvas.focus();
        });
      });
    } catch (error) {
      throw new Error(`error in enter method : ${error}`);
    }
  }
  async exit(): Promise<void> {
    try {
      console.log("exit natation game");

      document.getElementById("natationGame-timer")!.classList.add("hidden");
      document
        .getElementById("natationGame-keyPressed")!
        .classList.add("hidden");
      document
        .getElementById("natationGame-text-speedbar")!
        .classList.add("hidden");
      document
        .getElementById("natationGame-text-finish")!
        .classList.add("hidden");
      document.getElementById("natationGame-results")!.classList.add("hidden");
      document
        .getElementById("natationGame-command-container")!
        .classList.add("hidden");
      document
        .getElementById("natationGame-action-container")!
        .classList.add("hidden");
      this.undisplayPosition();

      storeNatation.commit("setTimer", 0.0);
      storeNatation.commit("setSpeedBar", 0);
      storeNatation.commit("setResults", []);

      this.cleanup();
    } catch {
      throw new Error("Method not implemented.");
    }
  }

  // LOGIQUE DE JEU
  update(): void {
    try {
      if (
        this.player.getIsEndGame() &&
        this.botArray.every((bot) => bot.getIsEndGame())
      ) {
        this.endGame = true;
      }
      if (this.endGame) {
        if (!this.scoreboardIsShow) {
          this.showScoreBoard();
        }
      } else {
        if (this.countdownInProgress) {
          this.currentTime = performance.now();
          const deltaTime = this.scene.getEngine().getDeltaTime();
          this.checkGameIsOutOfTime();
          this.player.play(deltaTime, this.currentTime);
          this.botArray.forEach((bot) => {
            bot.play(deltaTime, this.currentTime);
          });

          if (!this.player.getIsEndGame()) {
            this.timer = Math.round(this.currentTime - this.raceStartTime);
            storeNatation.commit("setTimer", this.timer);
          }
        }
      }
    } catch (error) {
      throw new Error("error : Running game class update." + error);
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

  private setLinePlacement() {
    const startTab: Mesh[] = [];
    const firstEndTab: Mesh[] = [];
    const secondEndTab: Mesh[] = [];
    const placement = this.settings.placement;
    placement.forEach((line) => {
      const startMesh = this.scene.getMeshByName(line.start) as Mesh;
      const firstEndMesh = this.scene.getMeshByName(line.firstEnd) as Mesh;
      const secondEndMesh = this.scene.getMeshByName(line.secondEnd) as Mesh;
      startMesh.isVisible = false;
      firstEndMesh.isVisible = false;
      secondEndMesh.isVisible = false;

      if (startMesh && firstEndMesh) {
        startTab.push(startMesh);
        firstEndTab.push(firstEndMesh);
        secondEndTab.push(secondEndMesh);
      }
    });
    this.startPlacement = startTab;
    this.firstEndPlacement = firstEndTab;
    this.secondEndPlacement = secondEndTab;
    this.rectangleReturn = this.scene.getMeshByName("returnRectangle") as Mesh;
    if (this.rectangleReturn) {
      this.rectangleReturn.isVisible = false;
    }
  }

  async setEnvironment(): Promise<void> {
    try {
      const maps = new natationGameEnv(this.scene);
      await maps.load();
    } catch (error) {
      throw new Error("Method not implemented.");
    }
  }
  private createLight() {
    const light = new HemisphericLight(
      "light",
      new Vector3(0, 2, 0),
      this.scene,
    );
    light.intensity = 0.7;
  }

  private shuffleArray(array1: any[], array2: any[], array3: any[]) {
    for (let i = array1.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Génère un indice aléatoire entre 0 et i inclus
      [array1[i], array1[j]] = [array1[j], array1[i]]; // Échange les éléments à l'indice i et j
      [array2[i], array2[j]] = [array2[j], array2[i]]; // Échange les éléments à l'indice i et j
      [array3[i], array3[j]] = [array3[j], array3[i]]; // Échange les éléments à l'indice i et j
    }
    return { array1, array2 };
  }

  private async initPlayer() {
    const indexForPlayerPlacement = 2;
    const startMesh = this.startPlacement[indexForPlayerPlacement];
    const getFileName = localStorage.getItem("pathCharacter");
    this.player = new PlayerNatationGame(
      startMesh.getAbsolutePosition().x || 0,
      startMesh.getAbsolutePosition().y || 0,
      startMesh.getAbsolutePosition().z || 0,
      this.scene,
      `./models/characters/${getFileName}`,
      this.firstEndPlacement[indexForPlayerPlacement],
      this.secondEndPlacement[indexForPlayerPlacement],
      this.rectangleReturn,
      this._input,
      false,
    );
    await this.player.init();

    // permet d'enlever la position du joueur de la liste des positions facilitera la suite
    this.startPlacement.splice(indexForPlayerPlacement, 1);
    this.firstEndPlacement.splice(indexForPlayerPlacement, 1);
    this.secondEndPlacement.splice(indexForPlayerPlacement, 1);
    // mettre de l'aléatoire dans les positions des bots
    {
      this.startPlacement, this.firstEndPlacement, this.secondEndPlacement;
    }
    this.shuffleArray(
      this.startPlacement,
      this.firstEndPlacement,
      this.secondEndPlacement,
    );
  }

  private async runSoloGame() {
    await this.initSoloWithBot(this.difficulty);
    this.buildScoreBoard();
  }

  private async initSoloWithBot(difficulty: string) {
    const infoBot = this.settings.level[difficulty].botInfo;
    for (let i = 0; i < 5; i++) {
      const startMesh = this.startPlacement[i];
      const firstEndMesh = this.firstEndPlacement[i];
      const secondEndMesh = this.secondEndPlacement[i];
      //nicolas changer le pathfile dans le fichier natationGameSettings.json --> DONE
      const bot = new BotNatation(
        "bot" + i,
        startMesh.getAbsolutePosition(),
        firstEndMesh,
        secondEndMesh,
        this.scene,
        infoBot[i].pathFile,
        infoBot[i].speed,
      );
      await bot.init();
      this.botArray.push(bot);
    }
  }

  timerToSMS(time: number): string {
    const seconds = Math.floor(time / 1000);
    const milliseconds = time % 100;
    return `${seconds}.${milliseconds < 10 ? "0" : ""}${milliseconds}`;
  }

  buildScoreBoard(): void {
    this.results.push({
      place: 1,
      name: this.playerName,
      result: "No score !",
    });
    this.botArray.forEach((bot, index) => {
      this.results.push({
        place: index + 2,
        name: bot.getName(),
        result: "No score !",
      });
    });
    storeNatation.commit("setResults", this.results);
  }

  showScoreBoard(): void {
    document
      .getElementById("natationGame-text-finish")!
      .classList.remove("hidden");
    this.addEventListenerByQuerySelector(
      "#natationGame-results #continue-button",
      "click",
      () => {
        if (this.continueButtonIsPressed) return;
        this.game.changeState(new InGameState(this.game, this.game.canvas));
      },
    );
    // attendre 2 secondes avant d'afficher le tableau des scores
    setTimeout(() => {
      this.createFinaleScoreBoard();
      this.displayPosition();
      document
        .getElementById("natationGame-text-finish")!
        .classList.add("hidden");
      document
        .getElementById("natationGame-keyPressed")!
        .classList.add("hidden");
      document
        .getElementById("natationGame-text-speedbar")!
        .classList.add("hidden");
      document
        .getElementById("natationGame-results")!
        .classList.remove("hidden");
      this.scoreboardIsShow = true;
    }, 2000);
  }

  createFinaleScoreBoard() {
    const resultsTemp: Result[] = [];

    // Résultat du joueur
    const playerResult = this.player.getEndTime()
      ? this.timerToSMS(
          Math.round(this.player.getEndTime() - this.raceStartTime),
        )
      : "no score";
    resultsTemp.push({ place: 0, name: this.playerName, result: playerResult });

    // Résultats des bots
    this.botArray.forEach((bot, index) => {
      const botResult = bot.getEndTime()
        ? this.timerToSMS(Math.round(bot.getEndTime() - this.raceStartTime))
        : "no score";
      resultsTemp.push({
        place: index + 1,
        name: bot.getName(),
        result: botResult,
      });
    });

    // Tri des résultats
    this.results = resultsTemp.sort(
      (a, b) => parseFloat(a.result) - parseFloat(b.result),
    );
    this.results.forEach((result, index) => {
      result.place = index + 1;
    });

    this.posFinale =
      this.results.findIndex((result) => result.name === this.playerName) + 1;

        if(this.posFinale === 1 || this.posFinale === 2 || this.posFinale === 3) {
            if(this.difficulty === "easy" && localStorage.getItem("levelNatation") === "easy") {
                localStorage.setItem("levelNatation", "intermediate");
            }
            if(this.difficulty === "intermediate" && localStorage.getItem("levelNatation") === "intermediate") {
                localStorage.setItem("levelNatation", "hard");
            }
        }

    // Enregistrement des résultats dans le store
    storeNatation.commit("setResults", this.results);
  }

  AfterCamAnim(): void {
    this._camera.dispose();
    this._camera = this.player.createCameraPlayer(this.player.transform);
    this.player.setCamera(this._camera);
  }

  async CreateCameraMouv(): Promise<void> {
    // nicolas movement camera --> DONE
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

    camKeys.push({ frame: 0, value: new Vector3(0, 2, 20) });
    camKeys.push({ frame: 6 * fps, value: new Vector3(-5, 2, 15) });
    camKeys.push({ frame: 9 * fps, value: new Vector3(-2.75, 0.25, 4.5) });
    camKeys.push({ frame: 9.5 * fps, value: new Vector3(-2.75, 0.25, 4.5) });
    camKeys.push({ frame: 14 * fps, value: new Vector3(0.5, 0.25, 4.5) });
    camKeys.push({ frame: 17 * fps, value: new Vector3(3.5, 2.5, 5) });

    rotationKeys.push({
      frame: 0,
      value: new Vector3(-Math.PI / 12, -Math.PI, 0),
    });
    rotationKeys.push({
      frame: 6 * fps,
      value: new Vector3(Math.PI / 12, (-7 * Math.PI) / 6, 0),
    });
    rotationKeys.push({ frame: 9 * fps, value: new Vector3(0, -Math.PI, 0) });
    rotationKeys.push({ frame: 9.5 * fps, value: new Vector3(0, -Math.PI, 0) });
    rotationKeys.push({ frame: 14 * fps, value: new Vector3(0, -Math.PI, 0) });
    rotationKeys.push({
      frame: 17 * fps,
      value: new Vector3(0.4493274861414612, -2.1422732064875865, 0),
    });

    camAnim.setKeys(camKeys);
    rotationAnim.setKeys(rotationKeys);

    this._camera.animations.push(camAnim);
    this._camera.animations.push(rotationAnim);

    await this.scene.beginAnimation(this._camera, 0, 17 * fps).waitAsync();
    document
      .getElementById("natationGame-skip-button")!
      .classList.add("hidden");
    // this.AfterCamAnim();
  }

  private startCountdown(countdownElements: string[]) {
    if (this.countdownInProgress) return; // Évite de démarrer le compte à rebours multiple fois
    let countdownIndex = 0;
    let previousElement = "";
    // console.log(this._camera.position, this._camera.rotation);

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
        }, 500);

        // Permet au joueur de jouer ou exécutez d'autres actions nécessaires
        this.countdownInProgress = true;
        this.raceStartTime = performance.now();
      }
    }, 1000);
  }

  initGui() {
    this.timer = 0;
    this.raceStartTime = 0;
    this.endGame = false;
    this.scoreboardIsShow = false;
    this.currentTime = 0;

    document.getElementById("natationGame-timer")!.classList.remove("hidden");
    document
      .getElementById("natationGame-keyPressed")!
      .classList.remove("hidden");
    document
      .getElementById("natationGame-text-speedbar")!
      .classList.remove("hidden");

    storeNatation.commit("setTimer", 0.0);
    storeNatation.commit("setSpeedBar", 0);
  }

  public addTextureEau() {
    const waterMesh = this.scene.getMeshByName("eauNatation");
    if (waterMesh) {
      // waterMesh.scaling = new Vector3(750,1,750);
      // waterMesh.position = new Vector3(-145, -3.05, -54.1);
      this.waterMaterial = new WaterMaterial("water_material", this.scene);
      this.waterMaterial.bumpTexture = new Texture(
        "./assets/water/water_bump.jpg",
        this.scene,
      );
      // this.waterMaterial.windForce = 3;
      // this.waterMaterial.waveHeight = 0.8;
      this.waterMaterial.alpha = 0.9;
      this.waterMaterial.waterColor = new Color3(0.1, 0.1, 0.6);
      this.waterMaterial.colorBlendFactor = 0.5;
      this.waterMaterial.addToRenderList(this.skyBox);
      waterMesh.material = this.waterMaterial;
    }
    const waterMesh2 = this.scene.getMeshByName("eauPlongeon");
    if (waterMesh2) {
      waterMesh2.material = this.waterMaterial;
    }
  }

  public createSkybox(): void {
    const skyMaterial = new SkyMaterial("skyMaterial", this.scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.turbidity = 10;
    skyMaterial.luminance = 1;
    skyMaterial.inclination = 0;
    this.skyBox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
    this.skyBox.material = skyMaterial;
  }

  public invisiblePlatform(): void {
    const platform = this.scene.getMeshByName("cylindreArrivéePlongeon");
    if (platform) {
      platform.isVisible = false;
    }
    const platform2 = this.scene.getMeshByName("cylindrediff");
    if (platform2) {
      platform2.isVisible = false;
    }
    const platform3 = this.scene.getMeshByName("cylindreMoyen");
    if (platform3) {
      platform3.isVisible = false;
    }
    const platform4 = this.scene.getMeshByName("cylindreFacile");
    if (platform4) {
      platform4.isVisible = false;
    }
    const platform5 = this.scene.getMeshByName("cylindreNoobg");
    if (platform5) {
      platform5.isVisible = false;
    }
    const platform6 = this.scene.getMeshByName("cylindreNoobd");
    if (platform6) {
      platform6.isVisible = false;
    }
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
}

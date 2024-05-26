import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import PlongeonGameSettings from "@/../public/plongeonGameSettings.json";
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
import { PlayerInputPlongeonGame } from "@/models/inputsMangement/PlayerInputPlongeonGame";
import { PlayerPlongeonGame } from "@/models/controller/PlayerPlongeonGame";
import { plongeonGameEnv } from "@/models/environments/plongeonGameEnv";
import { SkyMaterial, WaterMaterial } from "@babylonjs/materials";
import { storePlongeon } from "@/components/gui/storePlongeon";
import { doc } from "prettier";
import { Result } from "@/components/gui/results/ResultsContent.vue";
import { store } from "@/components/gui/store";
import { InGameState } from "../InGameState";

interface line {
  start: string;
  end: string;
}

interface level {
  placement: line[];
  pointToSucceed: number;
  numLetters: number;
  limitTime: number;
  timeAffichageSuite: number;
}

interface IPlongeonGameState {
  level: {
    easy: level;
    intermediate: level;
    hard: level;
  };
}

export class PlongeonGameState extends GameState {
  public _camera!: FreeCamera;

  private settings: IPlongeonGameState;
  private startPlacement: Mesh[] = [];
  private endPlacement: Mesh[] = [];

  private player!: PlayerPlongeonGame;
  private playerName: string;
  private _input: PlayerInputPlongeonGame;

  // private botArray : BotPlongeon[] = [];

  private isMultiplayer: boolean = false;
  private difficulty: "easy" | "intermediate" | "hard";

  private countdownInProgress: boolean = false;
  private plongeonStartTime: number = 0;

  public waterMaterial!: WaterMaterial;
  private skyBox!: Mesh;
  private letterPossible = ["f", "g", "h", "j"];
  private letterIsGenerated: boolean = false;
  private countdownDone: boolean = false;
  private playActive: boolean = false;
  private suiteLettersAffiche: boolean = false;
  private results: Result[] = [];
  private continueButtonIsPressed: boolean = false;
  private scoreboardIsShow: boolean = false;
  private currentTime = 0;

  constructor(
    game: Game,
    canvas: HTMLCanvasElement,
    difficulty?: "easy" | "intermediate" | "hard",
    multi?: boolean,
  ) {
    super(game, canvas);
    this._input = new PlayerInputPlongeonGame(this.scene);
    this.playerName = localStorage.getItem("username") || "Playertest";
    this.settings = PlongeonGameSettings; //settings running to do later
    this.difficulty = difficulty ? difficulty : "easy";
    this.isMultiplayer = multi ? multi : false;
    this.game.playTrack("plongeon");
  }

  async setEnvironment(): Promise<void> {
    try {
      const maps = new plongeonGameEnv(this.scene);
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

  private setLinePlacement() {
    const startTab: Mesh[] = [];
    const EndTab: Mesh[] = [];
    const placement = this.settings.level[this.difficulty].placement;
    placement.forEach((line) => {
      const startMesh = this.scene.getMeshByName(line.start) as Mesh;
      const firstEndMesh = this.scene.getMeshByName(line.end) as Mesh;
      startMesh.isVisible = false;
      firstEndMesh.isVisible = false;

      if (startMesh && firstEndMesh) {
        startTab.push(startMesh);
        EndTab.push(firstEndMesh);
      }
    });
    this.startPlacement = startTab;
    this.endPlacement = EndTab;
    const rectangleReturn = this.scene.getMeshByName("returnRectangle") as Mesh;
    if (rectangleReturn) {
      rectangleReturn.isVisible = false;
    }
  }

  private async initPlayer() {
    const indexForPlayerPlacement = 0;
    const startMesh = this.startPlacement[indexForPlayerPlacement];
    const getFileName = localStorage.getItem("pathCharacter");
    this.player = new PlayerPlongeonGame(
      startMesh.getAbsolutePosition().x || 0,
      startMesh.getAbsolutePosition().y || 0,
      startMesh.getAbsolutePosition().z || 0,
      this.scene,
      `./models/characters/${getFileName}`,
      this.endPlacement[indexForPlayerPlacement],
      this._input,
      false,
    );
    await this.player.init();

    // permet d'enlever la position du joueur de la liste des positions facilitera la suite
    this.startPlacement.splice(indexForPlayerPlacement, 1);
    this.endPlacement.splice(indexForPlayerPlacement, 1);
    // mettre de l'aléatoire dans les positions des bots
    {
      this.startPlacement, this.endPlacement;
    }
  }

  private async runSoloGame() {
    this.buildScoreBoard();
  }

  initGui() {
    document.getElementById("plongeonGame-score")!.classList.remove("hidden");
    document
      .getElementById("plongeonGame-keyPressed")!
      .classList.remove("hidden");
  }

  // Implement abstract members of GameState
  async enter(): Promise<void> {
    try {
      //load the gui iin the mainmenu and not here only for prod
      this.game.engine.displayLoadingUI();
      this.scene.detachControl();

      document.getElementById("map-keybind")!.classList.add("hidden");

      // Inspector.Show(this.scene, {});
      await this.setEnvironment();
      this.invisiblePlatform();
      this.addTextureEau();
      this.createLight();
      this.setLinePlacement();

      // Init player
      await this.initPlayer(); //to resolve

      // lancer le bon mode de jeu
      // on init le jeu
      if (!this.isMultiplayer) {
        await this.runSoloGame(); //to resolve
      }

      this.runUpdateAndRender();

      this._camera = new FreeCamera(
        "cameraPlongeon",
        new Vector3(0, 5, -3),
        this.scene,
      );
      // this._camera.rotation._y = Math.PI/2;
      // this._camera.rotation._x = Math.PI/5;
      // Vector3(4.78, 3.27, 6.38)
      // this._camera.setTarget(this.player.transform.position); // pas besoin de target le player pour ce jeu

      document.getElementById("map-keybind")!.classList.add("hidden");
      document.getElementById("plongeontp")!.classList.add("hidden");
      document
        .getElementById("plongeonGame-skip-button")!
        .classList.remove("hidden");
      document.getElementById("plongeongame-help")!.classList.remove("hidden");
      this.addEventListenerById("close-help-plongeon", "click", () => {
        document.getElementById("plongeongame-help")!.classList.add("hidden");
      });
      document
        .getElementById("plongeonGame-command-container")!
        .classList.remove("hidden");
      document
        .getElementById("plongeonGame-action-container")!
        .classList.remove("hidden");
      this.addEventListenerById("plongeonGame-skip-button", "click", () => {
        document.getElementById("plongeongame-help")!.classList.add("hidden");
        this.scene.stopAnimation(this._camera);
        this.AfterCamAnim();
      });

      await this.scene.whenReadyAsync(); // on attends que la scene soit bien chargé
      this.scene.attachControl();
      this.game.engine.hideLoadingUI();

      this.CreateCameraMouv().then(() => {
        document
          .getElementById("plongeonGame-ready-button")!
          .classList.remove("hidden");
        document
          .getElementById("plongeonGame-skip-button")!
          .classList.add("hidden");
        document.getElementById("plongeongame-help")!.classList.add("hidden");
        this.addEventListenerById("plongeonGame-ready-button", "click", () => {
          this.AfterCamAnim();
          this.initGui();
          document
            .getElementById("plongeonGame-ready-button")!
            .classList.add("hidden");
          this.game.canvas.focus();
          this.startCountdown([
            "plongeonGame-text-1",
            "plongeonGame-text-2",
            "plongeonGame-text-3",
            "plongeonGame-text-4",
          ]);
        });
      });
    } catch (error) {
      throw new Error(`error in enter method : ${error}`);
    }
  }

  async exit(): Promise<void> {
    console.log("exit plongeon game");

    document.getElementById("plongeonGame-score")!.classList.add("hidden");
    document.getElementById("plongeonGame-keyPressed")!.classList.add("hidden");
    document.getElementById("plongeonGame-results")!.classList.add("hidden");
    document
      .getElementById("plongeonGame-command-container")!
      .classList.add("hidden");
    document
      .getElementById("plongeonGame-action-container")!
      .classList.add("hidden");

    storePlongeon.commit("setScore", 0);
    storePlongeon.commit("setLetters", []);
    storePlongeon.commit("setResults", []);

    this.cleanup();
  }

  update(): void {
    if (!this.countdownDone) return;

    if (!this.letterIsGenerated) {
      //todo rajouter que le perso vient de sauter et est entrain de tomber
      const suiteLetters = this.generateLetters(
        this.settings.level[this.difficulty].numLetters,
      );
      this.player.putLetters(suiteLetters);
      storePlongeon.commit("setLetters", suiteLetters);
      this.letterIsGenerated = true;
      return;
    }

        if(this.player._isWin){ 
            if (!this.scoreboardIsShow) {
                // console.log(this.player.score, this.settings.level[this.difficulty].pointToSucceed)
                if(this.player.score >= this.settings.level[this.difficulty].pointToSucceed){
                    if(this.difficulty === "easy" && localStorage.getItem("levelPlongeon") === "easy") {
                        localStorage.setItem("levelPlongeon", "intermediate");
                    }
                    if(this.difficulty === "intermediate" && localStorage.getItem("levelPlongeon") === "intermediate"){
                        localStorage.setItem("levelPlongeon", "hard");
                    }
                }
                this.createFinaleScoreBoard();
                this.showScoreBoard();
                console.log("affiche le score board fin de jeu")
            }
            console.log("FIN DE JEU");
            return;
        } else if(!this.player._isWin){
            const deltaTime = this.scene.getEngine().getDeltaTime();
            this.currentTime = performance.now();
            this.player.play(deltaTime, this.currentTime);

      if (this.letterIsGenerated && !this.suiteLettersAffiche) {
        if (this.player.isSpacedPressedForAnim) {
          this.suiteLettersAffiche = true;
          this.affichageLettersDebut();
        }
        // tant que le joueur n'a pas lancé on fait rien
        console.log("en attente que le joueru presse space");
        return;
      }

      if (
        this.playActive &&
        this.settings.level[this.difficulty].limitTime <
        this.currentTime - this.plongeonStartTime
      ) {
        this.playActive = false;
        this.endGame();
      }

      return;
    }
  }

  private endGame() {
    this.player.descendrePerso();
    this.createFinaleScoreBoard();
  }

  private continueButtonHandler = () => {
    this.continueButtonIsPressed = true;
    this.game.changeState(new InGameState(this.game, this.game.canvas));
  };

  showScoreBoard(): void {
    this.scoreboardIsShow = true;
    document
      .getElementById("plongeonGame-text-finish")!
      .classList.remove("hidden");
    this.addEventListenerByQuerySelector(
      "#plongeonGame-results #continue-button",
      "click",
      this.continueButtonHandler,
    );
    // attendre 2 secondes avant d'afficher le tableau des scores
    setTimeout(() => {
      document
        .getElementById("plongeonGame-text-finish")!
        .classList.add("hidden");
      document
        .getElementById("plongeonGame-results")!
        .classList.remove("hidden");
    }, 2000);
  }

  buildScoreBoard(): void {
    this.results.push({ place: 1, name: this.playerName, result: "0" });
    storePlongeon.commit("setResults", this.results);
  }

  createFinaleScoreBoard(): void {
    this.results = [];

    const score = Math.round(this.player.score * (this.settings.level[this.difficulty].limitTime - (this.currentTime - this.plongeonStartTime) / 1000));
    this.results.push({
      place: 1,
      name: this.playerName,
      result: "" + score,
    });
    storePlongeon.commit("setResults", this.results);
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
        // this.plongeonStartTime = performance.now();
        this.countdownDone = true;
      }
    }, 1000);
  }

  private affichageLettersDebut() {
    setTimeout(() => {
      document
        .getElementById("plongeonGame-suiteLetters")!
        .classList.remove("hidden");
      document
        .getElementById("plongeonGame-text-retenir")!
        .classList.remove("hidden");
    }, 500);
    setTimeout(() => {
      document
        .getElementById("plongeonGame-suiteLetters")!
        .classList.add("hidden");
      document
        .getElementById("plongeonGame-text-retenir")!
        .classList.add("hidden");
      document
        .getElementById("plongeonGame-text-avous")!
        .classList.remove("hidden");
    }, this.settings.level[this.difficulty].timeAffichageSuite);
    setTimeout(() => {
      document
        .getElementById("plongeonGame-text-avous")!
        .classList.add("hidden");
      this.playActive = true;
      this.plongeonStartTime = performance.now();
      this.player.gameActiveState();
    }, this.settings.level[this.difficulty].timeAffichageSuite + 1500);
  }

  private generateLetters(num: number): string[] {
    let lettersArray: string[] = [];
    for (let i = 0; i < num; i++) {
      let randomNumber = Math.floor(Math.random() * 4);
      lettersArray.push(this.letterPossible[randomNumber]);
    }
    // console.log(lettersArray);
    return lettersArray;
  }

  AfterCamAnim(): void {
    // this._camera.dispose();
    // this._camera = this.player.createCameraPlayer(this.player.transform);
    this._camera.position = new Vector3(-4, 2, 13);
    this._camera.rotation._y = Math.PI / 3.5;
    this._camera.rotation._x = Math.PI / 10;
    this.player.setCamera(this._camera);
  }

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

    camKeys.push({ frame: 0, value: new Vector3(0, 5, -3) });
    camKeys.push({ frame: 2 * fps, value: new Vector3(0, 1.5, -1) });
    camKeys.push({ frame: 4 * fps, value: new Vector3(2, 1.5, 3) });
    camKeys.push({ frame: 8 * fps, value: new Vector3(-4, 2, 13) });

    rotationKeys.push({ frame: 0, value: new Vector3(0, 0, 0) });
    rotationKeys.push({ frame: 2 * fps, value: new Vector3(0, 0, 0) });
    rotationKeys.push({
      frame: 4 * fps,
      value: new Vector3(0, -Math.PI / 6, 0),
    });
    rotationKeys.push({
      frame: 8 * fps,
      value: new Vector3(Math.PI / 10, Math.PI / 3.5, 0),
    });

    camAnim.setKeys(camKeys);
    rotationAnim.setKeys(rotationKeys);

    this._camera.animations.push(camAnim);
    this._camera.animations.push(rotationAnim);

    await this.scene.beginAnimation(this._camera, 0, 8 * fps).waitAsync();
    document
      .getElementById("plongeonGame-skip-button")!
      .classList.add("hidden");
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
    for (let i = 0; i < 6; i++) {
      if (i === 0) {
        const platform = this.scene.getMeshByName("cylindreArrivéeNatation");
        if (platform) {
          platform.isVisible = false;
        }
      } else {
        const platform = this.scene.getMeshByName(
          "cylindreArrivéeNatation.00" + i,
        );
        if (platform) {
          platform.isVisible = false;
        }
      }
    }
  }
}

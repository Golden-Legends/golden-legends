import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import TirArcGameSettings from "../../../assets/tirArcGameSettings.json";
import {
  Animation,
  FreeCamera,
  HemisphericLight,
  Mesh,
  Vector3,
} from "@babylonjs/core";
import { WaterMaterial } from "@babylonjs/materials";
import { PlayerInputTirArcGame } from "@/models/inputsMangement/PlayerInputTirArcGame";
import { PlayerTirArcGame } from "@/models/controller/PlayerTirArcGame";
import { tirArcGameEnv } from "@/models/environments/tirArcGameEnv";
import { storeTirArc } from "@/components/gui/storeTirArc";
import { Result } from "@/components/gui/results/ResultsContent.vue";
import { InGameState } from "../InGameState";

interface line {
  start: string;
  end: string;
}

interface level {
  placement: line[];
  pointToSucceed: number;
  speedCurseur: number;
}

interface ITirArcGameState {
  level: {
    easy: level;
    intermediate: level;
  };
}

export class TirArcGameState extends GameState {
  public _camera!: FreeCamera;

  private settings: ITirArcGameState;
  private startPlacement: Mesh[] = [];
  private endPlacement: Mesh[] = [];

  private player!: PlayerTirArcGame;
  private playerName: string;
  private _input: PlayerInputTirArcGame;

  // private botArray : BotPlongeon[] = [];

  private isMultiplayer: boolean = false;
  private difficulty: "easy" | "intermediate" | "hard";

  private countdownInProgress: boolean = false;
  private countdownDone: boolean = false;
  private fightStartTime: number = 0;
  private guiGame: boolean = false;
  private playActive: boolean = false;
  private scoreboardIsShow: boolean = false;
  private animationFleche: boolean = false;
  private tableauScore: number[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  private animArc: boolean = false;
  private score: number = 0;
  private results: Result[] = [];
  private continueButtonIsPressed: boolean = false;

  private env!: tirArcGameEnv;

  public waterMaterial!: WaterMaterial;
  private skyBox!: Mesh;

  constructor(
    game: Game,
    canvas: HTMLCanvasElement,
    difficulty?: "easy" | "intermediate" | "hard",
    multi?: boolean,
  ) {
    super(game, canvas);
    this._input = new PlayerInputTirArcGame(this.scene);
    this.playerName = localStorage.getItem("playerName") || "Playertest";
    this.settings = TirArcGameSettings; //settings running to do later
    this.difficulty = difficulty ? difficulty : "easy";
    storeTirArc.commit(
      "setSpeed",
      this.settings.level[this.difficulty].speedCurseur,
    );
    this.isMultiplayer = multi ? multi : false;
    this.game.playTrack("100m");
  }

  async setEnvironment(): Promise<void> {
    try {
      const maps = new tirArcGameEnv(this.scene);
      this.env = maps;
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
    // const placement = this.settings.placement;
    const placement = this.settings.level[this.difficulty].placement;
    placement.forEach((line) => {
      const startMesh = this.scene.getMeshByName(line.start) as Mesh;
      // console.log(startMesh.getAbsolutePosition());
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
  }

  private async initPlayer() {
    const indexForPlayerPlacement = 0;
    const startMesh = this.startPlacement[indexForPlayerPlacement];
    const getFileName = localStorage.getItem("pathCharacter");
    this.player = new PlayerTirArcGame(
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
    document.getElementById("tirArcGame-score")!.classList.remove("hidden");
  }

  // Implement abstract members of GameState
  async enter(): Promise<void> {
    try {
      //load the gui iin the mainmenu and not here only for prod
      this.game.engine.displayLoadingUI();
      this.scene.detachControl();

      // Inspector.Show(this.scene, {});
      await this.setEnvironment();
      this.createLight();
      this.setLinePlacement();
      this.invisiblePlatform();

      // Init player
      await this.initPlayer(); //to resolve

      // lancer le bon mode de jeu
      // on init le jeu
      if (!this.isMultiplayer) {
        await this.runSoloGame(); //to resolve
      }

      this.runUpdateAndRender();

      this._camera = new FreeCamera(
        "cameraTirArc",
        new Vector3(5, 4, -2),
        this.scene,
      );
      this._camera.rotation._y = 0;
      this._camera.rotation._x = Math.PI / 5;
      // Vector3(4.78, 3.27, 6.38)
      // this._camera.setTarget(this.player.transform.position); // pas besoin de target le player pour ce jeu

      document.getElementById("objects-keybind")!.classList.add("hidden");
      document.getElementById("map-keybind")!.classList.add("hidden");
      document.getElementById("tirArctp")!.classList.add("hidden");
      document
        .getElementById("tirArcGame-skip-button")!
        .classList.remove("hidden");
      document
        .getElementById("tirArcGame-action-container")!
        .classList.remove("hidden");
      document
        .getElementById("tirArcGame-vertical-container")!
        .classList.remove("hidden");
      document
        .getElementById("tirArcGame-horizontal-container")!
        .classList.remove("hidden");
      this.addEventListenerById("tirArcGame-skip-button", "click", () => {
        this.scene.stopAnimation(this._camera);
        this.AfterCamAnim();
      });

      await this.scene.whenReadyAsync(); // on attends que la scene soit bien chargé
      this.scene.attachControl();
      this.game.engine.hideLoadingUI();

      this.CreateCameraMouv().then(() => {
        document
          .getElementById("tirArcGame-ready-button")!
          .classList.remove("hidden");
        document
          .getElementById("tirArcGame-skip-button")!
          .classList.add("hidden");
        this.addEventListenerById("tirArcGame-ready-button", "click", () => {
          this.startCountdown([
            "tirArcGame-text-1",
            "tirArcGame-text-2",
            "tirArcGame-text-3",
            "tirArcGame-text-4",
          ]);
          this.AfterCamAnim();
          this.initGui();
          document
            .getElementById("tirArcGame-ready-button")!
            .classList.add("hidden");
          this.game.canvas.focus();
        });
      });
    } catch (error) {
      throw new Error(`error in enter method : ${error}`);
    }
  }

  private async startCountdown(countdownElements: string[]) {
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
        this.fightStartTime = performance.now();
        this.countdownDone = true;
      }
    }, 1000);
    this.player.runPriseArc();
    await this.env._loadGameAssets(
      this.scene,
      new Vector3(-0.38, 0.2, 4),
      "arc.glb",
      "arc",
      new Vector3(0, 0, 0),
    );
    // console.log(this.env.animArc);
  }

  AfterCamAnim(): void {
    // this._camera.dispose();
    // this._camera = this.player.createCameraPlayer(this.player.transform);
    this._camera.position = new Vector3(1, 1, 6);
    this._camera.rotation._y = (-5 * Math.PI) / 6;
    this._camera.rotation._x = Math.PI / 12;
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

    camKeys.push({ frame: 0, value: new Vector3(5, 4, -2) });
    camKeys.push({ frame: 5 * fps, value: new Vector3(-1, 0.5, 10) });
    camKeys.push({ frame: 9 * fps, value: new Vector3(1, 1, 6) });
    // camKeys.push({frame: 2 * fps, value: new Vector3(0, 1.5, -1)});
    // camKeys.push({frame: 4 * fps, value: new Vector3(2, 1.5, 3)});
    // camKeys.push({frame: 8 * fps, value: new Vector3(-4, 2, 13)});

    rotationKeys.push({ frame: 0, value: new Vector3(Math.PI / 5, 0, 0) });
    rotationKeys.push({ frame: 5 * fps, value: new Vector3(0, -Math.PI, 0) });
    rotationKeys.push({
      frame: 9 * fps,
      value: new Vector3(Math.PI / 12, (-5 * Math.PI) / 6, 0),
    });
    // rotationKeys.push({frame: 2 * fps, value: new Vector3(0, 0, 0)});
    // rotationKeys.push({frame: 4 * fps, value: new Vector3(0, -Math.PI/6, 0)});
    // rotationKeys.push({frame: 8 * fps, value: new Vector3(Math.PI/10, Math.PI/3.5, 0)});

    camAnim.setKeys(camKeys);
    rotationAnim.setKeys(rotationKeys);

    this._camera.animations.push(camAnim);
    this._camera.animations.push(rotationAnim);

    await this.scene.beginAnimation(this._camera, 0, 9 * fps).waitAsync();
    document.getElementById("tirArcGame-skip-button")!.classList.add("hidden");
  }

  async exit(): Promise<void> {
    console.log("exit tir arc game");
    document.getElementById("tirArcGame-score")!.classList.add("hidden");
    document
      .getElementById("tirArcGame-action-container")!
      .classList.add("hidden");
    document
      .getElementById("tirArcGame-vertical-container")!
      .classList.add("hidden");
    document
      .getElementById("tirArcGame-horizontal-container")!
      .classList.add("hidden");
    document.getElementById("tirArcGame-results")!.classList.add("hidden");

    storeTirArc.commit("setScore", 0);
    storeTirArc.commit("setResults", []);
    this.cleanup();
  }

  update(): void {
    if (this.countdownDone && !this.guiGame) {
      const deltaTime = this.scene.getEngine().getDeltaTime();
      this.player.play(deltaTime, performance.now());
      if (this.player.isSpacedPressedForAnim && !this.guiGame) {
        //TODO ADD GUI
        document
          .getElementById("tirArcGame-horizontalgui")!
          .classList.remove("hidden");
        document
          .getElementById("tirArcGame-verticalgui")!
          .classList.remove("hidden");
        this.guiGame = true;
        console.log("afficher gui game");
        this.playActive = true;
        // this.player.setAfficherGui();
      }
    }

    if (!this.playActive) {
      if (this.player._isWin && !this.scoreboardIsShow) {
        this.showScoreBoard();
        // console.log("scoreboard");
      }
    } else {
      if (this.player.compteur < 2) {
        const deltaTime = this.scene.getEngine().getDeltaTime();
        this.player.play(deltaTime, performance.now());
      } else if (this.player.compteur === 2 && !this.animArc) {
        //TODO REMOVE GUI
        document
          .getElementById("tirArcGame-horizontalgui")!
          .classList.add("hidden");
        document
          .getElementById("tirArcGame-verticalgui")!
          .classList.add("hidden");
        this.animArc = true;
        this.env.gameAssets.position = new Vector3(-0.32, 0.2, 3.92); //new Vector3(-0.38, 0.2, 4)
        const loadFlecheAssets = async () => {
          await this.env._loadFlecheAssets(
            this.scene,
            new Vector3(-0.31, 0.2, 3.85),
            "fleche.glb",
            "fleche",
            new Vector3(0, 0, 0),
          );
        };
        loadFlecheAssets();
        this.env.animArc?.start(
          true,
          0.09,
          this.env.animArc.from,
          this.env.animArc.to,
          false,
        );
        setTimeout(() => {
          this.env.animArc?.stop();
          this.env.animArc?.start(
            false,
            0.09,
            this.env.animArc.from,
            this.env.animArc.from,
            false,
          );
        }, 3500);
      } else if (this.player._isIdle && !this.animationFleche) {
        this.animationFleche = true;
        this.animateFleche();
        //player en anim isWin à la fin de la flèche
        // setTimeout(() => this.player.runWin(), 4000);
      } else if (this.player._isWin && this.animationFleche) {
        // console.log("win");
        this.score =
          this.tableauScore[Math.abs(this.player.verticalDirection)] *
          this.tableauScore[Math.abs(this.player.horizontalDirection)];
        storeTirArc.commit("setScore", this.score);
        this.endGame();
        // console.log(this.tableauScore[Math.abs(this.player.verticalDirection)] * this.tableauScore[Math.abs(this.player.horizontalDirection)]);
      }
    }
  }

  private endGame() {
    this.playActive = false;
    this.player.runWin();
    this.createFinaleScoreBoard();
    this.resetGame();
  }

  public async animateFleche() {
    // console.log("animate fleche");
    // this.env.flecheAssets.position = new Vector3(-0.31, 0.4, 3.85)
    //TODO faire une anim de caméra
    // this._camera.position.z = 0;
    // ANIMATION FLECHE
    let booleanPos1 = false;
    let booleanPos2 = false;
    let booleanPos3 = false;
    const verticalDirection = this.player.verticalDirection;
    const horizontalDirection = this.player.horizontalDirection;
    console.log(verticalDirection, horizontalDirection);
    // this.env.flecheAssets.mesh.position.y = 0.362621;
    // console.log(this.env.flecheAssets.mesh.position.y);
    // console.log(this.env.flecheAssets.mesh.position.x);

    let booleanVertical1 = false;
    let booleanVertical2 = false;

    let booleanHorizontal1 = false;
    let booleanHorizontal2 = false;

    const timeExec = 3;

    while (
      booleanPos1 === false ||
      booleanPos2 === false ||
      booleanPos3 === false
    ) {
      //z
      // console.log(booleanPos1, booleanPos2, booleanPos3);
      if (booleanPos3 === false) {
        if (this.env.flecheAssets.mesh.position.z > -1.13807) {
          this.env.flecheAssets.mesh.position.z -= 0.07;
          await new Promise((resolve) => setTimeout(resolve, timeExec));
        } else {
          booleanPos3 = true;
        }
      }
      //y
      if (booleanPos1 === false) {
        const eloignement = Math.abs(verticalDirection);
        if (
          verticalDirection < 0 &&
          this.env.flecheAssets.mesh.position.y <
            0.361 - (0.01883 * eloignement + 0.00836) &&
          !booleanVertical2
        ) {
          booleanVertical1 = true;
          this.env.flecheAssets.mesh.position.y += 0.007;
          await new Promise((resolve) => setTimeout(resolve, timeExec));
        } else if (
          verticalDirection < 0 &&
          this.env.flecheAssets.mesh.position.y >
            0.361 - (0.01883 * eloignement + 0.00836) &&
          !booleanVertical2
        ) {
          booleanPos1 = true;
        } else if (
          verticalDirection < 0 &&
          this.env.flecheAssets.mesh.position.y >
            0.361 - (0.01883 * eloignement + 0.00836) &&
          !booleanVertical1
        ) {
          booleanVertical2 = true;
          this.env.flecheAssets.mesh.position.y -= 0.007;
          await new Promise((resolve) => setTimeout(resolve, timeExec));
        } else if (
          verticalDirection < 0 &&
          this.env.flecheAssets.mesh.position.y <
            0.361 - (0.01883 * eloignement + 0.00836) &&
          !booleanVertical1
        ) {
          booleanPos1 = true;
        } else if (verticalDirection === 0) {
          if (this.env.flecheAssets.mesh.position.y < 0.361) {
            // console.log("vertical 0");
            this.env.flecheAssets.mesh.position.y += 0.007;
            await new Promise((resolve) => setTimeout(resolve, timeExec));
          } else {
            booleanPos1 = true;
          }
        } else if (
          verticalDirection > 0 &&
          this.env.flecheAssets.mesh.position.y <
            0.361 + (0.01883 * eloignement + 0.00836)
        ) {
          this.env.flecheAssets.mesh.position.y += 0.007;
          await new Promise((resolve) => setTimeout(resolve, timeExec));
        } else if (
          verticalDirection > 0 &&
          this.env.flecheAssets.mesh.position.y >
            0.361 + (0.01883 * eloignement + 0.00836)
        ) {
          booleanPos1 = true;
        }
      }
      //faire le x +++ positionner la cible comme il faut sur blender dans l'axe (pas forcément, faire comme pour le y)
      if (booleanPos2 === false) {
        const eloignement = Math.abs(horizontalDirection);
        if (
          horizontalDirection < 0 &&
          this.env.flecheAssets.mesh.position.x <
            -0.36 + (0.01883 * eloignement + 0.00836) &&
          !booleanHorizontal2
        ) {
          booleanHorizontal1 = true;
          this.env.flecheAssets.mesh.position.x += 0.007;
          await new Promise((resolve) => setTimeout(resolve, timeExec));
        } else if (
          horizontalDirection < 0 &&
          this.env.flecheAssets.mesh.position.x >
            -0.36 + (0.01883 * eloignement + 0.00836) &&
          !booleanHorizontal2
        ) {
          booleanPos2 = true;
        } else if (
          horizontalDirection < 0 &&
          this.env.flecheAssets.mesh.position.x >
            -0.36 + (0.01883 * eloignement + 0.00836) &&
          !booleanHorizontal1
        ) {
          booleanHorizontal2 = true;
          this.env.flecheAssets.mesh.position.x -= 0.007;
          await new Promise((resolve) => setTimeout(resolve, timeExec));
        } else if (
          horizontalDirection < 0 &&
          this.env.flecheAssets.mesh.position.x <
            -0.36 + (0.01883 * eloignement + 0.00836) &&
          !booleanHorizontal1
        ) {
          booleanPos2 = true;
        } else if (horizontalDirection === 0) {
          if (this.env.flecheAssets.mesh.position.x > -0.36) {
            // console.log("horizontal 0");
            this.env.flecheAssets.mesh.position.x -= 0.007;
            await new Promise((resolve) => setTimeout(resolve, timeExec));
          } else {
            booleanPos2 = true;
          }
        } else if (
          horizontalDirection > 0 &&
          this.env.flecheAssets.mesh.position.x >
            -0.36 - (0.01883 * eloignement + 0.00836)
        ) {
          this.env.flecheAssets.mesh.position.x -= 0.007;
          await new Promise((resolve) => setTimeout(resolve, timeExec));
        } else if (
          horizontalDirection > 0 &&
          this.env.flecheAssets.mesh.position.x <
            -0.36 - (0.01883 * eloignement + 0.00836)
        ) {
          booleanPos2 = true;
        }
      }
    }
    // console.log(booleanPos1, booleanPos2, booleanPos3);
    console.log("fin anim fleche");
    this.player._isWin = true;
    // }
    // this.env.flecheAssets.mesh.position.x = -0.367833;
    // this.env.flecheAssets.mesh.position.y = 0.362621 + 0.01883 *2+ 0.00836 ;
    // this.env.flecheAssets.mesh.position.z = -1.13807;
  }

  showScoreBoard(): void {
    this.scoreboardIsShow = true;
    document
      .getElementById("tirArcGame-text-finish")!
      .classList.remove("hidden");
    this.addEventListenerByQuerySelector(
      "#tirArcGame-results #continue-button",
      "click",
      () => {
        this.continueButtonIsPressed = true;
        this.game.changeState(new InGameState(this.game, this.game.canvas));
      },
    );
    // attendre 2 secondes avant d'afficher le tableau des scores
    setTimeout(() => {
      document
        .getElementById("tirArcGame-text-finish")!
        .classList.add("hidden");
      document.getElementById("tirArcGame-results")!.classList.remove("hidden");
    }, 2000);
  }

  buildScoreBoard(): void {
    this.results.push({ place: 1, name: this.playerName, result: "0" });
    storeTirArc.commit("setResults", this.results);
  }

  createFinaleScoreBoard(): void {
    this.results = [];
    this.results.push({
      place: 1,
      name: this.playerName,
      result: "" + this.score + "/100",
    });
    storeTirArc.commit("setResults", this.results);
  }

  public invisiblePlatform(): void {
    const platform = this.scene.getMeshByName("CylinderTirFacile");
    if (platform) {
      platform.isVisible = false;
    }
    const platform2 = this.scene.getMeshByName("CylinderTirFacileAtt");
    if (platform2) {
      platform2.isVisible = false;
    }
    const platform3 = this.scene.getMeshByName("CylinderTirMoyen");
    if (platform3) {
      platform3.isVisible = false;
    }
    const platform4 = this.scene.getMeshByName("CylinderTirMoyenAtt");
    if (platform4) {
      platform4.isVisible = false;
    }
  }

  private resetGame() {
    storeTirArc.commit("setInitialState", {
      positionH: -4,
      positionV: -1,
      increasing: true,
      horizontalPlaying: true,
      verticalPlaying: false,
    });
  }
}

import {
  Animation,
  Color3,
  FollowCamera,
  HemisphericLight,
  Matrix,
  Mesh,
  MeshBuilder,
  Nullable,
  PointLight,
  Scene,
  SceneLoader,
  ShadowGenerator,
  Vector3,
} from "@babylonjs/core";
import { GameState } from "../GameState";
import { PlayerInput } from "../inputsMangement/PlayerInput";
import { Player } from "../controller/Player";
import { Environment } from "../environments/environments";
import { Scaling } from "../../utils/Scaling.ts";
import { RunningGameState } from "./games/RunningGameState.ts";
import { AdvancedDynamicTexture, Control } from "@babylonjs/gui";
import ky from "ky";
// import { socket } from "../../utils/socket.ts";
import { BACK_URL } from "../../utils/constants.ts";
import { JumpGame } from "./miniGames/JumpGame.ts";
import { ObjectGame } from "./miniGames/ObjectGame.ts";
import { BoxeGameState } from "./games/BoxeGameState.ts";
import { NatationGameState } from "./games/NatationGameState.ts";
import { PlongeonGameState } from "./games/PlongeonGameState.ts";
import { TirArcGameState } from "./games/TirArcGameState.ts";
import { JavelotGameState } from "./games/JavelotGameState.ts";
import { storeOnboard } from "@/components/gui/storeOnboard.ts";
import { storeSound } from "@/components/gui/storeSound.ts";
import { doc } from "prettier";
import router from "@/router/routes.ts";
import { TennisGameState } from "./games/TennisGameState.ts";

export class InGameState extends GameState {
  public assets;
  private _input: PlayerInput;
  private jumpGame!: JumpGame;
  private objectGame!: ObjectGame;
  private fps: number = 30;
  private isGameObjectInterfacedPressed = false;
  private isOptionsInterfacedPressed = false;

  constructor(game, canvas) {
    super(game, canvas);
    this._input = new PlayerInput(this.scene);
    document.getElementById("map-keybind")!.classList.remove("hidden");

    this.listenerGui();
  }

  async enter() {
    this.game.engine.displayLoadingUI();
    this.scene.detachControl();
    // Request to server to tell that the user is in game
    // ky.post(`${BACK_URL}/join-main-lobby`, {
    //   json: {
    //     playerName: "test",
    //   },
    // });
    await this._loadCharacterAssets(this.scene);

    // création des controlles du joueur
    this._input = new PlayerInput(this.scene);

    await this._initPlayer(this.scene).then(async () => {
      if (!!this._player) {
        await this._player.activatePlayerCamera();
        this.jumpGame = new JumpGame(
          this.scene,
          this._player.mesh,
          this._input,
        );
        this.objectGame = new ObjectGame(
          this.scene,
          this._player.mesh,
          this._input,
        );
      }
    });

    //TO ACTIVATE WHEN THE LOADING SCREEN IS DONE
    // await this.animStartGame();
    // set environments
    document.getElementById("options-keybind")!.classList.remove("hidden");
    if (storeOnboard.state.debut === false) {
      document
        .getElementById("onboarding-container")!
        .classList.remove("hidden");
      storeOnboard.commit("setDebut", true);
    }
    await this.setEnvironment();

    this.disableTpDifficulty();

    // Inspector.Show(this.scene, {});

    // lancer la boucle de rendu
    this.runUpdateAndRender();
    this.initializePointerLock();

    // lancer le mini jeu
    if (this.jumpGame) {
      this.jumpGame.init();
    }

    if (this.objectGame) {
      this.objectGame.init();
    }

    await this.scene.whenReadyAsync();
    this.scene.attachControl();
    this.game.engine.hideLoadingUI();
  }

  public animStartGame() {
    console.log("animStartGame");
    //camera 1
    // const camera = new FollowCamera("carteCamera", new Vector3(-145, 80, -260), this.scene);
    // camera.rotation = new Vector3(Math.PI/6, 0, 0);

    //camera 2
    const camera = new FollowCamera(
      "carteCamera",
      new Vector3(-142, 4, -54.1),
      this.scene,
    );
    camera.rotation = new Vector3(Math.PI / 2, 0, 0);

    //camera.lockedTarget = this.player.mesh;
    //camera.radius = 10;
    //camera.heightOffset = 20;
    //camera.rotationOffset = 180;

    const animation = new Animation(
      "cameraAnimation",
      "position",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    // Définir les frames clés de l'animation
    const camKeys: { frame: number; value: Vector3 }[] = [];
    //anim num 1
    // camKeys.push({frame: 0, value: new Vector3(-145, 80, -260)}); // Position actuelle de la caméra
    // camKeys.push({frame: 2 * this.fps, value: new Vector3(-1.1, 80, -201.9)});
    // camKeys.push({frame: 4 * this.fps, value: new Vector3(39.6, 80, -54.1)});
    // camKeys.push({frame: 6 * this.fps, value: new Vector3(-1.1, 80, 94.53)});
    // camKeys.push({frame: 8 * this.fps, value: new Vector3(-145, 80, 140)});
    // camKeys.push({frame: 10 * this.fps, value: new Vector3(-289.5, 80, 94.53)});
    // camKeys.push({frame: 12 * this.fps, value: new Vector3(-350, 80, -54.1)});
    // camKeys.push({frame: 14 * this.fps, value: new Vector3(-289.5, 80, -201.46)});
    // camKeys.push({frame: 16 * this.fps, value: new Vector3(-145, 80, -260)});
    // camKeys.push({frame: 18 * this.fps, value: new Vector3(-170, 8, -10)});
    // Durée de l'animation (en frames) // Nouvelle position de la caméra

    //anim num 2
    camKeys.push({ frame: 0, value: new Vector3(-142, 4, -54.1) });
    camKeys.push({ frame: 4 * this.fps, value: new Vector3(39.6, 80, -54.1) });
    camKeys.push({ frame: 9 * this.fps, value: new Vector3(39.6, 80, -54.1) });
    camKeys.push({ frame: 11 * this.fps, value: new Vector3(-170, 8, -10) });

    // Ajouter les keys à l'animation
    animation.setKeys(camKeys);

    // Ajouter l'animation à la caméra
    camera.animations.push(animation);

    const rotationAnimation = new Animation(
      "cameraRotationAnimation",
      "rotation",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    // Définir les frames clés de l'animation de rotation
    const rotationKeys: { frame: number; value: Vector3 }[] = [];
    // anim num 1
    // rotationKeys.push({frame: 0, value: new Vector3(Math.PI/6, 0, 0)});// Rotation actuelle de la caméra
    // rotationKeys.push({frame: 2 * this.fps, value: new Vector3(Math.PI/6, -Math.PI/4, 0)});
    // rotationKeys.push({frame: 4 * this.fps, value: new Vector3(Math.PI/6, -Math.PI/2, 0)});// Durée de l'animation (en frames)// Rotation vers le bas de 20 degrés
    // rotationKeys.push({frame: 6 * this.fps, value: new Vector3(Math.PI/6, -3*Math.PI/4, 0)});
    // rotationKeys.push({frame: 8 * this.fps, value: new Vector3(Math.PI/6, -Math.PI, 0)});
    // rotationKeys.push({frame: 10 * this.fps, value: new Vector3(Math.PI/6, -5*Math.PI/4, 0)});
    // rotationKeys.push({frame: 12 * this.fps, value: new Vector3(Math.PI/6, -3*Math.PI/2, 0)});
    // rotationKeys.push({frame: 14 * this.fps, value: new Vector3(Math.PI/6, -7*Math.PI/4, 0)});
    // rotationKeys.push({frame: 16 * this.fps, value: new Vector3(Math.PI/6, -2*Math.PI, 0)});
    // rotationKeys.push({frame: 18 * this.fps, value: new Vector3(Math.PI/6, -2*Math.PI, 0)});

    // anim num 2
    rotationKeys.push({ frame: 0, value: new Vector3(Math.PI / 2, 0, 0) });
    rotationKeys.push({
      frame: 4 * this.fps,
      value: new Vector3(Math.PI / 6, (-2 * Math.PI) / 3, 0),
    });
    rotationKeys.push({
      frame: 9 * this.fps,
      value: new Vector3(Math.PI / 6, -Math.PI / 3, 0),
    });
    rotationKeys.push({
      frame: 11 * this.fps,
      value: new Vector3(Math.PI / 6, -Math.PI, 0),
    });

    rotationAnimation.setKeys(rotationKeys);
    camera.animations.push(rotationAnimation);

    // Lancer l'animation
    this.scene.beginAnimation(camera, 0, 11 * this.fps, false);

    setTimeout(
      () => {
        this.scene._activeCamera = this._player!.activatePlayerCamera();
      },
      11 * this.fps * 40,
    );

    this.scene.activeCamera = camera;
  }

  async exit() {
    // Nettoyer la scène lors de la sortie de cet état
    document.getElementById("map-keybind")!.classList.add("hidden");
    document.getElementById("options-keybind")!.classList.add("hidden");
    console.log("exit in game state");
    this.cleanup();
  }

  update() {
    this.jumpGame.update();

    // ouvre/ferme la carte
    if (
      this._input.keyMap &&
      document.getElementById("carte-dialog")!.classList.contains("hidden") &&
      !document.getElementById("map-keybind")!.classList.contains("hidden")
    ) {
      this._environment?.carte.openCarte();
      this.removeHandlePointerLock();
    } else if (
      this._input.keyMap &&
      !document.getElementById("carte-dialog")!.classList.contains("hidden") &&
      !document.getElementById("map-keybind")!.classList.contains("hidden")
    ) {
      this.addHandlePointerLock();
      this._environment?.carte.closeCarte();
    }

    // if (!this.isGameObjectInterfacedPressed && this._input.keyGameObjects && document.getElementById("objectsFound")!.classList.contains("hidden")
    //   && !document.getElementById("objects-keybind")!.classList.contains("hidden")){
    //   document.getElementById("objectsFound")!.classList.remove("hidden");
    //   document.getElementById("options")!.classList.add("hidden");
    //   setTimeout(() => {
    //     this.isGameObjectInterfacedPressed = true;
    //     this.isOptionsInterfacedPressed = false;
    //   },250);

    // } else if (this.isGameObjectInterfacedPressed && this._input.keyGameObjects && !document.getElementById("objectsFound")!.classList.contains("hidden")
    //   && !document.getElementById("objects-keybind")!.classList.contains("hidden")){
    //   document.getElementById("objectsFound")!.classList.add("hidden");
    //   setTimeout(() => {
    //     this.isGameObjectInterfacedPressed = false;
    //   },250);
    // }

    if (
      this.isOptionsInterfacedPressed &&
      this._input.keyOptions &&
      !document.getElementById("options")!.classList.contains("hidden")
    ) {
      this.addHandlePointerLock();
      document.getElementById("options")!.classList.add("hidden");
      setTimeout(() => {
        this.isOptionsInterfacedPressed = false;
      }, 250);
    } else if (
      !this.isOptionsInterfacedPressed &&
      this._input.keyOptions &&
      document.getElementById("options")!.classList.contains("hidden")
    ) {
      // Jouvre les options
      document.getElementById("options")!.classList.remove("hidden");
      document.getElementById("objectsFound")!.classList.add("hidden");
      document.getElementById("aide-container")!.classList.add("hidden");
      document.getElementById("tips-container")!.classList.add("hidden");
      this.removeHandlePointerLock();
      setTimeout(() => {
        this.isOptionsInterfacedPressed = true;
        this.isGameObjectInterfacedPressed = false;
      }, 250);
    }
  }

  private async _loadCharacterAssets(scene: Scene) {
    async function loadCharacter() {
      //collision mesh
      const outer = MeshBuilder.CreateBox(
        "outer",
        { width: 3.5, depth: 2.5, height: 15 },
        scene,
      );
      // pour afficher la box qui sert de collision
      outer.isVisible = false;
      outer.isPickable = false;
      outer.checkCollisions = true;
      //move origin of box collider to the bottom of the mesh (to match player mesh)
      outer.bakeTransformIntoVertices(Matrix.Translation(0, 7, 0));
      //for collisions
      outer.ellipsoid = new Vector3(1, 1.5, 1);
      outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

      let urlPath = localStorage.getItem("pathCharacter");
      if (!urlPath) {
        urlPath = "perso.glb";
      }

      //--IMPORTING MESH--
      return SceneLoader.ImportMeshAsync(
        null,
        "./models/characters/",
        urlPath,
        scene,
      ).then((result) => {
        const root = result.meshes[0];
        //body is our actual player mesh
        const body = root;
        body.parent = outer;
        body.isPickable = false;
        body.getChildMeshes().forEach((m) => {
          m.isPickable = false;
        });
        body.scaling = new Scaling(0.075);
        body.showBoundingBox = true;
        // enlever l'animation à l'indice 0 de animationsGroups
        result.animationGroups[0].stop();
        const idle = result.animationGroups.find(
          (ag) => ag.name === "Anim|idle",
        );
        idle?.start();
        //return the mesh and animations
        return {
          mesh: outer as Mesh,
          animationGroups: result.animationGroups,
        };
      });
    }

    return loadCharacter().then((assets) => {
      this.assets = assets;
    });
  }

  private async _initPlayer(scene: Scene): Promise<void> {
    new HemisphericLight("HemiLight", new Vector3(0, 1, 1), scene);

    //Create the player
    this._player = new Player(
      this.assets,
      scene,
      this,
      this._input,
    );
    this._player.mesh.position = new Vector3(-185, 7, -90);
  }

  async setEnvironment(): Promise<void> {
    // ENVIRONMENT
    this._environment = new Environment(this.scene, this._player, this);
    this.tpButtonListener();

    const soundActive = storeSound.state.etat;
    if (!soundActive) {
      this.game.playTrack("inGame");
    } else {
      this.game.changeActive("inGame");
    }

    await this._environment.load();
  }

  public tpButtonListener(): void {
    // 100m
    this.addEventListenerById("100mFacile", "click", () => {
      this.game.changeState(new RunningGameState(this.game, this.canvas));
    });
    this.addEventListenerById("100mMoyen", "click", () => {
      this.game.changeState(
        new RunningGameState(this.game, this.canvas, "intermediate")
      );
    });
    this.addEventListenerById("100mDifficile", "click", () => {
      this.game.changeState(
        new RunningGameState(this.game, this.canvas, "hard")
      );
    });
    this.addEventListenerById("runningGame-duel", "click", () => {
      this.game.changeState(
        new RunningGameState(this.game, this.canvas, "easy", true, 2)
      );
    });
    // natation
    this.addEventListenerById("natationFacile", "click", () => {
      this.game.changeState(new NatationGameState(this.game, this.canvas));
    });
    this.addEventListenerById("natationMoyen", "click", () => {
      this.game.changeState(
        new NatationGameState(this.game, this.canvas, "intermediate"),
      );
    });
    this.addEventListenerById("natationDifficile", "click", () => {
      this.game.changeState(
        new NatationGameState(this.game, this.canvas, "hard"),
      );
    });
    // plogeon
    this.addEventListenerById("plongeonFacile", "click", () => {
      this.game.changeState(new PlongeonGameState(this.game, this.canvas));
    });
    this.addEventListenerById("plongeonMoyen", "click", () => {
      this.game.changeState(
        new PlongeonGameState(this.game, this.canvas, "intermediate"),
      );
    });
    this.addEventListenerById("plongeonDifficile", "click", () => {
      this.game.changeState(
        new PlongeonGameState(this.game, this.canvas, "hard"),
      );
    });
    // boxe
    this.addEventListenerById("boxeFacile", "click", () => {
      this.game.changeState(new BoxeGameState(this.game, this.canvas));
    });
    this.addEventListenerById("boxeMoyen", "click", () => {
      this.game.changeState(
        new BoxeGameState(this.game, this.canvas, "intermediate"),
      );
    });
    this.addEventListenerById("boxeDifficile", "click", () => {
      this.game.changeState(new BoxeGameState(this.game, this.canvas, "hard"));
    });
    // tir a larc
    this.addEventListenerById("tirArcFacile", "click", () => {
      this.game.changeState(new TirArcGameState(this.game, this.canvas));
    });
    this.addEventListenerById("tirArcMoyen", "click", () => {
      this.game.changeState(
        new TirArcGameState(this.game, this.canvas, "intermediate"),
      );
    });
    this.addEventListenerById("tirArcDifficile", "click", () => {
      this.game.changeState(
        new TirArcGameState(this.game, this.canvas, "hard"),
      );
    });
    // javelot
    this.addEventListenerById("javelotFacile", "click", () => {
      this.game.changeState(new JavelotGameState(this.game, this.canvas));
    });
    this.addEventListenerById("javelotMoyen", "click", () => {
      this.game.changeState(
        new JavelotGameState(this.game, this.canvas, "intermediate"),
      );
    });

    this.addEventListenerById("tennisBot", "click", () => {
      this.game.changeState(
        new TennisGameState(this.game, this.canvas, false),
      );
      document.getElementById("tennistp")!.classList.add("hidden");
    });
    this.addEventListenerById("tennisDuel", "click", () => {
      this.game.changeState(
        new TennisGameState(this.game, this.canvas, true),
      );
      document.getElementById("tennistp")!.classList.add("hidden");
    });
    this.addEventListenerById("javelotDifficile", "click", () => {
      this.game.changeState(
        new JavelotGameState(this.game, this.canvas, "hard"),
      );
    });
  }

  public listenerGui(): void {
    // GUI démarrage du jeu
    this.addEventListenerById("close-onboarding", "click", () => {
      document.getElementById("onboarding-container")!.classList.add("hidden");
    });
    this.addEventListenerById("close-objects", "click", () => {
      document.getElementById("objectsFound")!.classList.add("hidden");
      setTimeout(() => {
        this.isGameObjectInterfacedPressed = false;
      }, 250);
    });

    // GUI options
    this.addEventListenerById("open-objects-menu", "click", () => {
      document.getElementById("options")!.classList.add("hidden");
      document.getElementById("objectsFound")!.classList.remove("hidden");
      setTimeout(() => {
        this.isOptionsInterfacedPressed = false;
        this.isGameObjectInterfacedPressed = true;
      }, 250);
    });
    this.addEventListenerById("open-aide-menu", "click", () => {
      document.getElementById("aide-container")!.classList.remove("hidden");
      document.getElementById("options")!.classList.add("hidden");
      setTimeout(() => {
        this.isOptionsInterfacedPressed = false;
      }, 250);
    });
    this.addEventListenerById("close-aide", "click", () => {
      document.getElementById("aide-container")!.classList.add("hidden");
    });
    this.addEventListenerById("open-tips-menu", "click", () => {
      document.getElementById("tips-container")!.classList.remove("hidden");
      document.getElementById("options")!.classList.add("hidden");
      setTimeout(() => {
        this.isOptionsInterfacedPressed = false;
      }, 250);
    });
    this.addEventListenerById("close-tips", "click", () => {
      document.getElementById("tips-container")!.classList.add("hidden");
    });
    this.addEventListenerById("back-options", "click", () => {
      document.getElementById("aide-container")!.classList.add("hidden");
      document.getElementById("options")!.classList.remove("hidden");
      setTimeout(() => {
        this.isOptionsInterfacedPressed = true;
      }, 250);
    });
    this.addEventListenerById("back-options2", "click", () => {
      document.getElementById("tips-container")!.classList.add("hidden");
      document.getElementById("options")!.classList.remove("hidden");
      setTimeout(() => {
        this.isOptionsInterfacedPressed = true;
      }, 250);
    });
    this.addEventListenerById("back-options3", "click", () => {
      document.getElementById("objectsFound")!.classList.add("hidden");
      document.getElementById("options")!.classList.remove("hidden");
      setTimeout(() => {
        this.isOptionsInterfacedPressed = true;
      }, 250);
    });
    this.addEventListenerById("close-options", "click", () => {
      document.getElementById("options")!.classList.add("hidden");
      setTimeout(() => {
        this.isOptionsInterfacedPressed = false;
      }, 250);
    });
    this.addEventListenerById("back-menu", "click", () => {
      // new Game(this.canvas);
      router.push({ name: "Landing" });
    });
    this.addEventListenerById("close-records", "click", () => {
      document
        .getElementById("scoreboard-station-dialog")!
        .classList.add("hidden");
    });

    // GUI minimap
    this.addEventListenerById("tp-button", "click", () => {
      const pos = new Vector3(-185, 7, -90);
      this._player!.mesh.position = pos;
      this._environment?.carte.closeCarte(pos);
      this.addHandlePointerLock();
    });
    this.addEventListenerById("jump-button", "click", () => {
      const pos = new Vector3(-71, 7, -128.67);
      this._player!.mesh.position = pos;
      this._environment?.carte.closeCarte(pos);
      this.addHandlePointerLock();
    });
    this.addEventListenerById("foret-button", "click", () => {
      const pos = new Vector3(-64.1, 7, 14);
      this._player!.mesh.position = pos;
      this._environment?.carte.closeCarte(pos);
      this.addHandlePointerLock();
    });
    this.addEventListenerById("pnj-button", "click", () => {
      const pos = new Vector3(-184.75, 7, -11.2);
      this._player!.mesh.position = pos;
      this._environment?.carte.closeCarte(pos);
      this.addHandlePointerLock();
    });

    // GUI sound
    this.addEventListenerById("son", "input", (event) => {
      const newValue = (event.target as HTMLInputElement)?.value;
      storeSound.commit("setSound", newValue);
      if (storeSound.state.sound > storeSound.state.oldSound) {
        const newVolume =
          1 + (storeSound.state.sound - storeSound.state.oldSound) / 100;
        this.game.getSoundManager().setVolumeAllTracks(newVolume);
        // console.log(1+(storeSound.state.sound - storeSound.state.oldSound)/100)
      } else if (storeSound.state.sound < storeSound.state.oldSound) {
        const newVolume =
          1 - (storeSound.state.oldSound - storeSound.state.sound) / 100;
        this.game.getSoundManager().setVolumeAllTracks(newVolume);
        // console.log(1-(storeSound.state.oldSound - storeSound.state.sound)/100)
      } else {
        this.game.getSoundManager().setVolumeAllTracks(1);
        // console.log(1)
      }
    });
  }

  public disableTpDifficulty(): void {
    //100m
    const level100m = localStorage.getItem("level100m");
    if (level100m === null) {
      localStorage.setItem("level100m", "easy");
    } else if (level100m === "intermediate") {
      document.getElementById("100mMoyen")!.removeAttribute("disabled");
    } else if (level100m === "hard") {
      document.getElementById("100mMoyen")!.removeAttribute("disabled");
      document.getElementById("100mDifficile")!.removeAttribute("disabled");
    }

    //natation
    const levelNatation = localStorage.getItem("levelNatation");
    if (levelNatation === null) {
      localStorage.setItem("levelNatation", "easy");
    } else if (levelNatation === "intermediate") {
      document.getElementById("natationMoyen")!.removeAttribute("disabled");
    } else if (levelNatation === "hard") {
      document.getElementById("natationMoyen")!.removeAttribute("disabled");
      document.getElementById("natationDifficile")!.removeAttribute("disabled");
    }

    //plongeon
    const levelPlongeon = localStorage.getItem("levelPlongeon");
    if (levelPlongeon === null) {
      localStorage.setItem("levelPlongeon", "easy");
    } else if (levelPlongeon === "intermediate") {
      document.getElementById("plongeonMoyen")!.removeAttribute("disabled");
    } else if (levelPlongeon === "hard") {
      document.getElementById("plongeonMoyen")!.removeAttribute("disabled");
      document.getElementById("plongeonDifficile")!.removeAttribute("disabled");
    }

    //tir a larc
    const levelTirArc = localStorage.getItem("levelTirArc");
    if (levelTirArc === null) {
      localStorage.setItem("levelTirArc", "easy");
    } else if (levelTirArc === "intermediate") {
      document.getElementById("tirArcMoyen")!.removeAttribute("disabled");
    } else if (levelTirArc === "hard") {
      document.getElementById("tirArcMoyen")!.removeAttribute("disabled");
      document.getElementById("tirArcDifficile")!.removeAttribute("disabled");
    }

    //javelot
    const levelJavelot = localStorage.getItem("levelJavelot");
    if (levelJavelot === null) {
      localStorage.setItem("levelJavelot", "easy");
    } else if (levelJavelot === "intermediate") {
      document.getElementById("javelotMoyen")!.removeAttribute("disabled");
    } else if (levelJavelot === "hard") {
      document.getElementById("javelotMoyen")!.removeAttribute("disabled");
      document.getElementById("javelotDifficile")!.removeAttribute("disabled");
    }

    //boxe
    const levelBoxe = localStorage.getItem("levelBoxe");
    if (levelBoxe === null) {
      localStorage.setItem("levelBoxe", "easy");
    } else if (levelBoxe === "intermediate") {
      document.getElementById("boxeMoyen")!.removeAttribute("disabled");
    } else if (levelBoxe === "hard") {
      document.getElementById("boxeMoyen")!.removeAttribute("disabled");
      document.getElementById("boxeDifficile")!.removeAttribute("disabled");
    }
  }
}

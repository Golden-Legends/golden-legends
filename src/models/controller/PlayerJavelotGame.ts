import {
  ActionManager,
  AnimationGroup,
  Camera,
  ExecuteCodeAction,
  FreeCamera,
  Mesh,
  MeshBuilder,
  Ray,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";
import { store } from "@/components/gui/store.ts";
import { PlayerInputJavelotGame } from "../inputsMangement/PlayerInputJavelotGame";
import { storeJavelot } from "@/components/gui/storeJavelot.ts";

const PLAYER_HEIGHT = 3;
const PLAYER_RADIUS = 0.05;
const PLAYER_SCALING = 0.018;

export class PlayerJavelotGame {
  private static readonly GRAVITY: number = -0.25;

  // posiution of the player
  private _x: number;
  private _y: number;
  private _z: number;

  // Position dans le monde
  public transform: Mesh;
  // Mesh
  private gameObject: Mesh = new Mesh("player");

  // Partage du state
  private scene: Scene;
  private assetPath: string;

  // animations
  private animationsGroup: AnimationGroup[] = [];

  // ANIMATIONS
  private idleAnim: AnimationGroup = new AnimationGroup("idle");
  private win: AnimationGroup = new AnimationGroup("Anim|win");
  private lancer: AnimationGroup = new AnimationGroup("Anim|throw");

  public _isIdle: boolean = false;
  public _isWin: boolean = false;
  public _isLancer: boolean = false;

  private afficherGuiTir: boolean = false;
  private gameActive: boolean = false;
  private isTextTirShow: boolean = false;
  public isSpacedPressedForAnim: boolean = false;

  public horizontalDirection: number = 0;
  public verticalDirection: number = 0;
  public compteur: number = 0;

  private isSpeedReady: boolean = true;
  private power = 0;

  // input
  // mettrre input manager et retravailler input manager pour qu'il soit plus générique et permettent la création de déplacement de bot
  private _input: PlayerInputJavelotGame;
  // camera
  private _camera?: Camera;

  private _deltaTime: number = 0;

  private endGameMesh: Mesh;
  private isEndGame: boolean = false;
  private raceEndTime: number = 0;

  private currentTime: number = 0;

  constructor(
    x: number,
    y: number,
    z: number,
    scene: Scene,
    assetPath: string,
    endMesh: Mesh,
    input: PlayerInputJavelotGame,
    activeCamera: boolean,
  ) {
    this._x = x;
    this._y = y;
    this._z = z;
    this.scene = scene;
    this.assetPath = assetPath;
    this._input = input;
    this._camera;
    this.transform = MeshBuilder.CreateCapsule(
      "player",
      { height: PLAYER_HEIGHT, radius: PLAYER_RADIUS },
      this.scene,
    );
    this.transform.position = new Vector3(this._x, this._y + 1, this._z);
    this.transform.rotation = new Vector3(0, Math.PI, 0);
    this.transform.isVisible = false; // mettre à faux par la suites
    if (activeCamera) {
      this._camera = this.createCameraPlayer(this.transform);
    }
    this.endGameMesh = endMesh;
    this.endGameMesh.actionManager = new ActionManager(this.scene);
    this.endGameMesh.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnIntersectionEnterTrigger,
          parameter: this.transform,
        },
        () => {
          this.isEndGame = true;
          this.stopAnimations();
          this.raceEndTime = this.currentTime;
          // console.log(`Joueur fin : `, this.raceEndTime);
        },
      ),
    );
  }

  public async init() {
    const result = await SceneLoader.ImportMeshAsync(
      "",
      "",
      this.assetPath,
      this.scene,
    );
    this.gameObject = result.meshes[0] as Mesh;
    this.gameObject.scaling = new Scaling(PLAYER_SCALING);
    this.gameObject.position = new Vector3(0, -PLAYER_HEIGHT / 2 + 0.5, 0);
    this.gameObject.rotate(Vector3.UpReadOnly, Math.PI);
    this.gameObject.bakeCurrentTransformIntoVertices();
    this.gameObject.parent = this.transform;
    this.gameObject.isPickable = false;
    this.gameObject.getChildMeshes().forEach((m) => {
      m.isPickable = false;
    });
    this.animationsGroup = result.animationGroups;
    this.animationsGroup[0].stop();
    // set animation
    const { idle, win, lancer } = this.setAnimation();
    this.lancer = lancer;
    this.win = win;
    this.idleAnim = idle;
    this.idleAnim.start(true);
    this._isIdle = true;
  }

  public play(delta: number, currentTime: number) {
    // console.log("play");
    this._deltaTime = delta / 10;
    this.currentTime = currentTime;
    if (!this.isEndGame) {
      if (!this.gameActive) {
        this.isSpacedPressedForAnim = true;
        this.gameActiveState();
        document
          .getElementById("javelotGame-text-speedbar")!
          .classList.remove("hidden");
      } else {
        //todo récuperer ici les touches qu'enfonce le player
        // console.log("gameActive");
        this.processInput();
      }
    } else {
      // console.log("endGame");
    }
  }

  private startTime = 0;
  private lastSwitchTime = 0;
  private test: boolean = false;

  public processInput(): void {
    if (this.compteur === 0) {
      if (!this.test) {
        this.startTime = performance.now();
        this.lastSwitchTime = this.startTime;
        this.test = true;
      }
      if (this.lastSwitchTime - this.startTime < 5000) {
        this.lastSwitchTime = performance.now();
        if (this._input.figures) {
          if (this.power < 25) {
            this.power += 2;
          } else if (this.power > 25 && this.power < 50) {
            this.power += 1.25;
          } else if (this.power > 50 && this.power < 75) {
            this.power += 1;
          } else if (this.power >= 75 && this.power < 85) {
            this.power += 0.75;
          } else if (this.power >= 85 && this.power < 100) {
            this.power += 0.5;
          }
          this._input.figures = false;
        }
        if (this._input.figured) {
          this._input.figured = false;
          if (this.power < 25) {
            this.power += 2;
          } else if (this.power > 25 && this.power < 50) {
            this.power += 1.25;
          } else if (this.power > 50 && this.power < 75) {
            this.power += 0.75;
          } else if (this.power >= 75 && this.power < 85) {
            this.power += 0.5;
          } else if (this.power >= 85 && this.power < 100) {
            this.power += 0.25;
          }
        }
        storeJavelot.commit("setSpeedBar", this.power);
      } else {
        // console.log(this.power);
        document
          .getElementById("javelotGame-angle")!
          .classList.remove("hidden");
        this.verticalDirection = this.mapValueToDiscreteRange(
          this.power,
          0,
          100,
          1,
          7,
        );
        this.compteur++;
        storeJavelot.commit("setPlayable", true);
      }
      /* if (this._input.figureh || this._input.figurev) {
        this.power += 2;
      }*/
      /*if (this.isSpeedReady) {
        this.isSpeedReady = false;
        setTimeout(() => {

        }, 5000);
      }*/
    } else if (this.compteur === 1) {
      if (!storeJavelot.state.playable) {
        this.horizontalDirection = this.mapValueToDiscreteRange(
          storeJavelot.state.angle,
        );
        this.compteur++;
        this.isEndGame = true;
        this.runLancer();
      }
    }
  }

  public mapValueToDiscreteRange(
    value: number,
    srcMin: number = 0,
    srcMax: number = 90,
    destMin: number = -3,
    destMax: number = 3,
  ): number {
    // Vérifier si la valeur est dans la plage d'origine
    if (value < srcMin || value > srcMax) {
      throw new Error(
        `La valeur ${value} est en dehors de la plage de source [${srcMin}, ${srcMax}]`,
      );
    }

    const normalizedValue = (value - srcMin) / (srcMax - srcMin);

    const mappedValue = normalizedValue * (destMax - destMin) + destMin;

    return Math.round(mappedValue);
  }

  public gameActiveState(): void {
    this.gameActive = !this.gameActive;
  }

  public getIsEndGame(): boolean {
    return this.isEndGame;
  }

  public getEndTime(): number {
    return this.raceEndTime;
  }

  private setAnimation(): {
    idle: AnimationGroup;
    win: AnimationGroup;
    lancer: AnimationGroup;
  } {
    const idle = this.animationsGroup.find((ag) => ag.name === "Anim|idle");
    const win = this.animationsGroup.find((ag) => ag.name === "Anim|win");
    const lancer = this.animationsGroup.find((ag) => ag.name === "Anim|throw");
    return { idle: idle!, win: win!, lancer: lancer! };
  }

  public runLancer() {
    this.idleAnim.stop();
    this.lancer.start(false, 1.0, this.lancer.from, this.lancer.to, false);
    this._isLancer = true;
    this.lancer.onAnimationEndObservable.addOnce(() => {
      this.transform.position = new Vector3(
        this.transform.position.x,
        this.transform.position.y,
        this.transform.position.z - 0.14,
      );
      this._isLancer = false;
      this.stopAnimations();
    });
  }

  public runWin() {
    this.idleAnim.stop();
    this._isIdle = false;
    this.win.start(true, 1.0, this.win.from, this.win.to, false);
    this._isWin = true;
  }

  stopAnimations() {
    try {
      this.idleAnim.start(true);
      this._isIdle = true;
    } catch (error) {
      throw new Error("Method not implemented.");
    }
  }

  public afficherGui(): boolean {
    return this.afficherGuiTir;
  }
  public setAfficherGui() {
    this.afficherGuiTir = !this.afficherGuiTir;
  }

  private _floorRaycast(
    offsetx: number,
    offsetz: number,
    raycastlen: number,
  ): Vector3 {
    let raycastFloorPos = new Vector3(
      this.transform.position.x + offsetx,
      this.transform.position.y + 0.5,
      this.transform.position.z + offsetz,
    );
    let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

    let predicate = function (mesh) {
      return mesh.isPickable && mesh.isEnabled();
    };
    let pick = this.scene.pickWithRay(ray, predicate);

    return pick?.pickedPoint || Vector3.Zero();
  }

  private _isGrounded(): boolean {
    if (this._floorRaycast(0, 0, 0.6).equals(Vector3.Zero())) {
      return false;
    } else {
      return true;
    }
  }

  public _updateGroundDetection(): void {
    this._deltaTime = this.scene.getEngine().getDeltaTime() / 10;

    // Stocker le résultat de la première invocation de _isGrounded()
    const isGrounded = this._isGrounded();

    if (!isGrounded) {
      this.transform.moveWithCollisions(
        new Vector3(0, PlayerJavelotGame.GRAVITY, 0),
      );
    }
  }

  public animationPlayer(): void {
    // Animation Management
    this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
    this._isIdle = true;
  }

  public createCameraPlayer(mesh: Mesh): FreeCamera {
    const camera = new FreeCamera(
      "camera1",
      new Vector3(-4, 2, 13),
      this.scene,
    );
    camera.setTarget(
      new Vector3(mesh.position.x, mesh.position.y, mesh.position.z),
    );
    return camera;
  }

  public setCamera(camera: Camera) {
    this._camera = camera;
  }
}

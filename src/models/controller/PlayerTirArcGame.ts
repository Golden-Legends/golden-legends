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
import { PlayerInputTirArcGame } from "../inputsMangement/PlayerInputTirArcGame";
import { storeTirArc } from "@/components/gui/storeTirArc";

const PLAYER_HEIGHT = 3;
const PLAYER_RADIUS = 0.05;
const PLAYER_SCALING = 0.018;

export class PlayerTirArcGame {
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
  private priseArc: AnimationGroup = new AnimationGroup("Anim|bow2");
  private tir: AnimationGroup = new AnimationGroup("Anim|bow1");
  private win: AnimationGroup = new AnimationGroup("Anim|win");

  public _isIdle: boolean = false;
  private _isPriseArc: boolean = false;
  private _isTir: boolean = false;
  public _isWin: boolean = false;

  private afficherGuiTir: boolean = false;
  private gameActive: boolean = false;
  private isTextTirShow: boolean = false;
  public isSpacedPressedForAnim: boolean = false;

  public horizontalDirection: number = 0;
  public verticalDirection: number = 0;
  public compteur: number = 0;

  // run
  private readonly MIN_RUN_SPEED = 0.1;
  private baseSpeed: number = 0.04; // Vitesse de déplacement initiale
  private acceleration: number = 0.02; // Ajustez selon vos besoins
  private minDelayBetweenSwitches: number = 800; // Délai minimal entre chaque alternance en millisecondes
  private lastSwitchTime: number = 0;
  private direction: number = 1; // -1 pour gauche, 1 pour droite, 0 pour arrêt
  private leftPressed: boolean = false;
  private rightPressed: boolean = false;
  private deceleration: number = 0.0035; // Décélération lorsqu'aucune touche n'est enfoncée

  // input
  // mettrre input manager et retravailler input manager pour qu'il soit plus générique et permettent la création de déplacement de bot
  private _input: PlayerInputTirArcGame;
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
    input: PlayerInputTirArcGame,
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
          // (`Joueur fin : `, this.raceEndTime);
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
    const { idle, priseArc, tir, win } = this.setAnimation();
    this.win = win;
    this.priseArc = priseArc;
    this.tir = tir;
    this.idleAnim = idle;
    this.idleAnim.start(true);
    this._isIdle = true;
  }

  public play(delta: number, currentTime: number) {
    // ("play");
    this._deltaTime = delta / 10;
    this.currentTime = currentTime;
    if (!this.isEndGame) {
      if (!this.gameActive) {
        if (!this.isTextTirShow) {
          this.isTextTirShow = true;
          document
            .getElementById("tirArcGame-text-tir")!
            .classList.remove("hidden");
        } else if (this._input.space) {
          document
            .getElementById("tirArcGame-text-tir")!
            .classList.add("hidden");
          this.isSpacedPressedForAnim = true;
          this.gameActiveState();
        }
      } else {
        //todo récuperer ici les touches qu'enfonce le player
        // ("gameActive");
        this.processInput();
      }
    } else {
      // ("endGame");
    }
  }

  public processInput(): void {
    if (this.compteur === 0) {
      if (this._input.figureh) {
        // this.horizontalDirection = Math.floor(Math.random() * 19) - 9;
        storeTirArc.state.positionH;
        this.horizontalDirection = this.mapValueToDiscreteRange(
          storeTirArc.state.positionH,
        );
        this.compteur++;
        this.horizontalDirection;
      }
    } else if (this.compteur === 1) {
      if (this._input.figurev) {
        // this.verticalDirection = Math.floor(Math.random() * 19) - 9;
        storeTirArc.state.positionV;
        this.verticalDirection = -this.mapValueToDiscreteRange(
          storeTirArc.state.positionV,
        );
        this.compteur++;
        this.isEndGame = true;
        this.verticalDirection;
        this.runTir();
      }
    }
  }

  public mapValueToDiscreteRange(
    value: number,
    srcMin: number = -4,
    srcMax: number = 24,
    destMin: number = -9,
    destMax: number = 9,
  ): number {
    // Vérifier si la valeur est dans la plage d'origine
    if (value < srcMin || value > srcMax) {
      throw new Error(
        `La valeur ${value} est en dehors de la plage de source [${srcMin}, ${srcMax}]`,
      );
    }

    // Normaliser la valeur dans la plage [0, 1]
    const normalizedValue = (value - srcMin) / (srcMax - srcMin);

    // Mapper la valeur normalisée dans la plage de destination [-9, 9]
    const mappedValue = normalizedValue * (destMax - destMin) + destMin;

    // Arrondir au nombre entier le plus proche
    const discreteValue = Math.round(mappedValue);

    return discreteValue;
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
    priseArc: AnimationGroup;
    tir: AnimationGroup;
    win: AnimationGroup;
  } {
    const idle = this.animationsGroup.find((ag) => ag.name === "Anim|idle");
    const priseArc = this.animationsGroup.find((ag) => ag.name === "Anim|bow2");
    let tir = this.animationsGroup.find((ag) => ag.name === "Anim|bow1");
    if (tir === undefined) {
      tir = this.animationsGroup.find((ag) => ag.name === "Anim|bow");
    }
    const win = this.animationsGroup.find((ag) => ag.name === "Anim|win");
    return { idle: idle!, priseArc: priseArc!, tir: tir!, win: win! };
  }

  public runPriseArc() {
    this.idleAnim.stop();
    this._isIdle = false;
    this.priseArc.start(
      false,
      1.0,
      this.priseArc.from,
      this.priseArc.to,
      false,
    );
    this._isPriseArc = true;
    this.priseArc.onAnimationEndObservable.addOnce(() => {
      //    this.afficherGuiTir = true;
    });
  }

  public runTir() {
    this.priseArc.stop();
    this.tir.start(false, 1.0, this.tir.from, this.tir.to, false);
    this._isTir = true;
    this.tir.onAnimationEndObservable.addOnce(() => {
      this._isTir = false;
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

  // public processInput(): void {

  //     // Check if the minimum delay between each alternation is respected
  //     if (this.currentTime - this.lastSwitchTime < this.minDelayBetweenSwitches) {
  //         return;
  //     }

  //     // If the left key or the right key is pressed
  //     if (this._input.left !== this._input.right) {
  //         const keyJustPressed = this._input.left ? !this.leftPressed : !this.rightPressed;

  //         // If the key was just pressed, increase the speed
  //         if (keyJustPressed) {
  //             this.baseSpeed += this.acceleration;
  //             this.leftPressed = this._input.left;
  //             this.rightPressed = this._input.right;
  //             this.lastSwitchTime = this.currentTime; // Update the time of the last alternation
  //         }
  //     }
  //     // If neither key is pressed or both keys are pressed
  //     else {
  //         // If both keys were pressed previously or speed is greater than 0, reset the speed or decelerate
  //         if ((this.leftPressed && this.rightPressed) || this.baseSpeed > 0) {
  //             this.baseSpeed = Math.max(0, this.baseSpeed - this.deceleration);
  //             this.leftPressed = false;
  //             this.rightPressed = false;
  //         }
  //     }
  // }

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
        new Vector3(0, PlayerTirArcGame.GRAVITY, 0),
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

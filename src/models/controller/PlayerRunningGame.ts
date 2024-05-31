import {
  ActionManager,
  Animation,
  AnimationGroup,
  Camera,
  Color3,
  ExecuteCodeAction,
  FreeCamera,
  Mesh,
  MeshBuilder,
  Ray,
  Scene,
  SceneLoader,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";
import { PlayerInputRunningGame } from "../inputsMangement/PlayerInputRunningGame";
import { store } from "@/components/gui/store.ts";
import { IPlayer } from "../scene/games/RunningGameState";

const PLAYER_HEIGHT = 3;
const PLAYER_RADIUS = 0.5;
const PLAYER_SCALING = 0.12;

export class PlayerRunningGame {
  private static readonly GRAVITY: number = -0.25;
  private name: string;
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
  private runAnim: AnimationGroup = new AnimationGroup("run");
  private walkAnim: AnimationGroup = new AnimationGroup("walk");
  private crouchAnim: AnimationGroup = new AnimationGroup("crouch");
  private idleAnim: AnimationGroup = new AnimationGroup("idle");

  private _isWalking: boolean = false;
  private _isRunning: boolean = false;
  private _isCrouching: boolean = false;
  private _isIdle: boolean = false;

  // run
  private readonly MIN_RUN_SPEED = 0.1; // pour changer d'animation entre marche et course
  private baseSpeed: number = 0.04; // Vitesse de déplacement initiale
  private acceleration: number = 0.02; // Ajustez selon vos besoins
  private minDelayBetweenSwitches: number = 800; // Délai minimal entre chaque alternance en millisecondes
  private lastSwitchTime: number = 0;
  private direction: number = 1; // -1 pour gauche, 1 pour droite, 0 pour arrêt
  private leftPressed: boolean = false;
  private rightPressed: boolean = false;
  private deceleration: number = 0.004; // Décélération lorsqu'aucune touche n'est enfoncée

  // input
  // mettrre input manager et retravailler input manager pour qu'il soit plus générique et permettent la création de déplacement de bot
  private _input: PlayerInputRunningGame;

  private _deltaTime: number = 0;

  private endGameMesh: Mesh;
  private isEndGame: boolean = false;
  private raceEndTime: number = 0;

  private currentTime: number = 0;

  private cubePersonnage: Mesh;

  constructor(
    name: string,
    x: number,
    y: number,
    z: number,
    scene: Scene,
    endMesh: Mesh,
    settingsPlayer: IPlayer,
  ) {
    this.name = name;
    this._x = x;
    this._y = y;
    this._z = z;
    this.scene = scene;
    this.assetPath = settingsPlayer.fileName;
    this._input = new PlayerInputRunningGame(
      scene,
      settingsPlayer.keys.KeyLeft,
      settingsPlayer.keys.KeyRight,
    );
    this.transform = MeshBuilder.CreateCapsule(
      "player",
      { height: PLAYER_HEIGHT, radius: PLAYER_RADIUS },
      this.scene,
    );
    this.transform.position = new Vector3(this._x, this._y + 0.9, this._z);
    this.transform.isVisible = false; // mettre à faux par la suites

    this.cubePersonnage = MeshBuilder.CreatePolyhedron(
      "cubePersonnage",
      { type: 0, size: 0.2 },
      this.scene,
    );
    this.cubePersonnage.rotation = new Vector3(20.2, 20.1, 40);
    this.cubePersonnage.position = new Vector3(
      this._x,
      this._y + 2.4,
      this._z + 0.8,
    );
    const material = new StandardMaterial("materialCube", scene);
    material.emissiveColor = settingsPlayer.color; // Couleur bleu
    // material.diffuseColor = new Color3(255/255, 54/255, 64/255);  // Couleur rouge
    this.cubePersonnage.material = material;

    // Créer l'animation
    const animation = new Animation(
      "pyramidAnimation",
      "position.y",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    // Cadres d'animation
    const keys: { frame: number; value: number }[] = [];
    keys.push({ frame: 0, value: this._y + 2.8 });
    keys.push({ frame: 30, value: this._y + 3.2 });
    keys.push({ frame: 60, value: this._y + 2.8 });

    animation.setKeys(keys);

    // Appliquer l'animation à la pyramide inversée
    this.cubePersonnage.animations = [];
    this.cubePersonnage.animations.push(animation);

    // Démarrer l'animation
    scene.beginAnimation(this.cubePersonnage, 0, 60, true);

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
      `@/../models/characters/${this.assetPath}`,
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
    const { run, walk, crouch, idle } = this.setAnimation();
    this.runAnim = run;
    this.walkAnim = walk;
    this.crouchAnim = crouch;
    this.idleAnim = idle;
    this.crouchAnim.start();
    this._isCrouching = true;
  }

  public play(delta: number, currentTime: number) {
    this._deltaTime = delta / 10;
    this.currentTime = currentTime;
    if (!this.isEndGame) {
      // if(!this.dep){
      //     this.dep = true;
      //     this.cubePersonnage.position.z -= 0.6;
      //     this.cubePersonnage.position.y += 0.7;
      // }
      this.processInput();
      this.movePlayer();
      this.animationPlayer();
    }
  }

  public getIsEndGame(): boolean {
    return this.isEndGame;
  }

  public getEndTime(): number {
    return this.raceEndTime;
  }

  private setAnimation(): {
    run: AnimationGroup;
    walk: AnimationGroup;
    crouch: AnimationGroup;
    idle: AnimationGroup;
  } {
    const sprint = this.animationsGroup.find(
      (ag) => ag.name === "Anim|running",
    );
    const walk = this.animationsGroup.find((ag) => ag.name === "Anim|walk");
    const crouch = this.animationsGroup.find((ag) => ag.name === "Anim|crouch");
    const idle = this.animationsGroup.find((ag) => ag.name === "Anim|idle");
    return { run: sprint!, walk: walk!, crouch: crouch!, idle: idle! };
  }

  stopAnimations() {
    try {
      this.walkAnim.stop();
      this.runAnim.stop();
      this.crouchAnim.stop();
      this.idleAnim.start();
      this._isIdle = true;
      this.cubePersonnage.position.z -= 0.3;
    } catch (error) {
      throw new Error("Method not implemented.");
    }
  }

  public processInput(): void {
    // Check if the minimum delay between each alternation is respected
    if (this.currentTime - this.lastSwitchTime < this.minDelayBetweenSwitches) {
      return;
    }

    // If the left key or the right key is pressed
    if (this._input.left !== this._input.right) {
      const keyJustPressed = this._input.left
        ? !this.leftPressed
        : !this.rightPressed;

      // If the key was just pressed, increase the speed
      if (keyJustPressed) {
        this.baseSpeed += this.acceleration;
        this.leftPressed = this._input.left;
        this.rightPressed = this._input.right;
        this.lastSwitchTime = this.currentTime; // Update the time of the last alternation
      }
    }
    // If neither key is pressed or both keys are pressed
    else {
      // If both keys were pressed previously or speed is greater than 0, reset the speed or decelerate
      if ((this.leftPressed && this.rightPressed) || this.baseSpeed > 0) {
        this.baseSpeed = Math.max(0, this.baseSpeed - this.deceleration);
        this.leftPressed = false;
        this.rightPressed = false;
      }
    }
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

  public getSpeed(): number {
    return this.baseSpeed * 10;
  }

  public _updateGroundDetection(): void {
    this._deltaTime = this.scene.getEngine().getDeltaTime() / 10;

    // Stocker le résultat de la première invocation de _isGrounded()
    const isGrounded = this._isGrounded();

    if (!isGrounded) {
      this.transform.moveWithCollisions(
        new Vector3(0, PlayerRunningGame.GRAVITY, 0),
      );
    }
  }

  public movePlayer(): void {
    // Applique le mouvement en fonction de la direction et de la vitesse
    const direction = this.baseSpeed * this._deltaTime;
    this.transform.position.z += this.direction * direction;
    this.cubePersonnage.position.z = this.transform.getAbsolutePosition().z;
  }

  public animationPlayer(): void {
    // Animation Management
    if (
      (this._isCrouching || this._isIdle) &&
      this.baseSpeed > 0 &&
      !this._isWalking &&
      !this._isRunning
    ) {
      if (this._isCrouching) {
        this.crouchAnim.stop();
        this._isCrouching = false;
      }
      if (this._isIdle) {
        this.idleAnim.stop();
        this._isIdle = false;
      }
      this.walkAnim.start(
        true,
        1.0,
        this.walkAnim.from,
        this.walkAnim.to,
        false,
      );
      this._isWalking = true;
    } else if (
      !this._isCrouching &&
      this._isWalking &&
      this.baseSpeed >= this.MIN_RUN_SPEED &&
      !this._isRunning &&
      !this._isIdle
    ) {
      this.walkAnim.stop();
      this._isWalking = false;
      this.runAnim.start(true, 1.0, this.runAnim.from, this.runAnim.to, false);
      this._isRunning = true;
    } else if (
      !this._isCrouching &&
      this._isRunning &&
      this.baseSpeed < this.MIN_RUN_SPEED &&
      !this._isIdle &&
      !this._isWalking
    ) {
      this.runAnim.stop();
      this._isRunning = false;
      this.walkAnim.start(
        true,
        1.0,
        this.walkAnim.from,
        this.walkAnim.to,
        false,
      );
      this._isWalking = true;
    } else if (
      !this._isCrouching &&
      this._isWalking &&
      this.baseSpeed == 0 &&
      !this._isRunning &&
      !this._isIdle
    ) {
      this.walkAnim.stop();
      this._isWalking = false;
      this.idleAnim.start(
        true,
        1.0,
        this.idleAnim.from,
        this.idleAnim.to,
        false,
      );
      this._isIdle = true;
    }
  }

  public getName(): string {
    return this.name;
  }
}

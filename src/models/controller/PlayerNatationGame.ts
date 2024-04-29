import { ActionManager, AnimationGroup, Camera, Color3, ExecuteCodeAction, FreeCamera, Mesh, MeshBuilder, Ray, RayHelper, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";
import { PlayerInputRunningGame } from "../inputsMangement/PlayerInputRunningGame";
import { store } from "@/components/gui/store.ts";
import { PlayerInputNatationGame } from "../inputsMangement/PlayerInputNatationGame";

const PLAYER_HEIGHT = 0.5;
const PLAYER_RADIUS = 0.1;
const PLAYER_SCALING = 0.032 ;

export class PlayerNatationGame {

    private static readonly GRAVITY: number = -0.25;

    // posiution of the player
    private _x : number;
    private _y : number;
    private _z : number;

    // Position dans le monde
    public transform : Mesh;
    // Mesh
    private gameObject : Mesh = new Mesh("player");

    // Partage du state
    private scene : Scene
    private assetPath : string;

    // animations
    private animationsGroup : AnimationGroup[] = [];

    // ANIMATIONS
    private runAnim: AnimationGroup = new AnimationGroup("run");
    private walkAnim : AnimationGroup = new AnimationGroup("walk");
    private crouchAnim : AnimationGroup = new AnimationGroup("crouch");
    private idleAnim : AnimationGroup = new AnimationGroup("idle");
    private plongeonAnim : AnimationGroup = new AnimationGroup("Anim|plongeon");
    private swimAnim : AnimationGroup = new AnimationGroup("Anim|swim");

    private _isWalking: boolean = false;
    private _isRunning: boolean = false;
    private _isCrouching: boolean = false;
    private _isIdle : boolean = false;

    // run
    private readonly MIN_RUN_SPEED = 0.10;
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
    private _input: PlayerInputNatationGame;
    // camera
    private _camera ?: Camera;

	private _deltaTime: number = 0;

    private endGameMesh: Mesh;
    private secondEndGameMesh: Mesh;
    private isEndGame: boolean = false;
    private raceEndTime: number = 0;

    private currentTime : number = 0;

    constructor(x : number, y : number, z : number, scene : Scene, assetPath : string, endMesh : Mesh, secondEndMesh : Mesh, input : PlayerInputNatationGame, activeCamera: boolean) {
        this._x = x;
        this._y = y;
        this._z = z;
        this.scene = scene;
        this.assetPath = assetPath;
        this._input = input ;
        this._camera
        this.transform = MeshBuilder.CreateCapsule("player", {height: PLAYER_HEIGHT, radius: PLAYER_RADIUS}, this.scene);
        this.transform.position = new Vector3(this._x, this._y, this._z);
        this.transform.isVisible = true; // mettre à faux par la suites
        if (activeCamera) {
            this._camera = this.createCameraPlayer(this.transform);
        }
        this.endGameMesh = endMesh;
        this.endGameMesh.actionManager = new ActionManager(this.scene);
        this.endGameMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.transform
                },
                () => {
                    this.isEndGame = true;
                    this.stopAnimations();
                    this.raceEndTime = this.currentTime;
                    // console.log(`Joueur fin : `, this.raceEndTime);
                }
            )
        );
        this.secondEndGameMesh = secondEndMesh;
    }

    public async init () {
        const result = await SceneLoader.ImportMeshAsync("", "", this.assetPath, this.scene);
        this.gameObject = result.meshes[0] as Mesh;
        this.gameObject.scaling = new Scaling(PLAYER_SCALING);
        this.gameObject.position = new Vector3(0, 0, 0);
        this.gameObject.rotate(Vector3.UpReadOnly, Math.PI);
        this.gameObject.bakeCurrentTransformIntoVertices();
        this.gameObject.parent = this.transform;
        this.gameObject.isPickable = false;
        this.gameObject.getChildMeshes().forEach(m => {
            m.isPickable = false;
        });
        this.animationsGroup = result.animationGroups;
        this.animationsGroup[0].stop();
        // set animation
        const {run, walk, crouch, idle, plongeon, swim} = this.setAnimation();
        this.runAnim = run;
        this.walkAnim = walk;
        this.crouchAnim = crouch;
        this.idleAnim = idle;
        this.plongeonAnim = plongeon;
        this.swimAnim = swim;
        this.crouchAnim.start();
        this._isCrouching = true;        
    }

    public play (delta : number, currentTime : number) {
        this._deltaTime = delta / 10;
        this.currentTime = currentTime;
        if (!this.isEndGame) {
            this.processInput();
            this.movePlayer();
            this.animationPlayer();
        }
    }

    public getIsEndGame() : boolean {
        return this.isEndGame;
    }

    public getEndTime() : number {
        return this.raceEndTime;
    }
    
    private setAnimation () : {run: AnimationGroup, walk: AnimationGroup, crouch: AnimationGroup, idle: AnimationGroup, plongeon: AnimationGroup, swim: AnimationGroup} { 
        const sprint = this.animationsGroup.find(ag => ag.name === "Anim|running");
        const walk = this.animationsGroup.find(ag => ag.name === "Anim|walk");
        const crouch = this.animationsGroup.find(ag => ag.name === "Anim|crouch");
        const idle = this.animationsGroup.find(ag => ag.name === "Anim|idle");
        const plongeon = this.animationsGroup.find(ag => ag.name === "Anim|plongeon");
        const swim = this.animationsGroup.find(ag => ag.name === "Anim|swim");
        return {run: sprint!, walk: walk!, crouch: crouch!, idle: idle!, plongeon: plongeon!, swim: swim!};
    }

    public runPlongeonAnim () {
        this.plongeonAnim.start(false, 1.0, this.plongeonAnim.from, this.plongeonAnim.to, false);
        // stop les autres anims
        this.runAnim.stop();
        this.walkAnim.stop();
        this.crouchAnim.stop();
        this.idleAnim.stop();
    }

    public runSwimAnim () {
        this.swimAnim.start(true, 1.0, this.swimAnim.from, this.swimAnim.to, false);
        // stop les autres anims
        this.runAnim.stop();
        this.walkAnim.stop();
        this.crouchAnim.stop();
        this.idleAnim.stop();
    }

    public playSequentialAnimation () {
        this.plongeonAnim.start(false, 1.0, this.plongeonAnim.from, this.plongeonAnim.to, false);
        this.plongeonAnim.onAnimationEndObservable.addOnce(() => {
            // recupérer le début de la course
            this.runSwimAnim();
            this.transform.position = this.secondEndGameMesh.getAbsolutePosition();
            this.transform.position.z += 0.5;
        });
    }

    stopAnimations() {
        try {
            this.walkAnim.stop();
            this.runAnim.stop();
            this.crouchAnim.stop();
            this.idleAnim.start();
            this._isIdle = true;            
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
            const keyJustPressed = this._input.left ? !this.leftPressed : !this.rightPressed;
    
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

    public movePlayer(): void {
        // Applique le mouvement en fonction de la direction et de la vitesse
        const direction = this.baseSpeed * this._deltaTime; 
        store.commit('setSpeedBar', this.baseSpeed * 10);  
        this.transform.position.z += this.direction * direction;
        if (this._camera) {
            this._camera.position.z += this.direction * direction;
        }
    }

    public animationPlayer(): void {
        // Animation Management
        if ((this._isCrouching || this._isIdle ) && this.baseSpeed > 0 && !this._isWalking && !this._isRunning) {
            if  (this._isCrouching) {
                this.crouchAnim.stop();
                this._isCrouching = false;
            }
            if (this._isIdle) {
                this.idleAnim.stop();
                this._isIdle = false;
            }
            this.walkAnim.start(true, 1.0, this.walkAnim.from, this.walkAnim.to, false);
            this._isWalking = true;
        } else if (!this._isCrouching && this._isWalking && this.baseSpeed >= this.MIN_RUN_SPEED && !this._isRunning && !this._isIdle) {
            this.walkAnim.stop();
            this._isWalking = false;
            this.runAnim.start(true, 1.0, this.runAnim.from, this.runAnim.to, false);
            this._isRunning = true;
        } else if (!this._isCrouching && this._isRunning && this.baseSpeed < this.MIN_RUN_SPEED && !this._isIdle && !this._isWalking) {
            this.runAnim.stop();
            this._isRunning = false;
            this.walkAnim.start(true, 1.0, this.walkAnim.from, this.walkAnim.to, false);
            this._isWalking = true;
        } else if (!this._isCrouching && this._isWalking && this.baseSpeed == 0 && !this._isRunning && !this._isIdle) {
            this.walkAnim.stop();
            this._isWalking = false;
            this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
            this._isIdle = true;
        }
    }

    public createCameraPlayer(mesh : Mesh) : FreeCamera { 
        const camera = new FreeCamera("camera1", new Vector3(4.78, 3.27, 6.38), this.scene);
        camera.setTarget(new Vector3(mesh.position.x, mesh.position.y, mesh.position.z));
        return camera;
    }

    public setCamera (camera : Camera) {
        this._camera = camera;
    }
}
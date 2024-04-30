import { AbstractMesh, ActionManager, AnimationGroup, ExecuteCodeAction, Mesh, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";

const PLAYER_HEIGHT = 0.3;
const PLAYER_RADIUS = 0.05;
const PLAYER_SCALING = 0.018;

export class BotNatation {

    private name: string;

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
    private _isSwimming : boolean = false;
    private _isSpacedPressedForAnim: boolean = false;
    private _isInReturnMesh : boolean = false;
    private _isReturnWasActivated : boolean = false;
    private isSequentialAnimation : boolean = false;

    // run
    private readonly MIN_RUN_SPEED = 0.15;
    private MAX_SPEED = 0;
    private baseSpeed: number = 0; // Vitesse de déplacement initiale
    private direction: number = 1; // -1 pour gauche, 1 pour droite, 0 pour arrêt

    // fin
    private firstEndMesh: Mesh;
    private secondfirstEndMesh: Mesh;
    private returnMesh: Mesh;
    private isEndGame: boolean = false;
    private raceEndTime: number = 0;

    private deltaTime: number = 0;
    private currentTime : number;

    constructor(name: string, startPos: Vector3, endFirstMesh : Mesh, secondEndMesh : Mesh, returnMesh : Mesh, scene : Scene, assetPath : string, maxSpeed : number) {
        this.name = name;
        this.scene = scene;
        this.assetPath = assetPath;
        this.transform = MeshBuilder.CreateCapsule("player", {height: PLAYER_HEIGHT, radius: PLAYER_RADIUS}, this.scene);
        this.transform.position = new Vector3(startPos.x, startPos.y, startPos.z);
        this.transform.isVisible = false; // mettre à faux par la suites
        this.firstEndMesh = endFirstMesh;
        this.secondfirstEndMesh = secondEndMesh;
        this.returnMesh = returnMesh;
        this.setActionManager();
        this.currentTime = 0;
        this.MAX_SPEED = maxSpeed;

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
        const {run, walk, crouch, idle} = this.setAnimation();
        this.runAnim = run;
        this.walkAnim = walk;
        this.crouchAnim = crouch;
        this.idleAnim = idle;
        this.crouchAnim.start();
        this._isCrouching = true;        
    }

    public getIsEndGame() : boolean {
        return this.isEndGame;
    }

    public getEndTime() : number {
        return this.raceEndTime;
    }

    public getName() : string { 
        return this.name;
    }

    private setAnimation () : {run: AnimationGroup, walk: AnimationGroup, crouch: AnimationGroup, idle: AnimationGroup} { 
        const sprint = this.animationsGroup.find(ag => ag.name.includes("sprint"));
        const walk = this.animationsGroup.find(ag => ag.name.includes("walk"));
        const crouch = this.animationsGroup.find(ag => ag.name.includes("crouch"));
        const idle = this.animationsGroup.find(ag => ag.name.includes("idle"));
        return {run: sprint!, walk: walk!, crouch: crouch!, idle: idle!};
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

    public play (deltaTime: number, currentTime: number) {
        this.deltaTime = deltaTime / 10;
        this.currentTime = currentTime;
        if (!this.isEndGame) {
            if (!this.isSequentialAnimation) {
                if (!this._isSpacedPressedForAnim) {
                    this._isSpacedPressedForAnim = true;
                    this.playSequentialAnimation();
                }
            } else { 
                if (this._isInReturnMesh) { // si je peux me retourner
                    console.log(`je me retourne`);
                    this._isInReturnMesh = false; // je me retourne
                    this.transform.rotation.y = Math.PI;
                    this.direction = -1;
                    
                }
                this.randomBaseSpeed();
                this.movePlayer();
                this.animationBot();
                
            }
        }
    }

    public playSequentialAnimation () {
        this.plongeonAnim.start(false, 1.0, this.plongeonAnim.from, this.plongeonAnim.to, false);
        this.plongeonAnim.onAnimationEndObservable.addOnce(() => {
            // recupérer le début de la course
            this.runSwimAnim();
            this._isSwimming = true;
            this.isSequentialAnimation = true;
            this.transform.position = this.secondfirstEndMesh.getAbsolutePosition();
            this.transform.position.z = 2.78 // régler la position du joueur au départ
            this.transform.position.y = -0.51 // régler la hauteur du joueur au départ
        });
    }

    public runSwimAnim () {
        this.swimAnim.start(true, 1.0, this.swimAnim.from, this.swimAnim.to, false);
        // stop les autres anims
        this.plongeonAnim.stop();
        this.crouchAnim.stop();
        this.idleAnim.stop();
    }

    private randomBaseSpeed(): void {
        // Génère une vitesse aléatoire pour l'accélération
        const temp = (Math.random() * 0.05) * this.deltaTime;
        this.baseSpeed += temp;

        // tu dois déplacer le bot avec une vitesse qui va varier mais il peut acélérer comme ralentir il ne peux pas dépasser une certaine vitesse s'il la dépasse on peut le ralentir
        // donne moi le code
        if (this.baseSpeed > this.MAX_SPEED) {
            this.baseSpeed = this.MAX_SPEED;
        } else if (this.baseSpeed < 0) {
            this.baseSpeed = 0;
        }
    }

    private movePlayer(): void {
        // Applique le mouvement en fonction de la direction et de la vitesse
        const distance = this.baseSpeed * this.deltaTime;
        this.transform.position.z += this.direction * distance;
    }

    private animationBot(): void {
        // Animation Management
        // lorsque le jouer est en mouvement je met l'animation de marche si jamais il dépasse une certaine vitesse je met l'animation de course
        // tu met des conditions pour savoir s'il posssèdes déjà l 'état pour éviter de relancer les animations
        if (this.baseSpeed > this.MIN_RUN_SPEED && !this._isRunning) {
            this.runAnim.start(true);
            this._isRunning = true;
            this._isWalking = false;
            this._isCrouching = false;
            this._isIdle = false;
        } else if (this.baseSpeed > 0 && this.baseSpeed <= this.MIN_RUN_SPEED && !this._isWalking) {
            this.walkAnim.start(true);
            this._isWalking = true;
            this._isRunning = false;
            this._isCrouching = false;
            this._isIdle = false;
        } else if (this.baseSpeed === 0 && !this._isIdle) {
            this.idleAnim.start(true);
            this._isIdle = true;
            this._isWalking = false;
            this._isRunning = false;
            this._isCrouching = false;
        }
    }

    public setActionManager () {
        this.firstEndMesh.actionManager = new ActionManager(this.scene);
        this.firstEndMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.transform
                },
                () => {
                    this.direction = 0 ; // je ne me déplace plus
                    this.stopAnimations();
                    if (!this._isReturnWasActivated) {
                        this._isInReturnMesh = true;
                    }
                    console.log(`fin premiere allee `);
                }
            )
        );
        
    }
}
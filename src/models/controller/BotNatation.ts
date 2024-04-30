import { ActionManager, AnimationGroup, ExecuteCodeAction, Mesh, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
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
    private crouchAnim : AnimationGroup = new AnimationGroup("crouch");
    private idleAnim : AnimationGroup = new AnimationGroup("idle");
    private plongeonAnim : AnimationGroup = new AnimationGroup("Anim|plongeon");
    private swimAnim : AnimationGroup = new AnimationGroup("Anim|swim");

    private _isIdle : boolean = false;
    private _isSwimming : boolean = false;
    private _isSpacedPressedForAnim: boolean = false;
    private _isInReturnMesh : boolean = false;
    private _isReturnWasActivated : boolean = false;
    private isSequentialAnimation : boolean = false;

    // run
    private MAX_SPEED = 0;
    private baseSpeed: number = 0; // Vitesse de déplacement initiale
    private direction: number = 1; // -1 pour gauche, 1 pour droite, 0 pour arrêt

    // fin
    private firstEndMesh: Mesh;
    private secondfirstEndMesh: Mesh;
    private isEndGame: boolean = false;
    private raceEndTime: number = 0;

    private deltaTime: number = 0;
    private currentTime : number;

    constructor(name: string, startPos: Vector3, endFirstMesh : Mesh, secondEndMesh : Mesh, scene : Scene, assetPath : string, maxSpeed : number) {
        this.name = name;
        this.scene = scene;
        this.assetPath = assetPath;
        this.transform = MeshBuilder.CreateCapsule("player", {height: PLAYER_HEIGHT, radius: PLAYER_RADIUS}, this.scene);
        this.transform.position = new Vector3(startPos.x, startPos.y, startPos.z);
        this.transform.isVisible = false; // mettre à faux par la suites
        this.firstEndMesh = endFirstMesh;
        this.secondfirstEndMesh = secondEndMesh;
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
        this.setAnimation();
        this.crouchAnim.start();      
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

    private setAnimation () { 
        this.crouchAnim = this.animationsGroup.find(ag => ag.name === "Anim|crouch")!;
        this.idleAnim = this.animationsGroup.find(ag => ag.name === "Anim|idle")!;
        this.plongeonAnim = this.animationsGroup.find(ag => ag.name === "Anim|plongeon")!;
        this.swimAnim = this.animationsGroup.find(ag => ag.name === "Anim|swim")!;
    }

    stopAnimations() {
        try {
            this.crouchAnim.stop();
            const winAnim = this.animationsGroup.find(ag => ag.name === "Anim|win"); 
            winAnim?.start(true, 1.0, winAnim.from, winAnim.to, false);
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
        setTimeout(() => {
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
        }, 500); // TODO : Nicolas, l'endroit ou tu mets le temps d'attente des bots 
        // au depart
    }

    public runSwimAnim () {
        this.swimAnim.start(true, 1.0, this.swimAnim.from, this.swimAnim.to, false);
        // stop les autres anims
        this.plongeonAnim.stop();
        this.crouchAnim.stop();
        this.idleAnim.stop();
    }

    public runIdleAnim () {
        this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
        // stop les autres anims
        this.crouchAnim.stop();
        this.swimAnim.stop();
    }

    public runPlongeonAnim () {
        this.plongeonAnim.start(false, 1.0, this.plongeonAnim.from, this.plongeonAnim.to, false);
        // stop les autres anims
        this.crouchAnim.stop();
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
        if (this._isSwimming) {
            if (this.baseSpeed <= 0) {
                this.runIdleAnim();
                this._isSwimming = false;
                this._isIdle = true;
            }
        } else if (this._isIdle) {
            if (this.baseSpeed > 0) {
                this.runSwimAnim();
                this._isSwimming = true;
                this._isIdle = false;
            }
        }
    }

    public setActionManager () {
        this.transform.actionManager = new ActionManager(this.scene);
        this.transform.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.firstEndMesh
                },
                () => {
                    this.direction = -1 ; // je ne me déplace plus vers l'avant
                    if (!this._isReturnWasActivated) {
                        this._isInReturnMesh = true;
                        this._isReturnWasActivated = true;
                    }
                }
            )
        );
        
        this.transform.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.secondfirstEndMesh
                },
                () => {
                    this.isEndGame = true;
                    this.raceEndTime = this.currentTime;
                    this.stopAnimations();
                }
            )
        );

    }
}
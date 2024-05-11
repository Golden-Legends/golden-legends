import { ActionManager, AnimationGroup, Camera, ExecuteCodeAction, FreeCamera, Mesh, MeshBuilder, Ray, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";
import { store } from "@/components/gui/store.ts";
import { PlayerInputPlongeonGame } from "../inputsMangement/PlayerInputPlongeonGame";
import { storePlongeon } from "@/components/gui/storePlongeon.ts";

const PLAYER_HEIGHT = 3;
const PLAYER_RADIUS = 0.05;
const PLAYER_SCALING = 0.018 ;

export class PlayerPlongeonGame {

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
    private idleAnim : AnimationGroup = new AnimationGroup("idle");
    private plongeonAnim : AnimationGroup = new AnimationGroup("Anim|jumpForward");
    private poolAnim : AnimationGroup = new AnimationGroup("Anim|fallPool");
    private winAnim : AnimationGroup = new AnimationGroup("Anim|win");
    private standAnim : AnimationGroup = new AnimationGroup("Anim|stand");
    private fallAnim : AnimationGroup = new AnimationGroup("Anim|falling");
    private pose1Anim : AnimationGroup = new AnimationGroup("Anim|pose1");
    private pose2Anim : AnimationGroup = new AnimationGroup("Anim|pose2");
    private pose3Anim : AnimationGroup = new AnimationGroup("Anim|pose3");
    private pose4Anim : AnimationGroup = new AnimationGroup("Anim|pose4");


    private _isIdle : boolean = false;
    private _isPool : boolean = false;
    private _isWin : boolean = false;
    private _isStand : boolean = false;
    private _isFalling : boolean = false;
    private _isPose1 : boolean = false;
    private _isPose2 : boolean = false;
    private _isPose3 : boolean = false;
    private _isPose4 : boolean = false;
    public isSpacedPressedForAnim: boolean = false;

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
    private _input: PlayerInputPlongeonGame;
    // camera
    private _camera ?: Camera;

	private _deltaTime: number = 0;

    private endGameMesh: Mesh;
    private isEndGame: boolean = false;
    private raceEndTime: number = 0;

    private currentTime : number = 0;

    private gameActive : boolean = false;
    private suiteLetters: string[] = [];
    private currentLetters: number = 0;
    private score: number = 0;
    private isSequentialAnimation: boolean = false;

    constructor(x : number, y : number, z : number, scene : Scene, assetPath : string, endMesh : Mesh, input : PlayerInputPlongeonGame, activeCamera: boolean) {
        this._x = x;
        this._y = y;
        this._z = z;
        this.scene = scene;
        this.assetPath = assetPath;
        this._input = input ;
        this._camera
        this.transform = MeshBuilder.CreateCapsule("player", {height: PLAYER_HEIGHT, radius: PLAYER_RADIUS}, this.scene);
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
    }

    public async init () {
        const result = await SceneLoader.ImportMeshAsync("", "", this.assetPath, this.scene);
        this.gameObject = result.meshes[0] as Mesh;
        this.gameObject.scaling = new Scaling(PLAYER_SCALING);
        this.gameObject.position = new Vector3(0, (-PLAYER_HEIGHT / 2) + 0.5, 0);
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
        const {idle, plongeon, pool, win, stand, 
            fall, pose1, pose2, pose3, pose4} = this.setAnimation();
        this.pose1Anim = pose1;
        this.pose2Anim = pose2;
        this.pose3Anim = pose3;
        this.pose4Anim = pose4;
        this.fallAnim = fall;
        this.standAnim = stand;
        this.winAnim = win;
        this.poolAnim = pool;
        this.plongeonAnim = plongeon;
        this.idleAnim = idle;
        this.idleAnim.start(true);
        this._isIdle = true;     
    }

    public isTextPlongeonShow : boolean = false;


    public play (delta : number, currentTime : number) {
        // console.log("play");
        this._deltaTime = delta / 10;
        this.currentTime = currentTime;
        if (!this.isEndGame) {
            if(!this.gameActive){
                if (!this.isTextPlongeonShow) {
                    this.isTextPlongeonShow = true;
                    document.getElementById("plongeonGame-text-plongeon")!.classList.remove("hidden");
                }
                if (this._input.space) {
                    document.getElementById("plongeonGame-text-plongeon")!.classList.add("hidden");
                    this.isSpacedPressedForAnim = true;
                    this.playSequentialAnimation();
                }
            }
            else{
                //todo récuperer ici les touches qu'enfonce le player
                // console.log("gameActive");
                document.getElementById("plongeonGame-incorrect")!.classList.add("hidden");
                document.getElementById("plongeonGame-correct")!.classList.add("hidden");
                this.processInput();
            }
        }
        else{
            // console.log("endGame");
        }
    }

    public processInput(){
        if(this.currentLetters >= this.suiteLetters.length) {
            this.isEndGame = true;
            return;
        }
        console.log(this._input.figuref, this._input.figureg, this._input.figureh, this._input.figurej);
        if(this._input.figuref){
            this.runPose1Anim();
            this._input.figuref = false;
            if(this.suiteLetters[this.currentLetters] === "f"){
                //ok
                document.getElementById("plongeonGame-correct")!.classList.remove("hidden");
                this.score += 25;
                storePlongeon.commit("setScore", this.score);
            }
            else{
                //pas bon
                document.getElementById("plongeonGame-incorrect")!.classList.remove("hidden");
            }
            this.currentLetters++;
        }
        else if(this._input.figureg){
            this.runPose2Anim();
            this._input.figureg = false;
            if(this.suiteLetters[this.currentLetters] === "g"){
                //ok
                document.getElementById("plongeonGame-correct")!.classList.remove("hidden");
                this.score += 25;
                storePlongeon.commit("setScore", this.score);
            }
            else{
                //pas bon
                document.getElementById("plongeonGame-incorrect")!.classList.remove("hidden");
            }
            this.currentLetters++;
        }
        else if(this._input.figureh){
            this.runPose3Anim();
            this._input.figureh = false;
            if(this.suiteLetters[this.currentLetters] === "h"){
                //ok
                document.getElementById("plongeonGame-correct")!.classList.remove("hidden");
                this.score += 25;
                storePlongeon.commit("setScore", this.score);
            }
            else{
                //pas bon
                document.getElementById("plongeonGame-incorrect")!.classList.remove("hidden");
            }
            this.currentLetters++;
        }
        else if(this._input.figurej){
            this.runPose4Anim();
            this._input.figurej = false;
            if(this.suiteLetters[this.currentLetters] === "j"){
                //ok
                document.getElementById("plongeonGame-correct")!.classList.remove("hidden");
                this.score += 25;
                storePlongeon.commit("setScore", this.score);
            }
            else{
                //pas bon
                document.getElementById("plongeonGame-incorrect")!.classList.remove("hidden");
            }
            this.currentLetters++;   
        }
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

    public putLetters(chaine: string[]){
        this.suiteLetters = chaine;
    }

    public gameActiveState() :void{
        this.gameActive = !this.gameActive;
    }

    public getIsEndGame() : boolean {
        return this.isEndGame;
    }

    public getEndTime() : number {
        return this.raceEndTime;
    }
    
    private setAnimation () : {idle: AnimationGroup, 
                                plongeon: AnimationGroup, 
                                pool: AnimationGroup, 
                                win: AnimationGroup,
                                stand: AnimationGroup,
                                fall: AnimationGroup,
                                pose1: AnimationGroup,
                                pose2: AnimationGroup,
                                pose3: AnimationGroup,
                                pose4: AnimationGroup} {
        const idle = this.animationsGroup.find(ag => ag.name === "Anim|idle");
        const plongeon = this.animationsGroup.find(ag => ag.name === "Anim|jumpForward");
        const pool = this.animationsGroup.find(ag => ag.name === "Anim|fallPool");
        const win = this.animationsGroup.find(ag => ag.name === "Anim|win");
        const stand = this.animationsGroup.find(ag => ag.name === "Anim|stand");
        const fall = this.animationsGroup.find(ag => ag.name === "Anim|falling");
        const pose1 = this.animationsGroup.find(ag => ag.name === "Anim|pose1");
        const pose2 = this.animationsGroup.find(ag => ag.name === "Anim|pose2");
        const pose3 = this.animationsGroup.find(ag => ag.name === "Anim|pose3");
        const pose4 = this.animationsGroup.find(ag => ag.name === "Anim|pose4");
        return {idle: idle!, plongeon: plongeon!, pool: pool!, win: win!, stand: stand!, 
            fall: fall!, pose1: pose1!, pose2: pose2!, pose3: pose3!, pose4: pose4!};
    }

    public async descendrePerso(){
        //lancer l'animation de falling
        this.runFallAnim();
        while(this.transform.position.y > 0.5){
            this.transform.position.y -= 0.01;
            await new Promise(resolve => setTimeout(resolve, 15));
        }
        this.runPoolAnim();
    }

    public runPoolAnim () {
        this.poolAnim.start(false, 1.0, 60, this.poolAnim.to, false);
        this.poolAnim.onAnimationEndObservable.addOnce(() => {
            this.winAnim.start(true, 1.0, this.winAnim.from, this.winAnim.to, false);
            this.transform.position = new Vector3(-1.172302484512329,
                0.5,
                16.5);
            this._isWin = true;
            // this.isEndGame = true;
        });
        // stop les autres anims
    }

    public runFallAnim () {
        this.fallAnim.start(true, 1.0, this.fallAnim.from, this.fallAnim.to, false);
        this.transform.position = new Vector3(-1.172302484512329,
            this.transform.position._y - 0.064287,
            16.58);
        this._isFalling = true;
    }  

    public runPose1Anim () {
        this.fallAnim.stop();
        this.pose1Anim.start(true, 1.0, this.pose1Anim.from, this.pose1Anim.to, false);
        this._isPose1 = true;
    }
    
    public runPose2Anim () {
        this.fallAnim.stop();
        this.pose2Anim.start(true, 1.0, this.pose2Anim.from, this.pose2Anim.to, false);
        this._isPose2 = true;
    }

    public runPose3Anim () {
        this.fallAnim.stop();
        this.pose3Anim.start(true, 1.0, this.pose3Anim.from, this.pose3Anim.to, false);
        this._isPose3 = true;
    }

    public runPose4Anim () {
        this.fallAnim.stop();
        this.pose4Anim.start(true, 1.0, this.pose4Anim.from, this.pose4Anim.to, false);
        this._isPose4 = true;
    }
    

    public playSequentialAnimation () {
        this.plongeonAnim.start(false, 1.0, this.plongeonAnim.from, 85, false);
        this.idleAnim.stop();
        // console.log(this.transform.position);
        // console.log(this.plongeonAnim.to);
        this.plongeonAnim.onAnimationEndObservable.addOnce(() => {
            this.transform.position = new Vector3(-1.172302484512329,
                this.transform.position._y,
                16.5);
            // recupérer le début de la course
            this.runFallAnim();
            this._isFalling = true;
            this.isSequentialAnimation = true;
            // const refPosition = this.secondfirstEndMesh.getAbsolutePosition();
            // Nicolas , position post plongeon
        });
    }

    stopAnimations() {
        try {
            this.idleAnim.start(true);
            this._isIdle = true;            
        } catch (error) {
            throw new Error("Method not implemented.");
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

    public _updateGroundDetection(): void {
        this._deltaTime = this.scene.getEngine().getDeltaTime() / 10;
    
        // Stocker le résultat de la première invocation de _isGrounded()
        const isGrounded = this._isGrounded();
    
        if (!isGrounded) {
            this.transform.moveWithCollisions(new Vector3(0, PlayerPlongeonGame.GRAVITY, 0));
        }
    }


    public animationPlayer(): void {
        // Animation Management
            this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
            this._isIdle = true;
    }

    public createCameraPlayer(mesh : Mesh) : FreeCamera { 
        const camera = new FreeCamera("camera1", new Vector3(-4, 2, 13), this.scene);
        camera.setTarget(new Vector3(mesh.position.x, mesh.position.y, mesh.position.z));
        return camera;
    }

    public setCamera (camera : Camera) {
        this._camera = camera;
    }
}
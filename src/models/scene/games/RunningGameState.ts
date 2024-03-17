import { ActionManager, AnimationGroup, AxesViewer, ExecuteCodeAction, FreeCamera, HemisphericLight, Matrix, Mesh, MeshBuilder, SceneLoader, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";
import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";


export class RunningGameState extends GameState {
    private _input : PlayerInputRunningGame;
    public _camera !: FreeCamera;
    private endGame : boolean = false;
    private character : Mesh;
    private animations : AnimationGroup[];

    // GAME SETTINGS
    private baseSpeed: number = 0; // Vitesse de déplacement initiale
    private acceleration: number = 0.10; // Ajustez selon vos besoins
    private minDelayBetweenSwitches: number = 800; // Délai minimal entre chaque alternance en millisecondes
    private lastSwitchTime: number = 0;
    private direction: number = 1; // -1 pour gauche, 1 pour droite, 0 pour arrêt
    private leftPressed: boolean = false;
    private rightPressed: boolean = false;
    private deceleration: number = 0.02; // Décélération lorsqu'aucune touche n'est enfoncée

    // ANIMATIONS
    private _isWalking: boolean = false;
    private _isRunning: boolean = false;
    private _isCrouching: boolean = false;
    private _isIdle : boolean = false;

    private run: AnimationGroup = new AnimationGroup("run");
    private walk : AnimationGroup = new AnimationGroup("walk");
    private crouch : AnimationGroup = new AnimationGroup("crouch");
    private idle : AnimationGroup = new AnimationGroup("idle");

    private readonly MIN_RUN_SPEED = 0.23;
    private raceStartTime: number = 0;

    constructor(game: Game, canvas: HTMLCanvasElement) {
        super(game, canvas);
        this.character = new Mesh("character");
        this.animations = [];
        this._input = new PlayerInputRunningGame(this.scene);
    }

    async enter(): Promise<void>{
        try {            

            this.handlePointerLockChange();

            //load the gui iin the mainmenu and not here only for prod 
            await this.game.loadingScreen.loadGui();
            this.game.engine.displayLoadingUI();

            // Inspector.Show(this.scene, {});
            await this.setEnvironment();

            // crounch
            await this.createPlayerMesh();

            this._camera = this.createCamera(this.character);
            this.createLight();
            this.runUpdateAndRender();

            this.game.engine.hideLoadingUI();

            // collision
            this.character.actionManager = new ActionManager(this.scene);
            const endMesh = this.scene.getMeshByName("Cylindre.003");
            this.character.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: endMesh
                    },
                    () => {
                        this.endGame = true;
                        this.stopAnimations();
                        const raceEndTime = performance.now();
                        const raceDurationInSeconds = (raceEndTime - this.raceStartTime) / 1000; // Convert milliseconds to seconds
                        console.log("Durée de la course :", raceDurationInSeconds, "secondes");
                    }
                )
            );
            
            this.raceStartTime = performance.now();
        } catch (error) {
            throw new Error("erreur.");
        }
    }
    stopAnimations() {
        try {
            this.walk.stop();
            this.run.stop();
            this.crouch.stop();
            this.idle.start();            
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }

    exit(): void {
        console.log("exit running game");
    }
    
    update(): void {
        try 
        {  
            if (!this.endGame) {
                this.processInput();
                this.movePlayer();
                this.animationPlayer();
                const raceEndTime = performance.now();
                const raceDurationInSeconds = (raceEndTime - this.raceStartTime) / 1000; // Convert milliseconds to seconds
                console.log(raceDurationInSeconds.toFixed(3), "secondes");
            }

            
        } catch (error) 
        {
            throw new Error("error : Running game class update." + error);
        }
    }

    private processInput(): void {
        const currentTime = performance.now();
    
        // Check if the minimum delay between each alternation is respected
        if (currentTime - this.lastSwitchTime < this.minDelayBetweenSwitches) {
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
                this.lastSwitchTime = currentTime; // Update the time of the last alternation
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

    private movePlayer(): void {
        // Applique le mouvement en fonction de la direction et de la vitesse
        this.character.position.z += this.direction * this.baseSpeed;
        this._camera.position.z += this.direction * this.baseSpeed;
    }

    private animationPlayer(): void {
        // Animation Management
        if ((this._isCrouching || this._isIdle ) && this.baseSpeed > 0 && !this._isWalking && !this._isRunning) {
            if  (this._isCrouching) {
                this.crouch.stop();
                this._isCrouching = false;
            }
            if (this._isIdle) {
                this.idle.stop();
                this._isIdle = false;
            }
            this.walk.start(true, 1.0, this.walk.from, this.walk.to, false);
            this._isWalking = true;
        } else if (!this._isCrouching && this._isWalking && this.baseSpeed >= this.MIN_RUN_SPEED && !this._isRunning && !this._isIdle) {
            this.walk.stop();
            this._isWalking = false;
            this.run.start(true, 1.0, this.run.from, this.run.to, false);
            this._isRunning = true;
        } else if (!this._isCrouching && this._isRunning && this.baseSpeed < this.MIN_RUN_SPEED && !this._isIdle && !this._isWalking) {
            this.run.stop();
            this._isRunning = false;
            this.walk.start(true, 1.0, this.walk.from, this.walk.to, false);
            this._isWalking = true;
        } else if (!this._isCrouching && this._isWalking && this.baseSpeed == 0 && !this._isRunning && !this._isIdle) {
            this.walk.stop();
            this._isWalking = false;
            this.idle.start(true, 1.0, this.idle.from, this.idle.to, false);
            this._isIdle = true;
        }
    }

    async setEnvironment(): Promise<void> {
        try {
            const maps = new runningGameEnv(this.scene);
            await maps.load();
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }

    private async createPlayerMesh () : Promise<void>{
        const startMesh = this.scene.getMeshByName("Cylindre.001");
        //collision mesh
        const outer = MeshBuilder.CreateBox(
            "outer",
            { width: 3, depth: 1, height: 4 },
            this.scene,
        );
        // pour afficher la box qui sert de collision
        outer.isVisible = false;
        outer.isPickable = false;
        outer.checkCollisions = true;
        //move origin of box collider to the bottom of the mesh (to match player mesh)
        outer.bakeTransformIntoVertices(Matrix.Translation(0, 2, 0));
        //for collisions
        outer.ellipsoid = new Vector3(1, 1.5, 1);
        outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

        // charger le skin du joueur 
        await SceneLoader.ImportMeshAsync("", "./models/characters/", "character-skater-boy.glb", this.scene).then((result) => {
            ///////////////////////
            const root = result.meshes[0];
            //body is our actual player mesh
            const body = root;
            body.parent = outer;
            body.isPickable = false;
            body.getChildMeshes().forEach(m => {
                m.isPickable = false;
            });
            body.scaling = new Vector3(3, 3, 3);
            body.showBoundingBox = true;
            body.rotation = new Vector3(0, 0, 0);
            this.character = outer;
            // SET ANIMATIONS
            this.animations = result.animationGroups;
            this.animations[0].stop();
        });
        this.character.position = new Vector3(startMesh?.getAbsolutePosition()._x, startMesh?.getAbsolutePosition()._y, startMesh?.getAbsolutePosition()._z);

        // set animation
        const {run, walk, crouch, idle} = this.setAnimation();
        this.run = run;
        this.walk = walk;
        this.crouch = crouch;
        this.idle = idle;
        this.crouch.start();
        this._isCrouching = true;
    }

    private setAnimation () : {run: AnimationGroup, walk: AnimationGroup, crouch: AnimationGroup, idle: AnimationGroup} { 
        const sprint = this.animations.find(ag => ag.name.includes("sprint"));
        const walk = this.animations.find(ag => ag.name.includes("walk"));
        const crouch = this.animations.find(ag => ag.name.includes("crouch"));
        const idle = this.animations.find(ag => ag.name.includes("idle"));
        return {run: sprint!, walk: walk!, crouch: crouch!, idle: idle!};
    }

    private createCamera(mesh : Mesh) : FreeCamera{ 
        const camera = new FreeCamera("camera1", new Vector3(22.72, 22.07, -31.21), this.scene);
        camera.setTarget(new Vector3(mesh.position.x, mesh.position.y, mesh.position.z + 6));
        return camera;
    }

    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 2, 0), this.scene);
        light.intensity = 0.7;
    }
}
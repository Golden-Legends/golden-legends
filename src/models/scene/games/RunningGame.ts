import { ActionManager, AxesViewer, ExecuteCodeAction, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";
import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";


export class RunningGameState extends GameState {
    private mesh : Mesh;
    private _input : PlayerInputRunningGame;
    public _camera !: FreeCamera;
    private endGame : boolean = false;

    // GAME SETTINGS
    private baseSpeed: number = 0; // Vitesse de déplacement initiale
    private acceleration: number = 0.10; // Ajustez selon vos besoins
    private minDelayBetweenSwitches: number = 800; // Délai minimal entre chaque alternance en millisecondes
    private lastSwitchTime: number = 0;
    private direction: number = 1; // -1 pour gauche, 1 pour droite, 0 pour arrêt
    private leftPressed: boolean = false;
    private rightPressed: boolean = false;
    private deceleration: number = 0.02; // Décélération lorsqu'aucune touche n'est enfoncée


    constructor(game: Game, canvas: HTMLCanvasElement) {
        super(game, canvas);
        this.mesh = new Mesh("box");
        this._input = new PlayerInputRunningGame(this.scene);
    }

    async enter(): Promise<void>{
        try {
            //load the gui iin the mainmenu and not here only for prod 
            await this.game.loadingScreen.loadGui();
            this.game.engine.displayLoadingUI();

            // Inspector.Show(this.scene, {});
            await this.createRunningMap();
            this.mesh = this.createBox();
            const axes = new AxesViewer(this.scene);
            axes.xAxis.parent = this.mesh;
            axes.yAxis.parent = this.mesh; 
            axes.zAxis.parent = this.mesh;
            this._camera = this.createCamera(this.mesh);
            this.createLight();
            this.runUpdateAndRender();

            this.game.engine.hideLoadingUI();

            // collision
            this.mesh.actionManager = new ActionManager(this.scene);
            const endMesh = this.scene.getMeshByName("Cylindre.003");
            this.mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: endMesh
                    },
                    () => {
                        console.log("end of the game");
                        this.endGame = true;
                    }
                )
            );

        } catch (error) {
            throw new Error("erreur.");
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
        this.mesh.position.z += this.direction * this.baseSpeed;
        this._camera.position.z += this.direction * this.baseSpeed;
    }

    setEnvironment(): void {
        throw new Error("Method not implemented.");
    }

    private createBox () {
        const box = MeshBuilder.CreateBox("box", {size: 2}, this.scene);
        const startMesh = this.scene.getMeshByName("Cylindre.001");
        if (startMesh)  {
            startMesh.isVisible = true;
            // recuperer la position du mesh
            box.position  = startMesh.getAbsolutePosition();
            box.position.y += 1;
        }
        return box;
    }

    private async createRunningMap () {
        const maps = new runningGameEnv(this.scene);
        await maps.load();
    }

    private createCamera(mesh : Mesh) : FreeCamera{ 
        const camera = new FreeCamera("camera1", new Vector3(22.72, 22.07, -31.21), this.scene);
        camera.setTarget(new Vector3(mesh.position.x, mesh.position.y, mesh.position.z + 6));
        return camera;
    }

    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }
}
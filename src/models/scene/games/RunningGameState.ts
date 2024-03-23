import { ActionManager, ExecuteCodeAction, FreeCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";
import { PlayerRunningGame } from "../../controller/PlayerRunningGame";


export class RunningGameState extends GameState {
    private _input : PlayerInputRunningGame;
    public _camera !: FreeCamera;
    private endGame : boolean = false;
    private raceStartTime: number = 0;

    private player !: PlayerRunningGame;

    constructor(game: Game, canvas: HTMLCanvasElement) {
        super(game, canvas);
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

            // test classe player
            const disque = this.scene.getMeshByName("Cylindre");
            this.player = new PlayerRunningGame(disque?.getAbsolutePosition().x || 0, 
                                                disque?.getAbsolutePosition().y || 0, 
                                                disque?.getAbsolutePosition().z || 0, 
                                                this.scene, 
                                                "./models/characters/character-skater-boy.glb", 
                                                this._input, true);
            await this.player.init();

            this.createLight();
            this.runUpdateAndRender();

            this.game.engine.hideLoadingUI();

            // collision
            const endMesh = this.scene.getMeshByName("Cylindre.002");
            if (endMesh) { 
                endMesh.actionManager = new ActionManager(this.scene);
                endMesh.actionManager.registerAction(
                    new ExecuteCodeAction(
                        {
                            trigger: ActionManager.OnIntersectionEnterTrigger,
                            parameter: this.player.transform
                        },
                        () => {
                            this.endGame = true;
                            this.player.stopAnimations();
                            const raceEndTime = performance.now();
                            const raceDurationInSeconds = (raceEndTime - this.raceStartTime) / 1000; // Convert milliseconds to seconds
                            console.log("Durée de la course :", raceDurationInSeconds, "secondes");
                        }
                    )
                );
            }
            
            
            this.raceStartTime = performance.now();
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
            this.player._updateGroundDetection();
            this.player.animationPlayer();
            if (!this.endGame) {
                this.player.movePlayer();
                this.player.processInput();
            }            
        } catch (error) 
        {
            throw new Error("error : Running game class update." + error);
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

    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 2, 0), this.scene);
        light.intensity = 0.7;
    }
}
import { ActionManager, ExecuteCodeAction, FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";
import { PlayerRunningGame } from "../../controller/PlayerRunningGame";
import { Bot } from "../../controller/Bot";
import RunningGameSettings from "../../../../public/models/runningGame.json";

interface line {
    start : string;
    end : string;
}

interface botInfo {
    name : string;
    speed : number;
    pathFile : string;
}

interface level {
    maxSpeed : number;
    botInfo : botInfo[];
}

interface IRunningGameState {
    placement : line[],
    level : {
        easy : level;
        intermediate : level;
        hard : level;
    }
}

export class RunningGameState extends GameState {
    private _input : PlayerInputRunningGame;
    public _camera !: FreeCamera;
    private endGame : boolean = false;
    private raceStartTime: number = 0;

    private player !: PlayerRunningGame;

    private botArray : Bot[] = [];

    private settings : IRunningGameState;
    private startPlacement : Mesh[] = [];
    private endPlacement : Mesh[] = [];

    constructor(game: Game, canvas: HTMLCanvasElement) {
        super(game, canvas);
        this._input = new PlayerInputRunningGame(this.scene);
        this.settings = RunningGameSettings;
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
            this.player = new PlayerRunningGame(this.startPlacement[0].getAbsolutePosition().x || 0, 
                                                this.startPlacement[0].getAbsolutePosition().y || 0, 
                                                this.startPlacement[0].getAbsolutePosition().z || 0, 
                                                this.scene, 
                                                "./models/characters/character-skater-boy.glb", 
                                                this._input, true);
            await this.player.init();

            this.createLight();
            this.runUpdateAndRender();

            this.game.engine.hideLoadingUI();

            // collision
            // TODO : déplacer cette logique dans la classe PlayerRunningGame
            const endMesh = this.endPlacement[0];
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
            
            // lister tous les disque
            
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
            this.botArray.forEach(bot => {
                // bot.play();
            }
            );

        } catch (error) 
        {
            throw new Error("error : Running game class update." + error);
        }
    }

    private async initSoloWithBot(difficulty : string) {
        const startMesh2 = this.scene.getMeshByName("Cylindre.001");
            const endMesh2 = this.scene.getMeshByName("Cylindre.003");
            if (startMesh2 && endMesh2) {
                console.log("création du bot")
                const bot = new Bot("bot1", startMesh2.getAbsolutePosition(), 
                        endMesh2 as Mesh, this.scene, 
                        "./models/characters/character-skater-boy.glb", 0.5);
                await bot.init();
                this.botArray.push(bot);
            }
    }

    private async initMultiplayer() {
    }

    async setEnvironment(): Promise<void> {
        try {
            const maps = new runningGameEnv(this.scene);
            await maps.load();
            this.setLinePlacement();
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }

    private setLinePlacement () {
        const startTab : Mesh[] = [];
        const endTab : Mesh[] = [];
        const placement = this.settings.placement;
        placement.forEach((line) => {
            const startMesh = this.scene.getMeshByName(line.start) as Mesh;
            const endMesh = this.scene.getMeshByName(line.end) as Mesh;
            if (startMesh && endMesh) {
                startTab.push(startMesh);
                endTab.push(endMesh);
            }
        });
        this.startPlacement = startTab;
        this.endPlacement = endTab;
    }

    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 2, 0), this.scene);
        light.intensity = 0.7;
    }
}
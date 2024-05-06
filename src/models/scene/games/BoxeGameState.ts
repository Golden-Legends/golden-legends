import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { SoundManager } from "@/models/environments/sound";
import { PlayerInputBoxeGame } from "@/models/inputsMangement/PlayerInputBoxeGame";
import BoxeGameSettings from "../../../assets/boxeGameSettings.json";
import { boxeGameEnv } from "@/models/environments/boxeGameEnv";
import { FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { PlayerBoxeGame } from "@/models/controller/PlayerBoxeGame";
import { BotBoxe } from "@/models/controller/BotBoxe";

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

interface IBoxeGameState {
    placement : line[],
    level : {
        easy : level;
        intermediate : level;
        hard : level;
    }
}

export class BoxeGameState extends GameState {
    public _camera !: FreeCamera;

    private settings : IBoxeGameState;
    private startPlacement : Mesh[] = [];
    private endPlacement : Mesh[] = [];

    private player !: PlayerBoxeGame;
    private playerName : string;
    private _input : PlayerInputBoxeGame;

    private botArray : BotBoxe[] = [];
    
    private isMultiplayer: boolean = false;
    private difficulty: "easy" | "intermediate" | "hard";

    public soundManager!: SoundManager;

    constructor(soundManager: SoundManager, game: Game, canvas: HTMLCanvasElement, difficulty ?: "easy" | "intermediate" | "hard", multi ?: boolean) {
        super(game, canvas);
        this._input = new PlayerInputBoxeGame(this.scene);
        this.playerName = localStorage.getItem("playerName") || "Playertest";
        this.settings = BoxeGameSettings; //settings running to do later
        this.difficulty = difficulty ? difficulty : "easy";
        this.isMultiplayer = multi ? multi : false;
        this.soundManager = soundManager;
        this.soundManager.addTrack('100m', './sounds/100m.m4a', 0.1);
        this.soundManager.playTrack('100m');
    }

    async setEnvironment(): Promise<void> {
        try {
            const maps = new boxeGameEnv(this.scene);
            await maps.load();
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }

    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 2, 0), this.scene);
        light.intensity = 0.7;
    }

    private setLinePlacement () {
        const startTab : Mesh[] = [];
        const EndTab : Mesh[] = [];
        const placement = this.settings.placement;
        placement.forEach((line) => {
            const startMesh = this.scene.getMeshByName(line.start) as Mesh;
            const firstEndMesh = this.scene.getMeshByName(line.end) as Mesh;
            startMesh.isVisible = false;
            firstEndMesh.isVisible = false;
            
            if (startMesh && firstEndMesh) {
                startTab.push(startMesh);
                EndTab.push(firstEndMesh);
            }
        });
        this.startPlacement = startTab;
        this.endPlacement = EndTab;
    }

    private async initPlayer () {
        const indexForPlayerPlacement = 0;
        const startMesh = this.startPlacement[indexForPlayerPlacement];
        const getFileName = localStorage.getItem("pathCharacter");
        this.player = new PlayerBoxeGame(startMesh.getAbsolutePosition().x || 0, 
                                            startMesh.getAbsolutePosition().y || 0, 
                                            startMesh.getAbsolutePosition().z || 0, 
                                            this.scene, 
                                            `./models/characters/${getFileName}`, this.endPlacement[indexForPlayerPlacement],
                                            this._input, false);
        await this.player.init();
        
        // permet d'enlever la position du joueur de la liste des positions facilitera la suite
        this.startPlacement.splice(indexForPlayerPlacement, 1);
        this.endPlacement.splice(indexForPlayerPlacement, 1);
        // mettre de l'aléatoire dans les positions des bots
        {this.startPlacement, this.endPlacement}
    }
    
    private async runSoloGame() {
        await this.initSoloWithBot(this.difficulty);
        // this.buildScoreBoard();
    }

    private async initSoloWithBot(difficulty : string) {
        const infoBot = this.settings.level[difficulty].botInfo;
        for (let i = 0; i < 1; i++) {
            const startMesh = this.startPlacement[i];
            const endMesh = this.endPlacement[i];
            //nicolas changer le pathfile dans le fichier natationGameSettings.json --> DONE
            const bot = new BotBoxe("bot" + i, startMesh.getAbsolutePosition(), 
                    endMesh,
                    this.scene,
                    infoBot[i].pathFile, infoBot[i].speed);
            await bot.init();
            this.botArray.push(bot);
        }        
    }

    initGui() {
        document.getElementById("runningGame-timer")!.classList.remove("hidden");
    }

    // Implement abstract members of GameState
    async enter(): Promise<void> {
        try {            
            //load the gui iin the mainmenu and not here only for prod 
            this.game.engine.displayLoadingUI();
            this.scene.detachControl();
        
            document.getElementById("options-keybind")!.classList.add("hidden");
            document.getElementById("objects-keybind")!.classList.add("hidden");
            document.getElementById("map-keybind")!.classList.add("hidden");

            // Inspector.Show(this.scene, {});
            await this.setEnvironment();
            this.createLight();
            this.setLinePlacement();

            // Init player 
            await this.initPlayer(); //to resolve

            // lancer le bon mode de jeu
            // on init le jeu
            if (!this.isMultiplayer) {
                await this.runSoloGame(); //to resolve
            }           

            this.runUpdateAndRender();   
            
            this._camera = new FreeCamera("cameraBoxe", new Vector3(-4, 2.5, 14.45), this.scene);
            this._camera.rotation._y = Math.PI/2;
            this._camera.rotation._x = Math.PI/5;
            // Vector3(4.78, 3.27, 6.38)
            
            // this._camera.rotation = new Vector3(0, -Math.PI, 0);
            // this._camera.setTarget(this.player.transform.position); // pas besoin 
            // console.log(this._camera.rotation);
            // console.log(this._camera.position);

            document.getElementById("boxeGame-skip-button")!.classList.remove("hidden");
            document.getElementById("boxeGame-skip-button")!.addEventListener("click", () => {
                this.scene.stopAnimation(this._camera);
                this.AfterCamAnim();
            });

            await this.scene.whenReadyAsync(); // on attends que la scene soit bien chargé
            this.scene.attachControl();
            this.game.engine.hideLoadingUI();

            this.CreateCameraMouv().then(() => {
                document.getElementById("boxeGame-ready-button")!.classList.remove("hidden");
                document.getElementById("boxeGame-skip-button")!.classList.add("hidden");

                document.getElementById("boxeGame-ready-button")!.addEventListener("click", () => {
                    // this.startCountdown(["natationGame-text-1", "natationGame-text-2", "natationGame-text-3"]);
                    this.AfterCamAnim(); 
                    this.initGui(); 
                    document.getElementById("boxeGame-ready-button")!.classList.add("hidden");
                    this.game.canvas.focus();
                });
            });

        } catch (error) {
            throw new Error(`error in enter method : ${error}`);
        }
    }

    AfterCamAnim(): void {
        this._camera.dispose();
        this._camera = this.player.createCameraPlayer(this.player.transform);
        this.player.setCamera(this._camera);
    }

    async CreateCameraMouv(): Promise<void> {
        console.log("CreateCameraMouv");
    }

    async exit(): Promise<void> {
        console.log("exit boxe game");
         
        document.getElementById("runningGame-timer")!.classList.add("hidden");

        this.soundManager.stopTrack('100m');
        this.clearScene();
    }

    update():void {
        console.log("update");
    }
    

    // Todo : Bases du jeu de la boxe
    // chargement des éléments du jeu (map, les 2 persos en idleBoxe,...)
    // faire l'animation de départ de caméra
    // affichage du bouton passer et du bouton pret ensuite
    // ensuite voir pour le jeu en lui même

}
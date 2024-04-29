import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { natationGameEnv } from "@/models/environments/natatonGameEnv";
import { FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import NatationGameSettings from "../../../assets/natationGameSettings.json";
import { PlayerInputRunningGame } from "@/models/inputsMangement/PlayerInputRunningGame";
import { PlayerNatationGame } from "@/models/controller/PlayerNatationGame";
import { store } from "@/components/gui/storeNatation";
import { InGameState } from "../InGameState";
import { Result } from "@/components/gui/results/ResultsContent.vue";
import { BotNatation } from "@/models/controller/BotNatation";


interface line {
    start : string;
    firstEnd : string;
    secondEnd : string;
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

export class NatationGameState extends GameState {
    private difficulty: "easy" | "intermediate" | "hard";
    private isMultiplayer: boolean;
    public _camera !: FreeCamera;

    private settings : IRunningGameState;
    private startPlacement : Mesh[] = [];
    private firstEndPlacement : Mesh[] = [];
    private secondEndPlacement : Mesh[] = [];  

    private player !: PlayerNatationGame;
    private playerName : string;
    private _input : PlayerInputRunningGame;

    private botArray : BotNatation[] = [];

    private results : Result[] = [];
    private scoreboardIsShow : boolean = false;
    private currentTime : number = 0;
    private raceStartTime: number = 0;


    constructor(game: Game, canvas: HTMLCanvasElement, difficulty ?: "easy" | "intermediate" | "hard", multi ?: boolean) {
        super(game, canvas);
        this.difficulty = difficulty ? difficulty : "easy";
        this.isMultiplayer = multi ? multi : false;
        this.settings = NatationGameSettings;
        this._input = new PlayerInputRunningGame(this.scene);
        this.playerName = localStorage.getItem("playerName") || "Playertest";

    }
    async enter(): Promise<void> {
        try {            
            //load the gui iin the mainmenu and not here only for prod 
            await this.game.loadingScreen.loadGui();
            this.game.engine.displayLoadingUI();
        
            document.getElementById("options-keybind")!.classList.add("hidden");
            document.getElementById("objects-keybind")!.classList.add("hidden");
            document.getElementById("map-keybind")!.classList.add("hidden");

            // Inspector.Show(this.scene, {});
            await this.setEnvironment();
            this.createLight();
            this.setLinePlacement();

            // Init player 
            await this.initPlayer();

            // lancer le bon mode de jeu
            // on init le jeu
            if (!this.isMultiplayer) {
                await this.runSoloGame();
            }           

            this.game.engine.hideLoadingUI(); 

            this._camera = new FreeCamera("cameraNatation", new Vector3(4.78, 3.27, 6.38), this.scene);
            this._camera.setTarget(this.player.transform.position);
            // this._camera.rotation = new Vector3(27.41, 250.01, 0.0);

            document.getElementById("natationGame-skip-button")!.classList.remove("hidden");
            document.getElementById("natationGame-skip-button")!.addEventListener("click", () => {
                this.scene.stopAnimation(this._camera);
                this.AfterCamAnim();
            });

            this.runUpdateAndRender();          

        } catch (error) {
            throw new Error(`error in enter method : ${error}`);
        }
    }
    exit(): void {
        throw new Error("Method not implemented.");
    }
    update(): void {
        
    }

    private setLinePlacement () {
        const startTab : Mesh[] = [];
        const firstEndTab : Mesh[] = [];
        const secondEndTab : Mesh[] = [];
        const placement = this.settings.placement;
        placement.forEach((line) => {
            const startMesh = this.scene.getMeshByName(line.start) as Mesh;
            const firstEndMesh = this.scene.getMeshByName(line.firstEnd) as Mesh;
            const secondEndMesh = this.scene.getMeshByName(line.secondEnd) as Mesh;
            startMesh.isVisible = false;
            firstEndMesh.isVisible = false;
            secondEndMesh.isVisible = false;
            if (startMesh && firstEndMesh) {
                startTab.push(startMesh);
                firstEndTab.push(firstEndMesh);
                secondEndTab.push(secondEndMesh);
            }
        });
        this.startPlacement = startTab;
        this.firstEndPlacement = firstEndTab;
        this.secondEndPlacement = secondEndTab;
    }
    
    async setEnvironment(): Promise<void> {
        try {
            const maps = new natationGameEnv(this.scene);
            await maps.load();
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }
    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 2, 0), this.scene);
        light.intensity = 0.7;
    }
    private shuffleArray(array1 : any[], array2 : any[], array3 : any[]) {
        for (let i = array1.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Génère un indice aléatoire entre 0 et i inclus
            [array1[i], array1[j]] = [array1[j], array1[i]]; // Échange les éléments à l'indice i et j
            [array2[i], array2[j]] = [array2[j], array2[i]]; // Échange les éléments à l'indice i et j
            [array3[i], array3[j]] = [array3[j], array3[i]]; // Échange les éléments à l'indice i et j
        }
        return {array1, array2};
    }
    private async initPlayer () {
        const indexForPlayerPlacement = 2;
        const startMesh = this.startPlacement[indexForPlayerPlacement];
        const getFileName = localStorage.getItem("pathCharacter");
        this.player = new PlayerNatationGame(startMesh.getAbsolutePosition().x || 0, 
                                            startMesh.getAbsolutePosition().y || 0, 
                                            startMesh.getAbsolutePosition().z || 0, 
                                            this.scene, 
                                            `./models/characters/${getFileName}`, this.firstEndPlacement[indexForPlayerPlacement],
                                            this.secondEndPlacement[indexForPlayerPlacement],
                                            this._input, false);
        await this.player.init();
        
        // permet d'enlever la position du joueur de la liste des positions facilitera la suite
        this.startPlacement.splice(indexForPlayerPlacement, 1);
        this.firstEndPlacement.splice(indexForPlayerPlacement, 1);

        // mettre de l'aléatoire dans les positions des bots
        {this.startPlacement, this.firstEndPlacement, this.secondEndPlacement} this.shuffleArray(this.startPlacement, this.firstEndPlacement, this.secondEndPlacement);
    }

    private async runSoloGame() {
        await this.initSoloWithBot(this.difficulty);
        this.buildScoreBoard();
    }

    private async initSoloWithBot(difficulty : string) {
        const infoBot = this.settings.level[difficulty].botInfo;
        for (let i = 0; i < 5; i++) {
            const startMesh = this.startPlacement[i];
            const endMesh = this.firstEndPlacement[i];
            if (startMesh && endMesh) {
                const bot = new BotNatation("bot" + i, startMesh.getAbsolutePosition(), 
                        endMesh as Mesh, this.scene,
                        infoBot[i].pathFile, infoBot[i].speed);
                await bot.init();
                this.botArray.push(bot);
            }              
        }        
    }

    timerToSMS (time: number) : string {
        const seconds = Math.floor(time / 1000);
        const milliseconds = time % 100;
        return `${seconds}.${milliseconds < 10 ? "0" : ""}${milliseconds}`;
    };

    buildScoreBoard() : void {
        this.results.push({place: 1, name: this.playerName, result: "No score !"});
        this.botArray.forEach((bot, index) => {
            this.results.push({place: (index + 2), name: bot.getName(), result: "No score !"});
        });
        store.commit('setResults', this.results);
    }

    showScoreBoard(): void {
        document.getElementById("runningGame-text-finish")!.classList.remove("hidden");
        // attendre 2 secondes avant d'afficher le tableau des scores
        setTimeout(() => {
            this.createFinaleScoreBoard();
            document.getElementById("runningGame-text-finish")!.classList.add("hidden");
            document.getElementById("runningGame-results")!.classList.remove("hidden");
            let continueButton = document.querySelector('#runningGame-results #continue-button');
            if (continueButton) {
                continueButton.addEventListener('click', () => {
                    this.exit();
                    this.game.changeState(new InGameState(this.game, this.game.canvas));
                });
            }
            this.scoreboardIsShow = true;
        }, 2000);   
        
    }   

    createFinaleScoreBoard() {
        const resultsTemp: Result[] = [];
    
        // Résultat du joueur
        const playerResult = this.player.getEndTime() ? this.timerToSMS(Math.round(this.player.getEndTime() - this.raceStartTime)) : "no score";
        resultsTemp.push({ place: 0, name: this.playerName, result: playerResult });
    
        // Résultats des bots
        this.botArray.forEach((bot, index) => {
            const botResult = bot.getEndTime() ? this.timerToSMS(Math.round(bot.getEndTime() - this.raceStartTime)) : "no score";
            resultsTemp.push({ place: index + 1, name: bot.getName(), result: botResult });
        });
    
        // Tri des résultats
        this.results = resultsTemp.sort((a, b) => parseFloat(a.result) - parseFloat(b.result));
        this.results.forEach((result, index) => {
            result.place = index + 1;
        });
    
        // Enregistrement des résultats dans le store
        store.commit('setResults', this.results);
    }

    AfterCamAnim(): void {
        this._camera.dispose();
        this._camera = this.player.createCameraPlayer(this.player.transform);
        this.player.setCamera(this._camera);
    }

}
import {FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";
import { PlayerRunningGame } from "../../controller/PlayerRunningGame";
import { Bot } from "../../controller/Bot";
import RunningGameSettings from "../../../../public/models/runningGame.json";
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";
import { Inspector } from '@babylonjs/inspector';

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
    private readonly limitTime = 15;
    private _input : PlayerInputRunningGame;
    public _camera !: FreeCamera;
    private endGame : boolean = false;
    private raceStartTime: number = 0;

    private player !: PlayerRunningGame;

    private botArray : Bot[] = [];

    private settings : IRunningGameState;
    private startPlacement : Mesh[] = [];
    private endPlacement : Mesh[] = [];

    private buttonReady : Button;
    private advancedTexture : AdvancedDynamicTexture;

    private countdownInProgress: boolean = false;

    constructor(game: Game, canvas: HTMLCanvasElement) {
        super(game, canvas);
        this._input = new PlayerInputRunningGame(this.scene);
        this.settings = RunningGameSettings;

        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.buttonReady = Button.CreateSimpleButton("btn", "Prêt");
        this.buttonReady.width = 0.2;
        this.buttonReady.height = "40px";
        this.buttonReady.color = "white";
        this.buttonReady.background = "green";
        this.advancedTexture.addControl(this.buttonReady); 
    }

    async enter(): Promise<void>{
        try {            
            //load the gui iin the mainmenu and not here only for prod 
            await this.game.loadingScreen.loadGui();
            this.game.engine.displayLoadingUI();

            // Inspector.Show(this.scene, {});
            await this.setEnvironment();
            this.createLight();
            this.setLinePlacement();
            
            // test classe player
            const indexForPlayerPlacement = 2;
            this.player = new PlayerRunningGame(this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().x || 0, 
                                                this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().y || 0, 
                                                this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().z || 0, 
                                                this.scene, 
                                                "./models/characters/character-skater-boy.glb", this.endPlacement[indexForPlayerPlacement],
                                                this._input, true);
            await this.player.init();
            
            // permet d'enlever la position du joueur de la liste des positions facilitera la suite
            this.startPlacement.splice(indexForPlayerPlacement, 1);
            this.endPlacement.splice(indexForPlayerPlacement, 1);

            // mettre de l'aléatoire dans les positions des bots
            {this.startPlacement, this.endPlacement} this.shuffleArray(this.startPlacement, this.endPlacement);

            // on init le jeu
            this.initSoloWithBot("easy");

            this.buttonReady.onPointerUpObservable.add(() => {
                console.log("clicked!");
                // Vous pouvez appeler la méthode startCountdown ici
                this.startCountdown(["À vos marques", "Prêt", "Partez !"]);
                this.buttonReady.isVisible = false; // Masquer le bouton après avoir cliqué
            });

            this.game.engine.hideLoadingUI(); 
            this.runUpdateAndRender();            
        } catch (error) {
            throw new Error("erreur.");
        }
    }

    private startCountdown(countdownElements: string[]) {
        if (this.countdownInProgress) return; // Évite de démarrer le compte à rebours multiple fois
        let countdownIndex = 0;
    
        const countdownInterval = setInterval(() => {
            const countdownElement = countdownElements[countdownIndex];
            console.log(countdownElement); // Affiche l'élément du compte à rebours dans la console
            countdownIndex++;
    
            if (countdownIndex >= countdownElements.length) {
                clearInterval(countdownInterval);
                // Permet au joueur de jouer ou exécutez d'autres actions nécessaires
                this.countdownInProgress = true;
                this.raceStartTime = performance.now();
            }
        }, 1000);
    }

    exit(): void {
        console.log("exit running game");
    }
    
    update(): void {
        try 
        {  
            this.player._updateGroundDetection();

            if (this.endGame || !this.countdownInProgress) return;

            const currentTime = performance.now();
            const elapsedTime = (currentTime - this.raceStartTime) / 1000;
            // affiche le temps dans la console
            if (elapsedTime > this.limitTime) {
                this.endGame = true;
                console.log("Game over: Time limit reached.");
                return;
            }

            if (this.player.getIsEndGame() && this.botArray.every(bot => bot.getIsEndGame())) {
                this.endGame = true;
                console.log("Game over: All players have reached the end.");
                console.log("Player time: " + (this.player.getEndTime() - this.raceStartTime) / 1000);
                this.botArray.forEach(bot => console.log(bot.getName() + " time: " + (bot.getEndTime() - this.raceStartTime) / 1000));
                return;
            }

            this.player.play();
            this.botArray.forEach(bot => {
                bot.play();
            });

        } catch (error) 
        {
            throw new Error("error : Running game class update." + error);
        }
    }

    private async initSoloWithBot(difficulty : string) {
        const infoBot = this.settings.level[difficulty].botInfo;
        for (let i = 0; i < 5; i++) {
            const startMesh = this.startPlacement[i];
            const endMesh = this.endPlacement[i];
            if (startMesh && endMesh) {
                const bot = new Bot("bot" + i, startMesh.getAbsolutePosition(), 
                        endMesh as Mesh, this.scene,
                        infoBot[i].pathFile, infoBot[i].speed);
                await bot.init();
                this.botArray.push(bot);
            }              
        }        
    }

    private async initMultiplayer() {
    }

    async setEnvironment(): Promise<void> {
        try {
            const maps = new runningGameEnv(this.scene);
            await maps.load();
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
            startMesh.isVisible = false;
            endMesh.isVisible = false;
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

    private shuffleArray(array1 : any[], array2 : any[]) {
        for (let i = array1.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Génère un indice aléatoire entre 0 et i inclus
            [array1[i], array1[j]] = [array1[j], array1[i]]; // Échange les éléments à l'indice i et j
            [array2[i], array2[j]] = [array2[j], array2[i]]; // Échange les éléments à l'indice i et j
        }
        return {array1, array2};
    }
}
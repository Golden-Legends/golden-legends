import {Animation, FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";
import { PlayerRunningGame } from "../../controller/PlayerRunningGame";
import { Bot } from "../../controller/Bot";
import RunningGameSettings from "../../../assets/runningGame.json";
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
    private readonly limitTime = 25;
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

    private isMultiplayer: boolean = false;
    private difficulty: "easy" | "intermediate" | "hard";

    constructor(game: Game, canvas: HTMLCanvasElement, difficulty ?: "easy" | "intermediate" | "hard", multi ?: boolean) {
        super(game, canvas);
        this._input = new PlayerInputRunningGame(this.scene);
        this.settings = RunningGameSettings;

        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.buttonReady = Button.CreateSimpleButton("btn", "Prêt");
        this.buttonReady.width = 0.2;
        this.buttonReady.height = "40px";
        this.buttonReady.color = "white";
        this.buttonReady.background = "green";
        this.buttonReady.isEnabled = false;

        this.difficulty = difficulty ? difficulty : "easy";
        this.isMultiplayer = multi ? multi : false;
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
            const startMesh = this.startPlacement[indexForPlayerPlacement];
            this.player = new PlayerRunningGame(this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().x || 0, 
                                                this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().y || 0, 
                                                this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().z || 0, 
                                                this.scene, 
                                                "./models/characters/character-skater-boy.glb", this.endPlacement[indexForPlayerPlacement],
                                                this._input, false);
            await this.player.init();
            
            // permet d'enlever la position du joueur de la liste des positions facilitera la suite
            this.startPlacement.splice(indexForPlayerPlacement, 1);
            this.endPlacement.splice(indexForPlayerPlacement, 1);

            // mettre de l'aléatoire dans les positions des bots
            {this.startPlacement, this.endPlacement} this.shuffleArray(this.startPlacement, this.endPlacement);

            // on init le jeu
            if (!this.isMultiplayer) {
                this.runSoloGame();
            }           
            this.game.engine.hideLoadingUI(); 
            this.runUpdateAndRender();        

            this._camera = new FreeCamera("camera100m", new Vector3(-12, 10, 20), this.scene);
            this._camera.setTarget(startMesh.position);  
            
            // Créez un bouton et ajoutez-le à l'interface utilisateur
            const skipButton = Button.CreateSimpleButton("skipButton", "Skip Animation");
            skipButton.width = "150px";
            skipButton.height = "40px";
            skipButton.color = "white";
            skipButton.cornerRadius = 20;
            skipButton.background = "green";
            skipButton.onPointerUpObservable.add(() => {
                console.log("skip")
                this.scene.stopAnimation(this._camera);
                this.AfterCamAnim();
                skipButton.isVisible = false;
            });
            this.advancedTexture.addControl(skipButton);

            this.CreateCameraMouv().then(() => {
                this.advancedTexture.addControl(this.buttonReady);
                this.buttonReady.isEnabled = true;
                this.buttonReady.onPointerUpObservable.add(() => {
                    // Vous pouvez appeler la méthode startCountdown ici
                    this.startCountdown(["À vos marques", "Prêt", "Partez !"]);
                    this.buttonReady.isVisible = false; // Masquer le bouton après avoir cliqué
                });
            });

        } catch (error) {
            throw new Error("erreur.");
        }
    }

    /**
     * 
     * @description Permet de lancer le jeu en solo
     * @description Allows you to start the game solo
     */
    private runSoloGame() {
        this.initSoloWithBot(this.difficulty);
        
    }

    /**
     * 
     * @param countdownElements 
     * @returns 
     * @description Permet de démarrer le compte à rebours
     * @description Allows you to start the countdown
     */
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
    
    /**
     * 
     * @returns 
     * @description Permet de mettre à jour le jeu
     * @description Allows you to update the game
     */
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

    /**
     * 
     * @param difficulty 
     * @description Permet d'initialiser le jeu en solo avec des bots en mettant une difficulter
     * @description Allows you to initialize the game solo with bots by putting a difficulty
     */
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

    /**
     * @description Permet de récupérer les positions de départ et d'arrivée des joueurs
     * @description Allows you to get the start and end positions of the players
     */
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

    /**
     * 
     * @param array1 
     * @param array2 
     * @returns 
     * @description Mélange deux tableaux en même temps me permet 
     * de garder la correspondance entre les positions de début et de fin de course
     * @description Shuffle two arrays at the same time allows me to keep the correspondence 
     * between the start and end positions
     */
    private shuffleArray(array1 : any[], array2 : any[]) {
        for (let i = array1.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Génère un indice aléatoire entre 0 et i inclus
            [array1[i], array1[j]] = [array1[j], array1[i]]; // Échange les éléments à l'indice i et j
            [array2[i], array2[j]] = [array2[j], array2[i]]; // Échange les éléments à l'indice i et j
        }
        return {array1, array2};
    }

    // CAMERA EARLY 
    async CreateCameraMouv(): Promise<void> {
        const fps = 60;
        const camAnim = new Animation("camAnim", 
                                    "position", 
                                    fps, 
                                    Animation.ANIMATIONTYPE_VECTOR3, 
                                    Animation.ANIMATIONLOOPMODE_CONSTANT,
                                    true);

        const camKeys: { frame: number, value: Vector3 }[] = [];
        camKeys.push({frame: 0, value: new Vector3(-2, 10, 20)});
        camKeys.push({frame: 3, value: new Vector3(-15, 2, -30)});
        camKeys.push({frame: 8 * fps, value: new Vector3(0.5, 2, -25)});
        camKeys.push({frame: 10 * fps, value: new Vector3(0.5, 2, -25)});
        camKeys.push({frame: 14 * fps, value: new Vector3(-6, 6, -10)});

        camAnim.setKeys(camKeys);
        this._camera.animations.push(camAnim);

        await this.scene.beginAnimation(this._camera, 0, 14 * fps).waitAsync();
    }

    AfterCamAnim(): void {
        this._camera.dispose();
        this._camera = this.player.createCameraPlayer(this.player.transform);
        this.player.setCamera(this._camera);
    }
}
import {Animation, FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";
import { PlayerRunningGame } from "../../controller/PlayerRunningGame";
import { Bot } from "../../controller/Bot";
import RunningGameSettings from "../../../assets/runningGame.json";
import { store } from "@/components/gui/store.ts";
import { Result } from "@/components/gui/results/ResultsContent.vue";
import { InGameState } from "../InGameState";
import { SoundManager } from "@/models/environments/sound";

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
    private playerName : string = "PlayerPseudo";

    private botArray : Bot[] = [];

    private settings : IRunningGameState;
    private startPlacement : Mesh[] = [];
    private endPlacement : Mesh[] = [];

    private countdownInProgress: boolean = false;

    private isMultiplayer: boolean = false;
    private difficulty: "easy" | "intermediate" | "hard";
    private timer: number = 0;

    private results : Result[] = [];
    private scoreboardIsShow : boolean = false;
    private currentTime : number = 0;

    public soundManager!: SoundManager;

    constructor(soundManager: SoundManager, game: Game, canvas: HTMLCanvasElement, difficulty ?: "easy" | "intermediate" | "hard", multi ?: boolean) {
        super(game, canvas);
        this._input = new PlayerInputRunningGame(this.scene);
        this.settings = RunningGameSettings;
        this.difficulty = difficulty ? difficulty : "easy";
        this.isMultiplayer = multi ? multi : false;
        this.soundManager = soundManager;
        this.soundManager.addTrack('100m', './sounds/100m.m4a', 0.1);
		this.soundManager.playTrack('100m');
    }

    async enter(): Promise<void>{
        try {            
            //load the gui iin the mainmenu and not here only for prod 
            this.game.engine.displayLoadingUI();
            this.scene.detachControl();

            // Inspector.Show(this.scene, {});
            await this.setEnvironment();
            this.createLight();
            this.setLinePlacement();
            
            // test classe player
            const indexForPlayerPlacement = 2;
            const startMesh = this.startPlacement[indexForPlayerPlacement];
            const getFileName = localStorage.getItem("pathCharacter");
            this.player = new PlayerRunningGame(this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().x || 0, 
                                                this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().y || 0, 
                                                this.startPlacement[indexForPlayerPlacement].getAbsolutePosition().z || 0, 
                                                this.scene, 
                                                `./models/characters/${getFileName}`, this.endPlacement[indexForPlayerPlacement],
                                                this._input, false);
            await this.player.init();
            
            // permet d'enlever la position du joueur de la liste des positions facilitera la suite
            this.startPlacement.splice(indexForPlayerPlacement, 1);
            this.endPlacement.splice(indexForPlayerPlacement, 1);

            // mettre de l'aléatoire dans les positions des bots
            {this.startPlacement, this.endPlacement} this.shuffleArray(this.startPlacement, this.endPlacement);

            // on init le jeu
            if (!this.isMultiplayer) {
                await this.runSoloGame();
            }           

            this.runUpdateAndRender();        

            this._camera = new FreeCamera("camera100m", new Vector3(-2, 10, 20), this.scene);
            this._camera.rotation = new Vector3(0, Math.PI, 0);
            this._camera.setTarget(startMesh.getAbsolutePosition());  
                        
            document.getElementById("runningGame-skip-button")!.classList.remove("hidden");
            document.getElementById("runningGame-skip-button")!.addEventListener("click", () => {
                this.scene.stopAnimation(this._camera);
                this.AfterCamAnim();
            });

            await this.scene.whenReadyAsync();
            this.scene.attachControl();
            this.game.engine.hideLoadingUI();
            
            this.CreateCameraMouv().then(() => {
                document.getElementById("runningGame-ready-button")!.classList.remove("hidden");

                document.getElementById("runningGame-ready-button")!.addEventListener("click", () => {
                    this.startCountdown(["runningGame-text-1", "runningGame-text-2", "runningGame-text-3"]);
                    this.AfterCamAnim(); 
                    this.initGui(); 
                    document.getElementById("runningGame-ready-button")!.classList.add("hidden");
                    this.game.canvas.focus();
                    document.getElementById("runningGame-skip-button")!.classList.add("hidden");
                    
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
    private async runSoloGame() {
        await this.initSoloWithBot(this.difficulty);
        this.buildScoreBoard();
    }

    initGui() {
        this.timer = 0;
        this.raceStartTime = 0;
        this.endGame = false;
        this.scoreboardIsShow = false;
        this.currentTime = 0;

        document.getElementById("runningGame-timer")!.classList.remove("hidden");
        document.getElementById("runningGame-keyPressed")!.classList.remove("hidden");
        document.getElementById("runningGame-text-speedbar")!.classList.remove("hidden");

        store.commit('setTimer', 0.00);
        store.commit('setSpeedBar', 0);  
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
        let previousElement = "";
    
        const countdownInterval = setInterval(() => {
            const countdownElement = countdownElements[countdownIndex];
            if (previousElement !== "") document.getElementById(previousElement)!.classList.add("hidden");
            document.getElementById(countdownElement)!.classList.remove("hidden");
            previousElement = countdownElement;
            countdownIndex++;
    
            if (countdownIndex >= countdownElements.length) {
                clearInterval(countdownInterval);
    
                // Cache le dernier élément après une seconde
                setTimeout(() => {
                    document.getElementById(previousElement)!.classList.add("hidden");
                }, 1000);
    
                // Permet au joueur de jouer ou exécutez d'autres actions nécessaires
                this.countdownInProgress = true;
                this.raceStartTime = performance.now();
            }
        }, 1000);
    }

    async exit(): Promise<void> {
        console.log("exit running game");
         
        document.getElementById("runningGame-timer")!.classList.add("hidden");
        document.getElementById("runningGame-keyPressed")!.classList.add("hidden");
        document.getElementById("runningGame-text-speedbar")!.classList.add("hidden");
        document.getElementById("runningGame-results")!.classList.add("hidden");
        document.getElementById("runningGame-text-finish")!.classList.add("hidden");

        store.commit('setTimer', 0.00);
        store.commit('setSpeedBar', 0);
        this.buildScoreBoard();

        this.soundManager.stopTrack('100m');
        this.clearScene();
    }

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
    
    timerToSMS (time: number) : string {
        const seconds = Math.floor(time / 1000);
        const milliseconds = time % 100;
        return `${seconds}.${milliseconds < 10 ? "0" : ""}${milliseconds}`;
    };

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

    /**
     * 
     * @returns 
     * @description Permet de mettre à jour le jeu
     * @description Allows you to update the game
     */
    update(): void {
        try 
        {  
            if (this.player.getIsEndGame() && this.botArray.every(bot => bot.getIsEndGame())) {
                this.endGame = true;
            }
            
            this.player._updateGroundDetection();
            
            if (this.endGame && !this.scoreboardIsShow) {
                this.showScoreBoard();
                return;
            }

            if (this.endGame) return;
            if (!this.countdownInProgress) return;
            this.currentTime = performance.now();
            const deltaTime = this.scene.getEngine().getDeltaTime();
            this.checkGameIsOutOfTime();
            this.player.play(deltaTime, this.currentTime);
            this.botArray.forEach(bot => {
                bot.play(deltaTime, this.currentTime);
            });

            if (!this.player.getIsEndGame()) {
                this.timer = Math.round((this.currentTime - this.raceStartTime));
                store.commit('setTimer', this.timer);
            }


        } catch (error) 
        {
            throw new Error("error : Running game class update." + error);
        }
    }

    checkGameIsOutOfTime() {
        // regarde si la course dure plus de 25 secondes
        const elapsedTime = (this.currentTime - this.raceStartTime) / 1000;
        // affiche le temps dans la console
        if (elapsedTime > this.limitTime) {
            this.endGame = true;
            console.log("Game over: Time limit reached.");
            if (!this.scoreboardIsShow) { 
                this.showScoreBoard();
            }
            return;
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

        const rotationAnim = new Animation("rotationAnim", 
                                    "rotation", 
                                    fps, 
                                    Animation.ANIMATIONTYPE_VECTOR3, 
                                    Animation.ANIMATIONLOOPMODE_CONSTANT,
                                    true);

        const camKeys: { frame: number, value: Vector3 }[] = [];
        const rotationKeys: { frame: number, value: Vector3 }[] = [];

        camKeys.push({frame: 0, value: new Vector3(-2, 10, 20)});
        camKeys.push({frame: 6 * fps, value: new Vector3(-15, 2, -30)});
        camKeys.push({frame: 11 * fps, value: new Vector3(0.5, 2, -30)});
        camKeys.push({frame: 12 * fps, value: new Vector3(0.5, 2, -30)});
        camKeys.push({frame: 16 * fps, value: new Vector3(-6, 6, -10)});
        camKeys.push({frame: 17 * fps, value: new Vector3(-6, 6, -10)});
        camKeys.push({frame: 21 * fps, value: new Vector3(22.72, 22.07, -31.21)});

        rotationKeys.push({frame: 0, value: new Vector3(0, -Math.PI, 0)});
        rotationKeys.push({frame: 6 * fps, value: new Vector3(0, Math.PI, 0)});
        rotationKeys.push({frame: 11 * fps, value: new Vector3(0, Math.PI, 0)});
        rotationKeys.push({frame: 12 * fps, value: new Vector3(0, Math.PI, 0)});
        rotationKeys.push({frame: 16 * fps, value: new Vector3(0, Math.PI, 0)});
        rotationKeys.push({frame: 17 * fps, value: new Vector3(0, Math.PI, 0)});
        rotationKeys.push({frame: 21 * fps, value: new Vector3(
            0.5737997121226636, -1.7815811050152932+2*Math.PI, 0)});

        camAnim.setKeys(camKeys);
        rotationAnim.setKeys(rotationKeys);

        this._camera.animations.push(camAnim);
        this._camera.animations.push(rotationAnim);

        await this.scene.beginAnimation(this._camera, 0, 21 * fps).waitAsync();
        document.getElementById("runningGame-skip-button")!.style.display = "none";
        // this.AfterCamAnim();
    }

    AfterCamAnim(): void {
        this._camera.dispose();
        this._camera = this.player.createCameraPlayer(this.player.transform);
        this.player.setCamera(this._camera);
        // console.log(this._camera.rotation);
        // console.log(this._camera.position);
    }
}
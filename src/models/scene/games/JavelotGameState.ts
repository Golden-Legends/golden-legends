import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { SoundManager } from "@/models/environments/sound";
import JavelotGameSettings from "../../../assets/javelotGameSettings.json";
import { Animation, FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { WaterMaterial } from "@babylonjs/materials";

import { Result } from "@/components/gui/results/ResultsContent.vue";
import { InGameState } from "../InGameState";
import { PlayerJavelotGame } from "@/models/controller/PlayerJavelotGame";
import { PlayerInputJavelotGame } from "@/models/inputsMangement/PlayerInputJavelotGame";
import { javelotGameEnv } from "@/models/environments/javelotGameEnv";
import { storeJavelot } from "@/components/gui/storeJavelot";


interface line {
    start : string;
    end : string;
}

interface level {
    placement : line[],
    pointToSucceed : number;
}

interface IJavelotGameState {
    level : {
        easy : level;
        intermediate : level;
    }
}

export class JavelotGameState extends GameState {
    public _camera !: FreeCamera;

    private settings : IJavelotGameState;
    private startPlacement : Mesh[] = [];
    private endPlacement : Mesh[] = [];

    private player !: PlayerJavelotGame;
    private playerName : string;
    private _input : PlayerInputJavelotGame;

    // private botArray : BotPlongeon[] = [];
    
    private isMultiplayer: boolean = false;
    private difficulty: "easy" | "intermediate" | "hard";

    private countdownInProgress: boolean = false;
    private countdownDone: boolean = false;
    private fightStartTime: number = 0;
    private guiGame: boolean = false;
    private playActive: boolean = false;
    private scoreboardIsShow : boolean = false;
    private animationJavelot : boolean = false;
    private tableauScore : number[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    private animArc : boolean = false;
    private score : number = 0;
    private results : Result[] = [];
    private continueButtonIsPressed: boolean = false;

    private env !: javelotGameEnv;

    public waterMaterial!: WaterMaterial;
    private skyBox!: Mesh;

    constructor(game: Game, canvas: HTMLCanvasElement, difficulty ?: "easy" | "intermediate" | "hard", multi ?: boolean) {
        super(game, canvas);
        this._input = new PlayerInputJavelotGame(this.scene);
        this.playerName = localStorage.getItem("playerName") || "Playertest";
        this.settings = JavelotGameSettings; //settings running to do later
        this.difficulty = difficulty ? difficulty : "easy";
        this.isMultiplayer = multi ? multi : false;
        this.game.playTrack('100m');
    }

    async setEnvironment(): Promise<void> {
        try {
            const maps = new javelotGameEnv(this.scene);
            this.env = maps;
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
        // const placement = this.settings.placement;
        const placement = this.settings.level[this.difficulty].placement;
        placement.forEach((line) => {
            const startMesh = this.scene.getMeshByName(line.start) as Mesh;
            // console.log(startMesh.getAbsolutePosition());
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
        this.player = new PlayerJavelotGame(startMesh.getAbsolutePosition().x || 0, 
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
        this.buildScoreBoard();
    }

    initGui() {
        document.getElementById("javelotGame-score")!.classList.remove("hidden");
    }

    // Implement abstract members of GameState
    async enter(): Promise<void> {
        try {            
            //load the gui iin the mainmenu and not here only for prod 
            this.game.engine.displayLoadingUI();
            this.scene.detachControl();
        

            // Inspector.Show(this.scene, {});
            await this.setEnvironment();
            this.createLight();
            this.setLinePlacement();
            this.invisiblePlatform();

            // Init player 
            await this.initPlayer(); //to resolve

            // lancer le bon mode de jeu
            // on init le jeu
            if (!this.isMultiplayer) {
                await this.runSoloGame(); //to resolve
            }           

            this.runUpdateAndRender();   
            
            this._camera = new FreeCamera("cameraTirArc", new Vector3(5, 4, -2), this.scene);
            this._camera.rotation._y = 0;
            this._camera.rotation._x = Math.PI/5;
            // Vector3(4.78, 3.27, 6.38)
            // this._camera.setTarget(this.player.transform.position); // pas besoin de target le player pour ce jeu

            document.getElementById("objects-keybind")!.classList.add("hidden");
            document.getElementById("map-keybind")!.classList.add("hidden");
            document.getElementById("javelottp")!.classList.add("hidden");
            document.getElementById("javelotGame-skip-button")!.classList.remove("hidden");
            document.getElementById("javelotGame-action-container")!.classList.remove("hidden");
            document.getElementById("javelotGame-vertical-container")!.classList.remove("hidden");
            document.getElementById("javelotGame-horizontal-container")!.classList.remove("hidden");
            document.getElementById("javelotGame-skip-button")!.addEventListener("click", () => {
                this.scene.stopAnimation(this._camera);
                this.AfterCamAnim();
            });

            await this.scene.whenReadyAsync(); // on attends que la scene soit bien chargé
            this.scene.attachControl();
            this.game.engine.hideLoadingUI();

            this.CreateCameraMouv().then(() => {
                document.getElementById("javelotGame-ready-button")!.classList.remove("hidden");
                document.getElementById("javelotGame-skip-button")!.classList.add("hidden");

                document.getElementById("javelotGame-ready-button")!.addEventListener("click", () => {
                    this.startCountdown(["javelotGame-text-1", "javelotGame-text-2", "javelotGame-text-3", "javelotGame-text-4"]); 
                    this.AfterCamAnim(); 
                    this.initGui(); 
                    document.getElementById("javelotGame-ready-button")!.classList.add("hidden");
                    this.game.canvas.focus();
                });
            });

        } catch (error) {
            throw new Error(`error in enter method : ${error}`);
        }
    }

    private async startCountdown(countdownElements: string[]) {
        if (this.countdownInProgress) return; // Évite de démarrer le compte à rebours multiple fois
        let countdownIndex = 0;
        let previousElement = "";
        // console.log(this._camera.position, this._camera.rotation);

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
                }, 500);
    
                // Permet au joueur de jouer ou exécutez d'autres actions nécessaires
                this.countdownInProgress = true;
                this.fightStartTime = performance.now();
                this.countdownDone = true;
            }
        }, 1000);
        // this.player.runPriseArc();
        // await this.env._loadGameAssets(this.scene, new Vector3(-0.38, 0.2, 4), "arc.glb", "arc", new Vector3(0, 0, 0));
        // console.log(this.env.animArc);
    }

    AfterCamAnim(): void {
        // this._camera.dispose();
        // this._camera = this.player.createCameraPlayer(this.player.transform);
        this._camera.position = new Vector3(0.5, 1, 9);
        this._camera.rotation._y = -5*Math.PI/6;
        this._camera.rotation._x = Math.PI/10;
        this.player.setCamera(this._camera);
    }

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

        camKeys.push({frame: 0, value: new Vector3(5, 4, -2)});
        camKeys.push({frame: 5 * fps, value: new Vector3(-1, 0.5, 10)});
        camKeys.push({frame: 7 * fps, value: new Vector3(0.5, 1, 9)});
        // camKeys.push({frame: 9 * fps, value: new Vector3(1, 1, 6)});
        // camKeys.push({frame: 2 * fps, value: new Vector3(0, 1.5, -1)});
        // camKeys.push({frame: 4 * fps, value: new Vector3(2, 1.5, 3)});
        // camKeys.push({frame: 8 * fps, value: new Vector3(-4, 2, 13)});
       
        rotationKeys.push({frame: 0, value: new Vector3(Math.PI/5, 0, 0)});
        rotationKeys.push({frame: 5 * fps, value: new Vector3(0, -Math.PI, 0)});
        rotationKeys.push({frame: 7 * fps, value: new Vector3(Math.PI/10, -5*Math.PI/6, 0)});
        // rotationKeys.push({frame: 9 * fps, value: new Vector3(Math.PI/12, -5*Math.PI/6, 0)});
        // rotationKeys.push({frame: 2 * fps, value: new Vector3(0, 0, 0)});
        // rotationKeys.push({frame: 4 * fps, value: new Vector3(0, -Math.PI/6, 0)});
        // rotationKeys.push({frame: 8 * fps, value: new Vector3(Math.PI/10, Math.PI/3.5, 0)});

        camAnim.setKeys(camKeys);
        rotationAnim.setKeys(rotationKeys);

        this._camera.animations.push(camAnim);
        this._camera.animations.push(rotationAnim);

        await this.scene.beginAnimation(this._camera, 0, 7 * fps).waitAsync();
        document.getElementById("javelotGame-skip-button")!.classList.add("hidden");
    }

    async exit(): Promise<void> {
        console.log("exit tir arc game");
         
        document.getElementById("javelotGame-score")!.classList.add("hidden");
        document.getElementById("javelotGame-action-container")!.classList.add("hidden");
        document.getElementById("javelotGame-vertical-container")!.classList.add("hidden");
        document.getElementById("javelotGame-horizontal-container")!.classList.add("hidden");
        document.getElementById("javelotGame-results")!.classList.add("hidden");

        storeJavelot.commit('setScore', 0);
        storeJavelot.commit('setResults', []);

        this.cleanup();
    }

    update():void {
        if(this.countdownDone && !this.guiGame){
            const deltaTime = this.scene.getEngine().getDeltaTime();
            this.player.play(deltaTime, performance.now());
            if(this.player.isSpacedPressedForAnim && !this.guiGame){
                //TODO ADD GUI
                this.guiGame = true;
                console.log("afficher gui game")
                this.playActive = true;
                // this.player.setAfficherGui();
            }
        }

        if(!this.playActive){
            if(this.player._isWin && !this.scoreboardIsShow){
                this.showScoreBoard();
                // console.log("scoreboard");
            }
        }
        else{
            if(this.player.compteur < 2){
                const deltaTime = this.scene.getEngine().getDeltaTime();
                this.player.play(deltaTime, performance.now());
            }
            else if(this.player.compteur === 2 && !this.animArc){
                //TODO REMOVE GUI
                this.animArc = true;
                //attendre quelques secondes et load le javelot puis démarrer l'anim du javelot 
                // this.animationJavelot = true;
                setTimeout(() => {
                    const loadJavelotAssets = async () => {
                            await this.env._loadJavelotAssets(this.scene, new Vector3(-0.95, 0.1, 7.1), "jav.glb", "javelot", new Vector3(0, 0, 0));
                        };
                    loadJavelotAssets();
                    setTimeout(() => {
                        this.animateJavelot();
                        this.animationJavelot = true;
                    }, 50);
                }, 1300);            
            }
            else if(this.player._isWin && this.animationJavelot){
                // console.log("win"); 
                this.score = this.tableauScore[Math.abs(this.player.verticalDirection)] * this.tableauScore[Math.abs(this.player.horizontalDirection)]
                storeJavelot.commit('setScore', this.score);
                this.endGame();
            }
        }
    }

    private endGame(){
        this.playActive = false;
        this.player.runWin();
        this.createFinaleScoreBoard();
    }

    public async animateJavelot(){
        //TODO faire une anim de caméra
        // this._camera.position.z = 0;
        // ANIMATION JAVELOT
        let booleanPos1 = false;
        let booleanPos2 = false
        let booleanPos3 = false;
        const verticalDirection = this.player.verticalDirection;
        const horizontalDirection = this.player.horizontalDirection;
        console.log(verticalDirection, horizontalDirection);
        let booleanMonteeFinit = false;


        let position;
        let rotation;
        let position2;
        let rotation2;
        let timeExec;
        switch(verticalDirection){
            case 1:
                position = 0.03;
                rotation = 0.017;
                position2 = 0.025;
                rotation2 = 0.01;
                timeExec = 7;
                break;
            case 2:
                position = 0.0245;
                rotation = 0.0135;
                position2 = 0.022;
                rotation2 = 0.009;
                timeExec = 6.5;
                break;
            case 3:
                position = 0.019;
                rotation = 0.01;
                position2 = 0.020;
                rotation2 = 0.008;
                timeExec = 6;
                break;
            case 4:
                position = 0.015;
                rotation = 0.00650;
                position2 = 0.018;
                rotation2 = 0.007;
                timeExec = 5.5;
                break;
            case 5:
                position = 0.013;
                rotation = 0.00450;
                position2 = 0.014;
                rotation2 = 0.004;
                timeExec = 5;
                break;
            case 6:
                position = 0.011;
                rotation = 0.00400;
                position2 = 0.010;
                rotation2 = 0.002;
                timeExec = 4.5;
                break;
            case 7:
                position = 0.01;
                rotation = 0.00350;
                position2 = 0.008;
                rotation2 = 0.001;
                timeExec = 4;
            default:    
                break;
        }
        while(booleanPos1 === false || booleanPos2 === false || booleanPos3 === false){
            //y
            // console.log(booleanPos1, booleanPos2, booleanPos3);
            if(booleanPos3 === false){
                if(this.env.javelotAssets.mesh.position.y < 1 && !booleanMonteeFinit){
                    this.env.javelotAssets.mesh.position.y += position;
                    this.env.javelotAssets.mesh.rotation.x -= rotation;
                    await new Promise(resolve => setTimeout(resolve, timeExec));   
                }
                else if(this.env.javelotAssets.mesh.position.y > 1 && !booleanMonteeFinit){
                    booleanMonteeFinit = true;
                }
                else if(this.env.javelotAssets.mesh.position.y > 0.1 && booleanMonteeFinit){
                    this.env.javelotAssets.mesh.position.y -= position;
                    this.env.javelotAssets.mesh.rotation.x -= rotation;
                    await new Promise(resolve => setTimeout(resolve, timeExec));
                }
                else if(this.env.javelotAssets.mesh.position.y <= 0.1 && booleanMonteeFinit){
                    booleanPos3 = true;
                }
            }
            //z
            if(booleanPos1 === false){
                // console.log(this.env.javelotAssets.mesh.position.z);
                const eloignement = verticalDirection -1;
                if(this.env.javelotAssets.mesh.position.z > 4.49666 - (1.00621 * eloignement) ){
                    this.env.javelotAssets.mesh.position.z -= 0.05;
                    await new Promise(resolve => setTimeout(resolve, timeExec));
                }
                else if(this.env.javelotAssets.mesh.position.z < 4.49666 - (1.00621 * eloignement)){
                    booleanPos1 = true;
                }
            }
            //x
            if(booleanPos2 === false){
                const eloignement = Math.abs(horizontalDirection);
                if(horizontalDirection === 0){
                    booleanPos2 = true;
                }
                else if(horizontalDirection < 0 && this.env.javelotAssets.mesh.position.x < -0.95 + (0.49518 * eloignement)){
                    this.env.javelotAssets.mesh.position.x += position2;
                    this.env.javelotAssets.mesh.rotation.y -= rotation2;
                    await new Promise(resolve => setTimeout(resolve, timeExec));
                }
                else if(horizontalDirection < 0 && this.env.javelotAssets.mesh.position.x > -0.95 + (0.49518 * eloignement)){
                    booleanPos2 = true;
                }
                else if(horizontalDirection > 0 && this.env.javelotAssets.mesh.position.x > -0.95 - (0.49518 * eloignement)){
                    this.env.javelotAssets.mesh.position.x -= position2;
                    this.env.javelotAssets.mesh.rotation.y += rotation2;
                    await new Promise(resolve => setTimeout(resolve, timeExec));
                }
                else if(horizontalDirection > 0 && this.env.javelotAssets.mesh.position.x < -0.95 - (0.49518 * eloignement)){
                    booleanPos2 = true;
                }
            }
        }
        setTimeout(() => {
            console.log("fin anim javelot");
            this.player._isWin = true;
        }, 2500);        
	}


    showScoreBoard(): void {
        this.scoreboardIsShow = true;
        document.getElementById("javelotGame-text-finish")!.classList.remove("hidden");
        let continueButton = document.querySelector('#javelotGame-results #continue-button');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                if (this.continueButtonIsPressed) return;
                this.game.changeState(new InGameState(this.game, this.game.canvas));
            });
        }
        // attendre 2 secondes avant d'afficher le tableau des scores
        setTimeout(() => {
            document.getElementById("javelotGame-text-finish")!.classList.add("hidden");
            document.getElementById("javelotGame-results")!.classList.remove("hidden");
        }, 2000);   
        
    }

    buildScoreBoard() : void {
        this.results.push({place: 1, name: this.playerName, result: "0"});
        storeJavelot.commit('setResults', this.results);
    }

    createFinaleScoreBoard() : void{
        this.results = [];
        this.results.push({place: 1, name: this.playerName, result: ""+this.score});
        storeJavelot.commit('setResults', this.results);
    }

    public invisiblePlatform(): void {
        const platform = this.scene.getMeshByName("CylinderTirFacile");
        if (platform) {
            platform.isVisible = false;
        }
        const platform2 = this.scene.getMeshByName("CylinderTirFacileAtt");
        if (platform2) {
            platform2.isVisible = false;
        }
    }


}
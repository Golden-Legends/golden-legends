import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { SoundManager } from "@/models/environments/sound";
import PlongeonGameSettings from "../../../assets/plongeonGameSettings.json";
import { Animation, Color3, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Texture, Vector3 } from "@babylonjs/core";
import { PlayerInputPlongeonGame } from "@/models/inputsMangement/PlayerInputPlongeonGame";
import { PlayerPlongeonGame } from "@/models/controller/PlayerPlongeonGame";
import { plongeonGameEnv } from "@/models/environments/plongeonGameEnv";
import { SkyMaterial, WaterMaterial } from "@babylonjs/materials";

interface line {
    start : string;
    end : string;
}

interface level {
    pointToSucceed : number;
}

interface IPlongeonGameState {
    placement : line[],
    level : {
        easy : level;
        intermediate : level;
        hard : level;
    }
}

export class PlongeonGameState extends GameState {
    public _camera !: FreeCamera;

    private settings : IPlongeonGameState;
    private startPlacement : Mesh[] = [];
    private endPlacement : Mesh[] = [];

    private player !: PlayerPlongeonGame;
    private playerName : string;
    private _input : PlayerInputPlongeonGame;

    // private botArray : BotPlongeon[] = [];
    
    private isMultiplayer: boolean = false;
    private difficulty: "easy" | "intermediate" | "hard";

    private countdownInProgress: boolean = false;
    private fightStartTime: number = 0;

    public soundManager!: SoundManager;
    public waterMaterial!: WaterMaterial;
    private skyBox!: Mesh;

    constructor(soundManager: SoundManager, game: Game, canvas: HTMLCanvasElement, difficulty ?: "easy" | "intermediate" | "hard", multi ?: boolean) {
        super(game, canvas);
        this._input = new PlayerInputPlongeonGame(this.scene);
        this.playerName = localStorage.getItem("playerName") || "Playertest";
        this.settings = PlongeonGameSettings; //settings running to do later
        this.difficulty = difficulty ? difficulty : "easy";
        this.isMultiplayer = multi ? multi : false;
        this.soundManager = soundManager;
        this.soundManager.addTrack('100m', './sounds/100m.m4a', 0.1);
        this.soundManager.playTrack('100m');
    }

    async setEnvironment(): Promise<void> {
        try {
            const maps = new plongeonGameEnv(this.scene);
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
        const rectangleReturn = this.scene.getMeshByName("returnRectangle") as Mesh;
        rectangleReturn.isVisible = false;
    }

    private async initPlayer () {
        const indexForPlayerPlacement = 0;
        const startMesh = this.startPlacement[indexForPlayerPlacement];
        const getFileName = localStorage.getItem("pathCharacter");
        this.player = new PlayerPlongeonGame(startMesh.getAbsolutePosition().x || 0, 
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
        // await this.initSoloWithBot(this.difficulty);
        // this.buildScoreBoard();
    }

    // private async initSoloWithBot(difficulty : string) {
    //     const infoBot = this.settings.level[difficulty].botInfo;
    //     for (let i = 0; i < 1; i++) {
    //         const startMesh = this.startPlacement[i];
    //         const endMesh = this.endPlacement[i];
    //         //nicolas changer le pathfile dans le fichier natationGameSettings.json --> DONE
    //         const bot = new BotPlongeon("bot" + i, startMesh.getAbsolutePosition(), 
    //                 endMesh,
    //                 this.scene,
    //                 infoBot[i].pathFile, infoBot[i].speed);
    //         await bot.init();
    //         this.botArray.push(bot);
    //     }        
    // }

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
            this.invisiblePlatform();
            // this.createSkybox();
		    this.addTextureEau();
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
            
            this._camera = new FreeCamera("cameraPlongeon", new Vector3(4.78, 2, 20), this.scene);
            this._camera.rotation._y = Math.PI/2;
            this._camera.rotation._x = Math.PI/5;
            // Vector3(4.78, 3.27, 6.38)
            // this._camera.setTarget(this.player.transform.position); // pas besoin de target le player pour ce jeu

            document.getElementById("plongeonGame-skip-button")!.classList.remove("hidden");
            document.getElementById("plongeonGame-skip-button")!.addEventListener("click", () => {
                this.scene.stopAnimation(this._camera);
                this.AfterCamAnim();
            });

            await this.scene.whenReadyAsync(); // on attends que la scene soit bien chargé
            this.scene.attachControl();
            this.game.engine.hideLoadingUI();

            this.CreateCameraMouv().then(() => {
                document.getElementById("plongeonGame-ready-button")!.classList.remove("hidden");
                document.getElementById("plongeonGame-skip-button")!.classList.add("hidden");

                document.getElementById("plongeonGame-ready-button")!.addEventListener("click", () => {
                    this.startCountdown(["plongeonGame-text-1", "plongeonGame-text-2", "plongeonGame-text-3", "plongeonGame-text-4"]); 
                    this.AfterCamAnim(); 
                    this.initGui(); 
                    document.getElementById("plongeonGame-ready-button")!.classList.add("hidden");
                    this.game.canvas.focus();
                });
            });

        } catch (error) {
            throw new Error(`error in enter method : ${error}`);
        }
    }

    private startCountdown(countdownElements: string[]) {
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
            }
        }, 1000);
    }

    AfterCamAnim(): void {
        // this._camera.dispose();
        // this._camera = this.player.createCameraPlayer(this.player.transform);
        this._camera.position = new Vector3(-4, 2.5, 14.45);
        this._camera.rotation._y = Math.PI/2;
        this._camera.rotation._x = Math.PI/5;
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

        camKeys.push({frame: 0, value: new Vector3(-4, 3.6, 14.45)});
        camKeys.push({frame: 2 * fps, value: new Vector3(0, 3.6, 11)});
        camKeys.push({frame: 4 * fps, value: new Vector3(4, 3.6, 14.45)});
        camKeys.push({frame: 6 * fps, value: new Vector3(0, 3.6, 17.90)});
        camKeys.push({frame: 9 * fps, value: new Vector3(-4, 2.5, 14.45)});
       
        rotationKeys.push({frame: 0, value: new Vector3(Math.PI/4, Math.PI/2, 0)});
        rotationKeys.push({frame: 2 * fps, value: new Vector3(Math.PI/4, 0, 0)});
        rotationKeys.push({frame: 4 * fps, value: new Vector3(Math.PI/4, -Math.PI/2, 0)});
        rotationKeys.push({frame: 6 * fps, value: new Vector3(Math.PI/4, -Math.PI, 0)});
        rotationKeys.push({frame: 9 * fps, value: new Vector3(Math.PI/5, -3*Math.PI/2, 0)});

        camAnim.setKeys(camKeys);
        rotationAnim.setKeys(rotationKeys);

        this._camera.animations.push(camAnim);
        this._camera.animations.push(rotationAnim);

        await this.scene.beginAnimation(this._camera, 0, 9 * fps).waitAsync();
        document.getElementById("plongeonGame-skip-button")!.classList.add("hidden");
    }

    async exit(): Promise<void> {
        console.log("exit plongeon game");
         
        document.getElementById("runningGame-timer")!.classList.add("hidden");

        this.soundManager.stopTrack('100m');
        this.clearScene();
    }

    update():void {
        console.log("update");
    }

    public addTextureEau(){
        const waterMesh = this.scene.getMeshByName("eauNatation");
        if (waterMesh) {
            // waterMesh.scaling = new Vector3(750,1,750);
            // waterMesh.position = new Vector3(-145, -3.05, -54.1);	
            this.waterMaterial = new WaterMaterial("water_material", this.scene);
            this.waterMaterial.bumpTexture = new Texture(
                "./assets/water/water_bump.jpg",
                this.scene,
            );
            // this.waterMaterial.windForce = 3;
            // this.waterMaterial.waveHeight = 0.8;
            this.waterMaterial.alpha = 0.9;
            this.waterMaterial.waterColor = new Color3(0.1, 0.1, 0.6);
            this.waterMaterial.colorBlendFactor = 0.5;
            this.waterMaterial.addToRenderList(this.skyBox);
            waterMesh.material = this.waterMaterial;
        }
        const waterMesh2 = this.scene.getMeshByName("eauPlongeon");
        if(waterMesh2){
            waterMesh2.material = this.waterMaterial;
        }
    }

    public createSkybox(): void {
		const skyMaterial = new SkyMaterial("skyMaterial", this.scene);
		skyMaterial.backFaceCulling = false;
		skyMaterial.turbidity = 10;
		skyMaterial.luminance = 1;
		skyMaterial.inclination = 0;
		this.skyBox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
		this.skyBox.material = skyMaterial;
	}

    public invisiblePlatform(): void {
        const platform = this.scene.getMeshByName("cylindreArrivéePlongeon");
        if (platform) {
            platform.isVisible = false;
        }
        const platform2 = this.scene.getMeshByName("cylindrediff");
        if (platform2) {
            platform2.isVisible = false;
        }
        const platform3 = this.scene.getMeshByName("cylindreMoyen");
        if (platform3) {
            platform3.isVisible = false;
        }
        const platform4 = this.scene.getMeshByName("cylindreFacile");
        if (platform4) {
            platform4.isVisible = false;
        }
        const platform5 = this.scene.getMeshByName("cylindreNoobg");
        if (platform5) {
            platform5.isVisible = false;
        }
        const platform6 = this.scene.getMeshByName("cylindreNoobd");
        if (platform6) {
            platform6.isVisible = false;
        }
        for(let i = 0; i < 6; i++){
            if(i === 0){
                const platform = this.scene.getMeshByName("cylindreArrivéeNatation");
                if (platform) {
                    platform.isVisible = false;
                }
            }
            else{
                const platform = this.scene.getMeshByName("cylindreArrivéeNatation.00" + i);
                if (platform) {
                    platform.isVisible = false;
                }
            }
        }   
    }

    //timer à revoir avec à la place un compteur de points (affichage différents juste)

}
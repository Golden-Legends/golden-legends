import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { natationGameEnv } from "@/models/environments/natatonGameEnv";
import { FreeCamera, HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import NatationGameSettings from "../../../assets/natationGameSettings.json";
import { PlayerInputRunningGame } from "@/models/inputsMangement/PlayerInputRunningGame";
import { PlayerNatationGame } from "@/models/controller/PlayerNatationGame";

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
    private _input : PlayerInputRunningGame;


    constructor(game: Game, canvas: HTMLCanvasElement, difficulty ?: "easy" | "intermediate" | "hard", multi ?: boolean) {
        super(game, canvas);
        this.difficulty = difficulty ? difficulty : "easy";
        this.isMultiplayer = multi ? multi : false;
        this.settings = NatationGameSettings;
        this._input = new PlayerInputRunningGame(this.scene);

    }
    async enter(): Promise<void> {
        try {            
            //load the gui iin the mainmenu and not here only for prod 
            await this.game.loadingScreen.loadGui();
            this.game.engine.displayLoadingUI();

            // Inspector.Show(this.scene, {});
            await this.setEnvironment();
            this.createLight();
            this.setLinePlacement();

            // Init player 
            const indexForPlayerPlacement = 2;
            const startMesh = this.startPlacement[indexForPlayerPlacement];
            const getFileName = localStorage.getItem("pathCharacter");
            this.player = new PlayerNatationGame(startMesh.getAbsolutePosition().x || 0, 
                                                startMesh.getAbsolutePosition().y || 0, 
                                                startMesh.getAbsolutePosition().z || 0, 
                                                this.scene, 
                                                `./models/characters/${getFileName}`, this.firstEndPlacement[indexForPlayerPlacement],
                                                this._input, false);
            await this.player.init();
            
            // permet d'enlever la position du joueur de la liste des positions facilitera la suite
            this.startPlacement.splice(indexForPlayerPlacement, 1);
            this.firstEndPlacement.splice(indexForPlayerPlacement, 1);

            // mettre de l'aléatoire dans les positions des bots
            {this.startPlacement, this.firstEndPlacement, this.secondEndPlacement} this.shuffleArray(this.startPlacement, this.firstEndPlacement, this.secondEndPlacement);

            this.game.engine.hideLoadingUI(); 

            this._camera = new FreeCamera("cameraNatation", new Vector3(4.78, 3.27, 6.38), this.scene);
            this._camera.setTarget(new Vector3(3.95 , 2.81, 6.08));
            // this._camera.rotation = new Vector3(27.41, 250.01, 0.0);
            this._camera.attachControl(this.canvas, true); 
                        
            this.runRenderLoop();          

        } catch (error) {
            throw new Error(`error in enter method : ${error}`);
        }
    }
    exit(): void {
        throw new Error("Method not implemented.");
    }
    update(): void {
        throw new Error("Method not implemented.");
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

}
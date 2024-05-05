import { Game } from "@/models/Game";
import { GameState } from "@/models/GameState";
import { SoundManager } from "@/models/environments/sound";
import { PlayerInputBoxeGame } from "@/models/inputsMangement/PlayerInputBoxeGame";

export class BoxeGameState extends GameState {

    private _input : PlayerInputBoxeGame;
    

    private isMultiplayer: boolean = false;
    private difficulty: "easy" | "intermediate" | "hard";

    public soundManager!: SoundManager;

    constructor(soundManager: SoundManager, game: Game, canvas: HTMLCanvasElement, difficulty ?: "easy" | "intermediate" | "hard", multi ?: boolean) {
        super(game, canvas);
        this._input = new PlayerInputBoxeGame(this.scene);
        // this.settings = RunningGameSettings; //settings running to do later
        this.difficulty = difficulty ? difficulty : "easy";
        this.isMultiplayer = multi ? multi : false;
        this.soundManager = soundManager;
        this.soundManager.addTrack('100m', './sounds/100m.m4a', 0.1);
        this.soundManager.playTrack('100m');
    }


    // Implement abstract members of GameState
    async enter(): Promise<void> {}
    async exit(): Promise<void> {}
    update() {}
    setEnvironment() {}

    // Todo : Bases du jeu de la boxe
    // chargement des éléments du jeu (map, les 2 persos en idleBoxe,...)
    // faire l'animation de départ de caméra
    // affichage du bouton passer et du bouton pret ensuite
    // ensuite voir pour le jeu en lui même

}
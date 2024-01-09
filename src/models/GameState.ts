import { Scene } from "@babylonjs/core";
import { Game } from "./Game";

export abstract class GameState {
    protected game: Game;
    protected scene: Scene;
    protected canvas: HTMLCanvasElement;

    constructor(game: Game, canvas: HTMLCanvasElement) {
        this.game = game;
        this.canvas = canvas;
        this.scene = new Scene(game.engine);
    }

    abstract enter(): void;
    abstract exit(): void;
    abstract update(): void;

    // Méthode pour nettoyer la scène
    protected clearScene(): void {
        this.scene.dispose();
    }

    getScene() : Scene {
        return this.scene;
    }
}


import { Engine } from "@babylonjs/core";
import { GameState } from "./GameState";
import { StartState } from "./scene/StartState";

export class Game {
    public engine: Engine;
    private currentState: GameState | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true);
        this.changeState(new StartState(this));

        // Initialiser la boucle de rendu ici
        this.engine.runRenderLoop(() => {
            if (this.currentState) {
                this.currentState.update();
                this.currentState.getScene().render();
            }
        });
    }

    changeState(newState: GameState) {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter();
    }
}

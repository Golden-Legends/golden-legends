import { Engine } from "@babylonjs/core";
import { GameState } from "./GameState";
import { InGameState } from "./scene/InGameState";

export class Game {
  public engine: Engine;
  private currentState: GameState | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.changeState(new InGameState(this, canvas));

    // Initialiser la boucle de rendu ici
    this.engine.runRenderLoop(() => {
      if (this.currentState) {
        this.currentState.update();
        this.currentState.getScene().render();
      }
    }); // this.scene.render();
  }

  changeState(newState: GameState) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = newState;
    this.currentState.enter();
  }
}

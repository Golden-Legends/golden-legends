import { Engine } from "@babylonjs/core";
import { GameState } from "./GameState";
import "@babylonjs/loaders/glTF";
import { MainMenuState } from "./scene/MainMenuState";

export class Game {
  public engine: Engine;
  private currentState: GameState | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    // Initialiser le premier état du jeu ici
    this.changeState(new MainMenuState(this, canvas));
  }

  changeState(newState: GameState) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = newState;
    this.currentState.enter();
  }
}

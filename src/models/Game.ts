import { Engine, ILoadingScreen } from "@babylonjs/core";
import { GameState } from "./GameState";
import "@babylonjs/loaders/glTF";
import { CustomLoadingScreen } from "./loadingScreen/customLoadingScreen";
import {InGameState} from "./scene/InGameState.ts";

export class Game {
  public engine: Engine;
  private currentState: GameState | null = null;
  public loadingScreen: CustomLoadingScreen;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.loadingScreen = new CustomLoadingScreen("Loading...");
    this.setLoadingScreen(this.loadingScreen);
    this.changeState(new InGameState(this, canvas));
  }

  public setLoadingScreen (customLoadingScreen : ILoadingScreen) {
		this.engine.loadingScreen = customLoadingScreen;
  }

  async changeState(newState: GameState) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = newState;
    this.currentState.enter();
  }
}

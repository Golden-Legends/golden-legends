import { Engine, ILoadingScreen } from "@babylonjs/core";
import { GameState } from "./GameState";
import "@babylonjs/loaders/glTF";
import { CustomLoadingScreen } from "./loadingScreen/customLoadingScreen";
import {InGameState} from "./scene/InGameState.ts";
import { RunningGameState } from "./scene/games/RunningGameState.ts";
import { NatationGameState } from "./scene/games/NatationGameState.ts";

export class Game {
  public engine: Engine;
  private currentState: GameState | null = null;
  // public loadingScreen: CustomLoadingScreen;
  public canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.canvas = canvas;
    this.changeState(new InGameState(this, canvas));

  }

  public setLoadingScreen (customLoadingScreen : ILoadingScreen) {
		this.engine.loadingScreen = customLoadingScreen;
  }

  async changeState(newState: GameState) {
    if (this.currentState) {
      await this.currentState.exit();
    }
    this.currentState = newState;
    await this.currentState.enter();
  }
}

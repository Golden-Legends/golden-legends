import { Engine, ILoadingScreen } from "@babylonjs/core";
import { GameState } from "./GameState";
import "@babylonjs/loaders/glTF";
import { CustomLoadingScreen } from "./loadingScreen/customLoadingScreen";
import { InGameState } from "./scene/InGameState.ts";
import { RunningGameState } from "./scene/games/RunningGameState.ts";
import { NatationGameState } from "./scene/games/NatationGameState.ts";
import { PlongeonGameState } from "./scene/games/PlongeonGameState.ts";
import { TirArcGameState } from "./scene/games/TirArcGameState.ts";
import { JavelotGameState } from "./scene/games/JavelotGameState.ts";
import { SoundManager } from "./environments/sound.ts";
import { BoxeGameState } from "./scene/games/BoxeGameState.ts";
import { TennisGameState } from "./scene/games/TennisGameState.ts";

export class Game {
  public engine: Engine;
  private currentState: GameState | null = null;
  public canvas: HTMLCanvasElement;
  private soundManager: SoundManager;
  private currentTrackName: string;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.canvas = canvas;
    // initialisation de la musique
    this.soundManager = new SoundManager();
    this.currentTrackName = "";
    this.initTrack();
    this.changeState(new InGameState(this, canvas));
  }

  public setLoadingScreen(customLoadingScreen: ILoadingScreen) {
    this.engine.loadingScreen = customLoadingScreen;
  }

  async changeState(newState: GameState) {
    if (this.currentState) {
      await this.currentState.exit();
    }
    this.currentState = newState;
    await this.currentState.enter();
  }

  private initTrack() {
    this.soundManager.addTrack("inGame", "./sounds/musiqueJeuNew.m4a", 0.05);
    this.soundManager.addTrack("100m", "./sounds/100m.m4a", 0.1);
    this.soundManager.addTrack("arcJavelot", "./sounds/arcJavelot.mp3", 0.1);
    this.soundManager.addTrack("boxeTennis", "./sounds/boxeTennis.mp3", 0.1);
    this.soundManager.addTrack("plongeon", "./sounds/plongeon.mp3", 0.1);
  }

  public playTrack(trackName: string) {
    if (this.currentTrackName && this.currentTrackName !== "") {
      this.soundManager.stopTrack(this.currentTrackName);
    }
    this.soundManager.playTrack(trackName);
    this.currentTrackName = trackName;
  }

  public changeActive(trackName: string) {
    if (this.currentTrackName && this.currentTrackName !== "") {
      this.soundManager.stopTrack(this.currentTrackName);
    }
    this.soundManager.changeActive(trackName);
    this.currentTrackName = trackName;
  }

  public getSoundManager() {
    return this.soundManager;
  }
}

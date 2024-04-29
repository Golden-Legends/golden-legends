import { Scene } from "@babylonjs/core";
import { Game } from "./Game";
import { Player } from "./controller/Player";
import { Environment } from "./environments/environments";
export abstract class GameState {
  protected game: Game;
  protected scene: Scene;
  protected canvas: HTMLCanvasElement;
  protected _player : Player | null ; 
	protected _environment : Environment | null;

  // pointer 
	public alreadylocked: boolean = false;


  constructor(game: Game, canvas: HTMLCanvasElement) {
    this.game = game;
    this.canvas = canvas;
    this.scene = new Scene(this.game.engine);
    this._player = null;
    this._environment = null;
  }

  abstract enter(): Promise<void>;
  abstract exit(): Promise<void>;
  abstract update(): void;
  abstract setEnvironment() : void;

  // Méthode pour nettoyer la scène
  protected clearScene(): void {
    this.scene.dispose();
    this.scene.detachControl();
  }

  runRender () {
   this.scene.render();
  }

  runRenderLoop () {
    this.game.engine.runRenderLoop(() => {
      if (this) {
        this.scene.render();
      }
    });
  }

  runUpdateAndRender() {
    this.game.engine.runRenderLoop(() => {
      if (this) {
        this.scene.render();
        this.update();
      }
    });
  } 
  
  handlePointerLockChange() : void {
    this.scene.onPointerDown = () => {
      if (!this.alreadylocked) {
        this.canvas.requestPointerLock();
      }
    };
  
    document.addEventListener("pointerlockchange", () => {
      let element = document.pointerLockElement || null;
      if (element) {
        // lets create a custom attribute
        this.alreadylocked = true;
      } else {
        this.alreadylocked = false;
      }
    });
  }
  
  // enlever le handlepointerlock
  removeHandlePointerLock() : void {
    document.exitPointerLock();
  }
}

import { Scene } from "@babylonjs/core";
import { Game } from "./Game";
import { Player } from "./controller/Player";
import { PlayerInput } from "./inputsMangement/PlayerInput";
import { Environment } from "./environments/environments";

export abstract class GameState {
  protected game: Game;
  protected scene: Scene;
  protected canvas: HTMLCanvasElement;
  protected _player : Player | null ; 
	protected _input : PlayerInput | null ; 
	protected _environment : Environment | null;

  // pointer 
	public alreadylocked: boolean = false;


  constructor(game: Game, canvas: HTMLCanvasElement) {
    this.game = game;
    this.canvas = canvas;
    this.scene = new Scene(game.engine);
    this._player = null;
    this._input = null;
    this._environment = null;

  }

  abstract enter(): void;
  abstract exit(): void;
  abstract update(): void;
  abstract setEnvironment() : void;

  // Méthode pour nettoyer la scène
  protected clearScene(): void {
    this.scene.dispose();
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

  runUpdate() {
    this.game.engine.runRenderLoop(() => {
      if (this) {
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
}

import { Scene } from "@babylonjs/core";
import { Game } from "./Game";
import { Player } from "./controller/Player";
import { Environment } from "./environments/environments";
export abstract class GameState {
  protected game: Game;
  protected scene: Scene;
  protected canvas: HTMLCanvasElement;
  protected _player: Player | null;
  protected _environment: Environment | null;

  // pointer
  public alreadylocked: boolean;
  private boundOnPointerLockChange: () => void;
  private eventListeners: {
    element: HTMLElement;
    event: string;
    handler: EventListenerOrEventListenerObject;
  }[] = [];

  constructor(game: Game, canvas: HTMLCanvasElement) {
    this.game = game;
    this.canvas = canvas;
    this.scene = new Scene(this.game.engine);
    this._player = null;
    this._environment = null;
    this.alreadylocked = false;
    this.boundOnPointerLockChange = this.onPointerLockChange.bind(this);
  }

  abstract enter(): Promise<void>;
  abstract exit(): Promise<void>;
  abstract update(): void;
  abstract setEnvironment(): void;

  // Méthode pour nettoyer la scène
  protected clearScene(): void {
    this.scene.dispose();
    this.scene.detachControl();
  }

  // Arrêter la boucle de rendu
  protected stopRenderLoop(): void {
    this.game.engine.stopRenderLoop();
  }

  // Arrêter la boucle de rendu et nettoyer les ressources
  protected cleanup(): void {
    this.stopRenderLoop();
    this.clearScene();
    this.disposePointerLock();
    this.cleanupEventListeners();
    ("Cleaned up the game state.");
  }

  runRender() {
    this.scene.render();
  }

  runRenderLoop() {
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

  // Initialiser la gestion du pointer lock
  initializePointerLock(): void {
    this.scene.onPointerDown = () => {
      if (!this.alreadylocked) {
        // this.alreadylocked = true;
        this.canvas.requestPointerLock();
      }
    };
    // Conserver la référence à la fonction liée
    this.boundOnPointerLockChange = this.onPointerLockChange.bind(this);
    document.addEventListener(
      "pointerlockchange",
      this.boundOnPointerLockChange,
    );
  }

  // Nettoyer la gestion du pointer lock
  disposePointerLock(): void {
    document.removeEventListener(
      "pointerlockchange",
      this.boundOnPointerLockChange,
    );
    this.scene.onPointerDown = undefined;
  }

  // Gestion du changement de l'état du pointer lock
  private onPointerLockChange(): void {
    this.alreadylocked = document.pointerLockElement === this.canvas;
  }

  // Enlever le pointer lock manuellement
  removeHandlePointerLock(): void {
    document.exitPointerLock();
    this.alreadylocked = false;
  }

  addHandlePointerLock(): void {
    this.canvas.requestPointerLock();
    this.alreadylocked = true;
    this.game.canvas.focus();
  }

  addEventListenerById(
    elementId: string,
    event: string,
    handler: EventListenerOrEventListenerObject,
  ): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    }
  }

  addEventListenerByQuerySelector(
    elementId: string,
    event: string,
    handler: EventListenerOrEventListenerObject,
  ): void {
    const element = document.querySelector(elementId) as HTMLElement;
    if (element) {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    }
  }

  cleanupEventListeners(): void {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  public getGame(): Game {
    return this.game;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}

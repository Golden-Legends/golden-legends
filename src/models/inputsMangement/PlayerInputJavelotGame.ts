import { InputManager } from "./InputManager";

export class PlayerInputJavelotGame extends InputManager {
  readonly keys = {
    KEY_FIGURES: "KeyS",
    KEY_FIGURED: "KeyD",
    KEY_SPACE: "Space",
  };

  public figures: boolean = false;
  public figured: boolean = false;
  public space: boolean = false;

  private keyHandled = {
    figures: false,
    figured: false,
    space: false,
  };

  constructor(scene) {
    super(scene);
    this.setupBeforeRenderObservable(this.updateFromKeyboard);
  }

  protected updateFromKeyboard = () => {
    this.updateFigure1Keys();
    this.updateFigure2Keys();
    this.updateSpacekeys();
  };

  private updateFigure1Keys(): void {
    if (this.inputMap[this.keys.KEY_FIGURES] && !this.keyHandled.figures) {
      this.figures = true;
      this.keyHandled.figures = true;
    } else if (!this.inputMap[this.keys.KEY_FIGURES]) {
      this.figures = false;
      this.keyHandled.figures = false;
    }
  }

  private updateFigure2Keys(): void {
    if (this.inputMap[this.keys.KEY_FIGURED] && !this.keyHandled.figured) {
      this.figured = true;
      this.keyHandled.figured = true;
    } else if (!this.inputMap[this.keys.KEY_FIGURED]) {
      this.figured = false;
      this.keyHandled.figured = false;
    }
  }

  private updateSpacekeys(): void {
    if (this.inputMap[this.keys.KEY_SPACE] && !this.keyHandled.space) {
      this.space = true;
      this.keyHandled.space = true;
    } else if (!this.inputMap[this.keys.KEY_SPACE]) {
      this.space = false;
      this.keyHandled.space = false;
    }
  }
}

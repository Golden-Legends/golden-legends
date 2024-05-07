import { InputManager } from "./InputManager";

export class PlayerInputTirArcGame extends InputManager {
    readonly keys = {
        KEY_FIGURE1: "KeySpace"
    };

    public figure1: boolean = false;

    constructor(scene) {
        super(scene);
        this.setupBeforeRenderObservable(this.updateFromKeyboard);
    }

    protected updateFromKeyboard = () => {
        this.updateFigure1Keys();
    }
    
    private updateFigure1Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGURE1]) {
            this.figure1 = true;
        } else {
            this.figure1 = false;
        }
    }

}
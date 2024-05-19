import { InputManager } from "./InputManager";

export class PlayerInputJavelotGame extends InputManager {
    readonly keys = {
        KEY_SPACE: "Space",
        KEY_FIGUREV: "KeyV",
        KEY_FIGUREH: "KeyH"
    };

    public space: boolean = false;
    public figurev: boolean = false;
    public figureh: boolean = false;

    constructor(scene) {
        super(scene);
        this.setupBeforeRenderObservable(this.updateFromKeyboard);
    }

    protected updateFromKeyboard = () => {
        this.updateSpacekeys();
        this.updateFigureVKeys();
        this.updateFigureHKeys();
    }
    
    private updateSpacekeys(): void {
        if (this.inputMap[this.keys.KEY_SPACE]) {
            this.space = true;
        } else {
            this.space = false;
        }
    }

    private updateFigureVKeys(): void {
        if (this.inputMap[this.keys.KEY_FIGUREV]) {
            this.figurev = true;
        } else {
            this.figurev = false;
        }
    }

    private updateFigureHKeys(): void {
        if (this.inputMap[this.keys.KEY_FIGUREH]) {
            this.figureh = true;
        } else {
            this.figureh = false;
        }
    }

}
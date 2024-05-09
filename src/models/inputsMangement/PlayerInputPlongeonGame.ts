import { InputManager } from "./InputManager";

export class PlayerInputPlongeonGame extends InputManager {
    readonly keys = {
        KEY_FIGURE1: "KeyF",
        KEY_FIGURE2: "KeyG",
        KEY_FIGURE3: "KeyH",
        KEY_FIGURE4: "KeyJ",
        KEY_SPACE: "Space"
    };

    public figure1: boolean = false;
    public figure2: boolean = false;
    public figure3: boolean = false;
    public figure4: boolean = false;
    public space: boolean = false;

    constructor(scene) {
        super(scene);
        this.setupBeforeRenderObservable(this.updateFromKeyboard);
    }

    protected updateFromKeyboard = () => {
        this.updateFigure1Keys();
        this.updateFigure2Keys();
        this.updateFigure3Keys();
        this.updateFigure4Keys();
        this.updateSpacekeys();
    }
    
    private updateFigure1Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGURE1]) {
            this.figure1 = true;
        } else {
            this.figure1 = false;
        }
    }

    private updateFigure2Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGURE2]) {
            this.figure2 = true;
        } else {
            this.figure2 = false;
        }
    }

    private updateFigure3Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGURE3]) {
            this.figure3 = true;
        } else {
            this.figure3 = false;
        }
    }

    private updateFigure4Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGURE4]) {
            this.figure4 = true;
        } else {
            this.figure4 = false;
        }
    }

    private updateSpacekeys(): void {
        if (this.inputMap[this.keys.KEY_SPACE]) {
            this.space = true;
        } else {
            this.space = false;
        }
    }
    
}
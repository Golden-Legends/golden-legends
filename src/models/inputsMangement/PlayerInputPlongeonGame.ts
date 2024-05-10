import { InputManager } from "./InputManager";

export class PlayerInputPlongeonGame extends InputManager {
    readonly keys = {
        KEY_FIGUREF: "KeyF",
        KEY_FIGUREG: "KeyG",
        KEY_FIGUREH: "KeyH",
        KEY_FIGUREJ: "KeyJ",
        KEY_SPACE: "Space"
    };

    public figuref: boolean = false;
    public figureg: boolean = false;
    public figureh: boolean = false;
    public figurej: boolean = false;
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
        if (this.inputMap[this.keys.KEY_FIGUREF]) {
            this.figuref = true;
        } else {
            this.figuref = false;
        }
    }

    private updateFigure2Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGUREG]) {
            this.figureg = true;
        } else {
            this.figureg = false;
        }
    }

    private updateFigure3Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGUREH]) {
            this.figureh = true;
        } else {
            this.figureh = false;
        }
    }

    private updateFigure4Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGUREJ]) {
            this.figurej = true;
        } else {
            this.figurej = false;
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
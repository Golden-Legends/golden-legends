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

    private keyHandled = {
        figuref: false,
        figureg: false,
        figureh: false,
        figurej: false,
        space: false
    };

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
        if (this.inputMap[this.keys.KEY_FIGUREF] && !this.keyHandled.figuref) {
            console.log("figuref");
            this.figuref = true;
            this.keyHandled.figuref = true;
        } else if (!this.inputMap[this.keys.KEY_FIGUREF]) {
            this.figuref = false;
            this.keyHandled.figuref = false;
        }
    }

    private updateFigure2Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGUREG] && !this.keyHandled.figureg) {
            this.figureg = true;
            this.keyHandled.figureg = true;
        } else if (!this.inputMap[this.keys.KEY_FIGUREG]) {
            this.figureg = false;
            this.keyHandled.figureg = false;
        }
    }

    private updateFigure3Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGUREH] && !this.keyHandled.figureh) {
            this.figureh = true;
            this.keyHandled.figureh = true;
        } else if (!this.inputMap[this.keys.KEY_FIGUREH]) {
            this.figureh = false;
            this.keyHandled.figureh = false;
        }
    }

    private updateFigure4Keys(): void {
        if (this.inputMap[this.keys.KEY_FIGUREJ] && !this.keyHandled.figurej) {
            this.figurej = true;
            this.keyHandled.figurej = true;
        } else if (!this.inputMap[this.keys.KEY_FIGUREJ]) {
            this.figurej = false;
            this.keyHandled.figurej = false;
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

import { InputManager } from "./InputManager";

export class PlayerInputBoxeGame extends InputManager {
    readonly keys = {
        KEY_PARAGEPOING: "KeyJ",
        KEY_PARAGEJAMBES: "KeyD",
    };

    public jambes: boolean = false;
    public poing: boolean = false;

    constructor(scene) {
        super(scene);
        this.setupBeforeRenderObservable(this.updateFromKeyboard);
    }

    protected updateFromKeyboard = () => {
        this.updateJambesKeys();
        this.updatePoingKeys();
    }
    
    private updateJambesKeys(): void {
        if (this.inputMap[this.keys.KEY_PARAGEJAMBES]) {
            this.jambes = true;
        } else {
            this.jambes = false;
        }
    }

    private updatePoingKeys(): void {
        if (this.inputMap[this.keys.KEY_PARAGEPOING]) {
            this.poing = true;
        } else {
            this.poing = false;
        }
    }

    
}
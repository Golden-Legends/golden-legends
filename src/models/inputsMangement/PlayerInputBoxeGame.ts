import { InputManager } from "./InputManager";

export class PlayerInputBoxeGame extends InputManager {
    readonly keys = {
        KEY_PARAGEPOING: "KeyJ",
        KEY_PARAGEJAMBES: "KeyD",
    };

    public left: boolean = false;
    public right: boolean = false;

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
            this.left = true;
        } else {
            this.left = false;
        }
    }

    private updatePoingKeys(): void {
        if (this.inputMap[this.keys.KEY_PARAGEPOING]) {
            this.right = true;
        } else {
            this.right = false;
        }
    }

    
}
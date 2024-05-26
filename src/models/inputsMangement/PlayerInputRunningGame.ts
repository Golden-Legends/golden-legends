import { InputManager } from "./InputManager";

export class PlayerInputRunningGame extends InputManager {
    readonly keys = {
        KEY_LEFT: "KeyS",
        KEY_RIGHT: "KeyD",
    };

    public left: boolean = false;
    public right: boolean = false;

    constructor(scene) {
        super(scene);
        this.setupBeforeRenderObservable(this.updateFromKeyboard);
    }

    protected updateFromKeyboard = () => {
        this.updateLeftKeys();
        this.updateRigthKeys();
    }
    
    private updateLeftKeys(): void {
        if (this.inputMap[this.keys.KEY_LEFT]) {
            this.left = true;
        } else {
            this.left = false;
        }
    }

    private updateRigthKeys(): void {
        if (this.inputMap[this.keys.KEY_RIGHT]) {
            this.right = true;
        } else {
            this.right = false;
        }
    }

    
}
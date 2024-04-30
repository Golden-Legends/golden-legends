import { InputManager } from "./InputManager";

export class PlayerInputNatationGame extends InputManager {
    readonly keys = {
        KEY_LEFT: "KeyS",
        KEY_RIGHT: "KeyD",
        KEY_SPACE: "Space"
    };

    public left: boolean = false;
    public right: boolean = false;
    public space: boolean = false;

    constructor(scene) {
        super(scene);
        this.setupBeforeRenderObservable(this.updateFromKeyboard);
    }

    protected updateFromKeyboard = () => {
        this.updateLeftKeys();
        this.updateRigthKeys();
        this.updateSpacekeys();
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

    private updateSpacekeys(): void {
        if (this.inputMap[this.keys.KEY_SPACE]) {
            this.space = true;
        } else {
            this.space = false;
        }
    }

    
}
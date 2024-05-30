import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { InputManager } from "./InputManager";

export class PlayerInputTennisGame extends InputManager {
    readonly keys = {
        KEY_LEFT: "ArrowDown",
        KEY_RIGHT: "ArrowUp",
    };

    public left : boolean = false;
    public right : boolean = false;
    public horizontal: number = 0;

    constructor(scene) {
        super(scene);
        this.setupBeforeRenderObservable(this.updateFromKeyboard);
    }

    protected updateFromKeyboard = () => {
        this.updateKeys();
    }
    
    private updateKeys(): void {
        const movementLerpSpeed = 0.2;
        // Left/right movement
        if (this.inputMap[this.keys.KEY_LEFT]) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, movementLerpSpeed);
        } else if (this.inputMap[this.keys.KEY_RIGHT]) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, movementLerpSpeed);
        } else {
            this.horizontal = 0;
        }
    }    
}
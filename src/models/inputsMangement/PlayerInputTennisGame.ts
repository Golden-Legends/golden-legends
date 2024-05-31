import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { InputManager } from "./InputManager";

export class PlayerInputTennisGame extends InputManager {
    readonly keys = {
        KEY_LEFT: "ArrowDown",
        KEY_RIGHT: "ArrowUp",
        KEY_LEFTJ2: "KeyS",
        KEY_RIGHTJ2: "KeyX",
    };

    public left : boolean = false;
    public right : boolean = false;
    public horizontal: number = 0;
    public horizontalJ2: number = 0;
    private inverse : boolean;
    constructor(scene, inverse = false) {
        super(scene);
        this.inverse = inverse;
        this.keys.KEY_LEFT = this.inverse ? "KeyX" : "ArrowDown";
        this.keys.KEY_RIGHT = this.inverse ? "KeyS" : "ArrowUp";
        this.keys.KEY_LEFTJ2 = this.inverse ? "ArrowDown" : "KeyX";
        this.keys.KEY_RIGHTJ2 = this.inverse ? "ArrowUp" : "KeyS";
        this.setupBeforeRenderObservable(this.updateFromKeyboard);
    }

    protected updateFromKeyboard = () => {
        this.updateKeys();
        this.updateKeysJ2();
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
    private updateKeysJ2(): void {
        const movementLerpSpeed = 0.2;
        // Left/right movement
        if (this.inputMap[this.keys.KEY_LEFTJ2]) {
            this.horizontalJ2 = Scalar.Lerp(this.horizontalJ2, -1, movementLerpSpeed);
        } else if (this.inputMap[this.keys.KEY_RIGHTJ2]) {
            this.horizontalJ2 = Scalar.Lerp(this.horizontalJ2, 1, movementLerpSpeed);
        } else {
            this.horizontalJ2 = 0;
        }
    }

    public getHorizontal(): number {
        return this.horizontal;
    }

    public getHorizontalJ2(): number {
        return this.horizontalJ2;
    }
}
import {
    Scene,
    Scalar,
} from "@babylonjs/core";
import { InputManager } from "./InputManager";

export class PlayerInput extends InputManager {
    public horizontal: number = 0;
    public vertical: number = 0;
    public horizontalAxis: number = 0;
    public verticalAxis: number = 0;
    public jumpKeyDown: boolean = false;
    public dashing: boolean = false;

    readonly keys = {
        KEY_UP: "KeyW",
        KEY_DOWN: "KeyS",
        KEY_LEFT: "KeyA",
        KEY_RIGHT: "KeyD",
		KEY_DASH : "KeyP",
		KEY_JUMP : "Space",
    };

	constructor(scene: Scene) {
		super(scene);
		this.setupBeforeRenderObservable(this.updateFromKeyboard);
	}

	protected updateFromKeyboard = (): void => {
        this.updateMovementInput();
        this.updateJumpInput();
        this.updateDashInput();
    };

    private updateMovementInput(): void {
        const movementLerpSpeed = 0.2;
        
        // Forward/backward movement
        if (this.inputMap[this.keys.KEY_UP]) {
            this.verticalAxis = 1;
            this.vertical = Scalar.Lerp(this.vertical, 1, movementLerpSpeed);
        } else if (this.inputMap[this.keys.KEY_DOWN]) {
            this.vertical = Scalar.Lerp(this.vertical, -1, movementLerpSpeed);
            this.verticalAxis = -1;
        } else {
            this.vertical = 0;
            this.verticalAxis = 0;
        }

        // Left/right movement
        if (this.inputMap[this.keys.KEY_LEFT]) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, movementLerpSpeed);
            this.horizontalAxis = -1;
        } else if (this.inputMap[this.keys.KEY_RIGHT]) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, movementLerpSpeed);
            this.horizontalAxis = 1;
        } else {
            this.horizontal = 0;
            this.horizontalAxis = 0;
        }
    }

    private updateJumpInput(): void {
        if (this.inputMap[this.keys.KEY_JUMP]) {
            this.jumpKeyDown = true;
        } else {
            this.jumpKeyDown = false;
        }
    }

    private updateDashInput(): void {
        if (this.inputMap[this.keys.KEY_DASH]) {
            this.dashing = true;
        } else {
            this.dashing = false;
        }
    }
}


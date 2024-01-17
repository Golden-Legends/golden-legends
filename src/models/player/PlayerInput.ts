import {
	Scene,
	ActionManager,
	ExecuteCodeAction,
	Scalar,
} from "@babylonjs/core";

// clavier anglais (qwerty)
// const KEY_UP = "KeyW";
// const KEY_DOWN = "KeyS";
// const KEY_LEFT = "KeyA";
// const KEY_RIGHT = "KeyD";
// const KEY_DASH = "KeyP";
// const KEY_JUMP = "Space";

// clavier français (azerty)
const KEY_UP = "KeyW";
const KEY_DOWN = "KeyS";
const KEY_LEFT = "KeyA";
const KEY_RIGHT = "KeyD";
const KEY_DASH = "KeyP";
const KEY_JUMP = "Space";

export class PlayerInput {
	public inputMap: Record<string, boolean> = {};
	public horizontal: number = 0;
	public vertical: number = 0;
	public horizontalAxis: number = 0;
	public verticalAxis: number = 0;
	public jumpKeyDown: boolean = false;
	public dashing: boolean = false;

	constructor(private scene: Scene) {
		this.setupKeyboardInput();
		this.setupBeforeRenderObservable();
	}

	private setupKeyboardInput(): void {
		this.scene.actionManager = new ActionManager(this.scene);
		this.scene.actionManager.registerAction(
			new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, evt => {
				this.inputMap[evt.sourceEvent.code] = true;
				// console.log(evt.sourceEvent.code); // Affiche le code de la touche enfoncée dans la console
			}),
		);
		this.scene.actionManager.registerAction(
			new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, evt => {
				this.inputMap[evt.sourceEvent.code] = false;
			}),
		);
	}

	private setupBeforeRenderObservable(): void {
		this.scene.onBeforeRenderObservable.add(this.updateFromKeyboard);
	}

	private updateFromKeyboard = (): void => {
		this.updateMovementInput();
		this.updateJumpInput();
		this.updateDashInput();
	};

	private updateMovementInput(): void {
		const movementLerpSpeed = 0.2;

		// Forward/backward movement
		if (this.inputMap[KEY_UP]) {
			this.verticalAxis = 1;
			this.vertical = Scalar.Lerp(this.vertical, 1, movementLerpSpeed);
		} else if (this.inputMap[KEY_DOWN]) {
			this.vertical = Scalar.Lerp(this.vertical, -1, movementLerpSpeed);
			this.verticalAxis = -1;
		} else {
			this.vertical = 0;
			this.verticalAxis = 0;
		}

		// Left/right movement
		if (this.inputMap[KEY_LEFT]) {
			this.horizontal = Scalar.Lerp(this.horizontal, -1, movementLerpSpeed);
			this.horizontalAxis = -1;
		} else if (this.inputMap[KEY_RIGHT]) {
			this.horizontal = Scalar.Lerp(this.horizontal, 1, movementLerpSpeed);
			this.horizontalAxis = 1;
		} else {
			this.horizontal = 0;
			this.horizontalAxis = 0;
		}
	}

	private updateJumpInput(): void {
		if (this.inputMap[KEY_JUMP]) {
			this.jumpKeyDown = true;
		} else {
			this.jumpKeyDown = false;
		}
	}

	private updateDashInput(): void {
		if (this.inputMap[KEY_DASH]) {
			this.dashing = true;
		} else {
			this.dashing = false;
		}
	}
}

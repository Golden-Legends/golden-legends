import { Scene, ActionManager, ExecuteCodeAction } from "@babylonjs/core";

export abstract class InputManager {
    public inputMap: Record<string, boolean> = {};
	public scene: Scene;

    // est une propriété de la classe InputManager et non une methode
    protected abstract updateFromKeyboard;

    constructor(scene: Scene) {
		this.scene = scene;
        this.setupKeyboardInput();
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

    public setupBeforeRenderObservable(updateFromKeyboard: () => void): void {
        this.scene.onBeforeRenderObservable.add(updateFromKeyboard);
    }

}
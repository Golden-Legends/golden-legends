import {Scene, TransformNode, UniversalCamera} from "@babylonjs/core";
import { PlayerInput } from "./inputController";

export default class Player extends TransformNode {
    public camera: UniversalCamera;
    public scene: Scene;
    private _input: PlayerInput;
    private _name: string;

    constructor(scene: Scene, input?: PlayerInput, name: string) {
        super("player", scene);
        this.scene = scene;
        this._name = name;

        //camera
        this.activatePlayerCamera();
        this._input = input;
    }

    //--GAME UPDATES--
    private _beforeRenderUpdate(): void {
        // Update player position
    }

    public activatePlayerCamera(): UniversalCamera {
        this.scene.registerBeforeRender(() => {
            this._beforeRenderUpdate();
        })
        return this.camera;
    }
}
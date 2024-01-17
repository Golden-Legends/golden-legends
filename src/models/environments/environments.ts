import { Scene, Vector3, MeshBuilder } from "@babylonjs/core";

export class Environment {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        var ground = MeshBuilder.CreateBox("ground", {size: 75}, this._scene);
        ground.scaling = new Vector3(1,.02,1);
    }
}
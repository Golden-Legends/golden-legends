import {
	Scene,
	SceneLoader,
	MeshBuilder,
    Vector3,
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

export class Environment {
    private _scene: Scene;

    constructor(scene: Scene) {
		this._scene = scene;
		this.createSkybox(this._scene);
	}

    public async load() {
        var ground = MeshBuilder.CreateBox("ground", {size: 75}, this._scene);
        ground.scaling = new Vector3(1,.02,1);
    }

    //Load all necessary meshes for the environment
	public async _loadAsset() {
		const result = await SceneLoader.ImportMeshAsync(
			null,
			"./models/",
			"MAPJeu.glb",
			this._scene,
		);

		console.log(result);

		let env = result.meshes[0];
		let allMeshes = env.getChildMeshes();

		return {
			env: env, //reference to our entire imported glb (meshes and transform nodes)
			allMeshes: allMeshes, // all of the meshes that are in the environment
		};
	}

    public createSkybox(scene: Scene): void {
		const skyMaterial = new SkyMaterial("skyMaterial", scene);
		skyMaterial.backFaceCulling = false;
		skyMaterial.turbidity = 10;
		skyMaterial.luminance = 1;
		skyMaterial.inclination = 0;
		const skyBox = MeshBuilder.CreateBox("skyBox", { size: 2500.0 }, scene);
		skyBox.material = skyMaterial;
	}
}
import { Color3, Mesh, MeshBuilder, Scene, SceneLoader, StandardMaterial, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

export class TennisGameEnv {
    private _scene: Scene;
	private skyBox : Mesh;

    constructor(scene: Scene) {
		this._scene = scene;
		// this.parentMesh = InstanceManager.initParentPublicMesh(this._scene);
		this.skyBox = this.createSkybox(this._scene);
	}

    public async load() {
		const assets = await this._loadAsset();
		//Loop through all environment meshes that were imported
		assets.allMeshes.forEach(m => {
			// m.receiveShadows = true;
			m.checkCollisions = true;
		});
	}

    public async _loadAsset() {
		const result = await SceneLoader.ImportMeshAsync(
			null,
			"./models/maps/games/",
			"tennis.glb",
			this._scene,
		);

		let env = result.meshes[0];
		let allMeshes = env.getChildMeshes();

		return {
			env: env, //reference to our entire imported glb (meshes and transform nodes)
			allMeshes: allMeshes, // all of the meshes that are in the environment
		};
	}

	public createSkybox(scene: Scene): Mesh {
		const skyMaterial = new SkyMaterial("skyMaterial", scene);
		skyMaterial.backFaceCulling = false;
		skyMaterial.turbidity = 10;
		skyMaterial.luminance = 1;
		skyMaterial.inclination = 0;
		const skyBox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
		skyBox.material = skyMaterial;
		return skyBox;
	}

}
import { AssetContainer, Matrix, Mesh, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
import { InstanceManager } from "./InstManager";

export class boxeGameEnv {
    private _scene: Scene;
	public assets;
	public filename: string[] = ["perso1.glb", "perso2.glb", "perso3.glb", "perso4.glb", "perso5.glb", "perso6.glb", "perso7.glb"];
	public assetContainerTab: AssetContainer[] = [];
	public parentMesh: Mesh;

    constructor(scene: Scene) {
		this._scene = scene;
		this.parentMesh = InstanceManager.initParentPublicMesh(this._scene);
	}

    public async load() {
		const assets = await this._loadAsset();
		//Loop through all environment meshes that were imported
		assets.allMeshes.forEach(m => {
			// m.receiveShadows = true;
			m.checkCollisions = true;
		});
		this.createSkybox(this._scene);
		this.assetContainerTab = await InstanceManager.initInstance(this.filename, this._scene, "./models/characters/");
		this.loadPublic();
	}

	public loadPublic() {
		let compteur = 0;
		let tour = 0;
		let randomNumber1, randomNumber2, randomNumber3;
		do {
			randomNumber1 = Math.floor(Math.random() * 6) + 1;
			randomNumber2 = Math.floor(Math.random() * 6) + 1;
			randomNumber3 = Math.floor(Math.random() * 6) + 1;
		} while (randomNumber1 === randomNumber2 || randomNumber1 === randomNumber3 || randomNumber2 === randomNumber3);

		for(let i=1 ; i<=120 ; i++){
			let pos;
			if(i<10){
				pos = this._scene.getMeshByName("perso1.00" + i);
			}
			else if(i<100){
				pos = this._scene.getMeshByName("perso1.0" + i);
			}
			else if(i<1000){
				pos = this._scene.getMeshByName("perso1." + i);
			}
			if(pos){
				pos.isVisible = false;
				if(i-tour*6 === randomNumber1 || i-tour*6 === randomNumber2 || i-tour*6 === randomNumber3){
					let rotation;
					if(i<=36){
						rotation = new Vector3(0, 80, 0)
					}
					else if(i>=37 && i<=60){
						rotation = new Vector3(0, 0, 0);
					}
					else if(i>=61 && i<=84){
						rotation = new Vector3(0, -160, 0);
					}
					else if(i>=85 && i<=120){
						rotation = new Vector3(0, -80, 0);
					}
					let position = new Vector3(-pos.position.x, pos.position.y, pos.position.z);
					// await this._loadCharacterAssets(this._scene, position, this.filename[i-tour*6], "public" + i, rotation);
					this.loadInstance(i-tour*6, i, position, rotation)
				}
				compteur += 1;	
				if(compteur === 6){
					tour += 1;
					compteur = 0;
					randomNumber1 = randomNumber2 = randomNumber3 = 0;
					do {
						randomNumber1 = Math.floor(Math.random() * 6) + 1;
						randomNumber2 = Math.floor(Math.random() * 6) + 1;
						randomNumber3 = Math.floor(Math.random() * 6) + 1;
					} while (randomNumber1 === randomNumber2 || randomNumber1 === randomNumber3 || randomNumber2 === randomNumber3);
				}
			}
		}

		for(let i=121 ; i<=125 ; i++){
			let rotation = new Vector3(0, -80, 0);
			let pos = this._scene.getMeshByName("perso1." + i);
			if(i === 125){
				rotation = new Vector3(0, -80, 0);
			}
			if(pos){
				let position = new Vector3(-pos.position.x, pos.position.y, pos.position.z);
				// await this._loadCharacterAssets(this._scene, position, this.filename[Math.floor(Math.random() * 6) + 1], "public" + i, rotation);
				this.loadInstance(i-tour*6, i, position, rotation);
				pos.isVisible = false;
			}
		}

	}

	

	private loadInstance(fileNameId: number, i : number, position : Vector3, rotation : Vector3) {
		// position, i, "public" + i, rotation
		const child = InstanceManager.duplicateParentMesh(this.parentMesh, `publicBoxe${i}`);
		const res = InstanceManager.duplicateInstance(this.assetContainerTab[fileNameId], position, rotation, child, 0.018);
		const idle = res.animationGroups.find(ag => ag.name.includes("idle"));
		const applause = res.animationGroups.find(ag => ag.name.includes("applause"));

		let randomNumber = Math.floor(Math.random() * 2) + 1;
		if(randomNumber == 1){
			if(applause){
				idle?.stop();
				applause.play(true);
			}
		} else {
			if(idle){
				idle.stop();
				idle.play(true);
			}
		}
		setTimeout(() => {
			if(randomNumber == 1){
				if(applause){
					idle?.stop();
					applause.stop();
					applause.play(true);
				}
			} else {
				if(idle){
					idle.stop();
					applause?.stop();
					idle.play(true);
				}
			}
		}, randomNumber);
	}

	//Load all necessary meshes for the environment
	public async _loadAsset() {
		const result = await SceneLoader.ImportMeshAsync(
			null,
			"./models/maps/games/",
			"boxe2.glb",
			this._scene,
		);

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
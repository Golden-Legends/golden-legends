import { Scaling } from "@/utils/Scaling";
import { Matrix, Mesh, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

export class runningGameEnv {
    private _scene: Scene;
	public assets;

    constructor(scene: Scene) {
		this._scene = scene;
	}

    public async load() {
		const assets = await this._loadAsset();
		//Loop through all environment meshes that were imported
		assets.allMeshes.forEach(m => {
			// m.receiveShadows = true;
			m.checkCollisions = true;
		});
		this.createSkybox(this._scene);
		this.loadPublic();
	}

	public async loadPublic() {
		for(let i = 1; i <= 6; i++) {
			for(let j = 0; j <= 11; j++) {
				const randomNumber = Math.floor(Math.random() * 5) + 1;
				let fileName = "";
				switch (randomNumber) {
					case 1:
                    fileName = "pnjStrong.glb";
                    break;
					case 2:
						fileName = "pnjMan.glb";
						break;
					case 3:
						fileName = "pnjWoman.glb";
						break;
					case 4:
						fileName = "pnjKid.glb";
						break;
					case 5:
                    	fileName = "pnjGirl.glb";
						break;
					// case 6:
					// 	fileName = "perso6.glb";
					// 	break;
					// case 7:
					// 	fileName = "perso7.glb";
					// 	break;
					// case 8:
					// 	fileName = "perso8.glb";
					// 	break;
					default:
						console.log("Invalid random number.");
						continue; // Skip to the next iteration
				}
				if (j === 0) {
					const pos = this._scene.getMeshByName("perso" + i);
					if (pos) {
						let position = new Vector3(-pos.position.x, pos.position.y, pos.position.z);
						// console.log(position);
						await this._loadCharacterAssets(this._scene, position, fileName, "public" + i + j, new Vector3(0, 80, 0));
					}
				} else {
					let pos;
					if(j === 10 || j === 11) {
						pos = this._scene.getMeshByName("perso" + i + ".0" + j);
					}
					else{
						pos = this._scene.getMeshByName("perso" + i + ".00" + j);
					}
					if (pos) {
						let position = new Vector3(-pos.position.x, pos.position.y, pos.position.z);
						await this._loadCharacterAssets(this._scene, position, fileName, "public" + i + j, new Vector3(0, 80, 0));
					}
				}
			}
		}
	}

	//Load all necessary meshes for the environment
	public async _loadAsset() {
		const result = await SceneLoader.ImportMeshAsync(
			null,
			"./models/maps/games/",
			"Athle.glb",
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


	private async _loadCharacterAssets(scene: Scene, position: Vector3, path: string, name: string, rotation: Vector3){

		async function loadCharacter(){
			//collision mesh
			const outer = MeshBuilder.CreateBox(
				name,
				{ width: 1, depth: 1, height: 15 },
				scene,
			);
			// pour afficher la box qui sert de collision
			outer.isVisible = false;
			outer.isPickable = false;
			outer.checkCollisions = true;
			//move origin of box collider to the bottom of the mesh (to match player mesh)
			outer.bakeTransformIntoVertices(Matrix.Translation(0, 7, 0));
			//for collisions
			outer.ellipsoid = new Vector3(1, 1.5, 1);
			outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

			//--IMPORTING MESH--
			return SceneLoader.ImportMeshAsync(
				null,
				"./models/characters/pnj/",
				path,
				scene,
			).then(result => {
				const root = result.meshes[0];
				//body is our actual player mesh
				const body = root;
				body.parent = outer;
				body.isPickable = false;
				body.getChildMeshes().forEach(m => {
					m.isPickable = false;
				});
				body.scaling = new Scaling(2);
				body.showBoundingBox = true;

                outer.position = position;
                outer.rotation = rotation;

				// enlever l'animation à l'indice 0 de animationsGroups
				result.animationGroups[0].stop();
				const idle = result.animationGroups.find(ag => ag.name === "idle");
				if(idle){
                    idle.loopAnimation = true;
                    idle.play(true);
                }
				//return the mesh and animations
				return {
					mesh: outer as Mesh,
					animationGroups: result.animationGroups,
				};
			});
		}	

		return loadCharacter().then(assets=> {
			this.assets = assets;
		})

	}
}
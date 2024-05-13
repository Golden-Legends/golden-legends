import { Scaling } from "@/utils/Scaling";
import { Matrix, Mesh, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

export class runningGameEnv {
    private _scene: Scene;
	public assets;
	public filename: string[] = ["perso1.glb", "perso2.glb", "perso3.glb", "perso4.glb", "perso5.glb", "perso6.glb", "perso7.glb", "perso8.glb", "perso1.glb"];

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
		this.loadPublicLateral();
		this.removeCircle();
	}

	public async loadPublic() {
		for(let i = 0; i <= 11; i++) {
			//3 pos for each public
			let randomNumber1, randomNumber2, randomNumber3;
			do {
				randomNumber1 = Math.floor(Math.random() * 6) + 1;
				randomNumber2 = Math.floor(Math.random() * 6) + 1;
				randomNumber3 = Math.floor(Math.random() * 6) + 1;
			} while (randomNumber1 === randomNumber2 || randomNumber1 === randomNumber3 || randomNumber2 === randomNumber3);
		
			if(i === 0){
				const pos = this._scene.getMeshByName("perso" + randomNumber1);
				if (pos) {
					let position = new Vector3(-pos.position.x, pos.position.y, pos.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 80, 0));
				}
				const pos2 = this._scene.getMeshByName("perso" + randomNumber2);
				if (pos2) {
					let position = new Vector3(-pos2.position.x, pos2.position.y, pos2.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber1, new Vector3(0, 80, 0));
				}
				const pos3 = this._scene.getMeshByName("perso" + randomNumber3);
				if (pos3) {
					let position = new Vector3(-pos3.position.x, pos3.position.y, pos3.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber1, new Vector3(0, 80, 0));
				}
				const posd = this._scene.getMeshByName("persoO" + randomNumber1);
				if (posd) {
					let position = new Vector3(-posd.position.x, posd.position.y, posd.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 45, 0));
				}
			}
			else{
				let pos1;
				let pos2;
				let pos3;
				let posd;
				if(i === 10 || i ===11){
					pos1 = this._scene.getMeshByName("perso" + randomNumber1 + ".0" + i);
					pos2 = this._scene.getMeshByName("perso" + randomNumber2 + ".0" + i);
					pos3 = this._scene.getMeshByName("perso" + randomNumber3 + ".0" + i);
					posd = this._scene.getMeshByName("persoO" + randomNumber1 + ".0" + i);
				}
				else{
					pos1 = this._scene.getMeshByName("perso" + randomNumber1 + ".00" + i);
					pos2 = this._scene.getMeshByName("perso" + randomNumber2 + ".00" + i);
					pos3 = this._scene.getMeshByName("perso" + randomNumber3 + ".00" + i);
					posd = this._scene.getMeshByName("persoO" + randomNumber1 + ".00" + i);
				}
				if(pos1){
					let position = new Vector3(-pos1.position.x, pos1.position.y, pos1.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 80, 0));
				}
				if(pos2){
					let position = new Vector3(-pos2.position.x, pos2.position.y, pos2.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber2, new Vector3(0, 80, 0));
				}
				if(pos3){
					let position = new Vector3(-pos3.position.x, pos3.position.y, pos3.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber3, new Vector3(0, 80, 0));
				}
				if(posd){
					let position = new Vector3(-posd.position.x, posd.position.y, posd.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 45, 0));
				}
			}

			// if (j === 0) {
			// 	const pos = this._scene.getMeshByName("perso" + i);
			// 	if (pos) {
			// 		let position = new Vector3(-pos.position.x, pos.position.y, pos.position.z);
			// 		// console.log(position);
			// 		await this._loadCharacterAssets(this._scene, position, fileName, "public" + i + j, new Vector3(0, 80, 0));
			// 	}
			// } else {
			// 	let pos;
			// 	if(j === 2 || j === 4 || j === 6 || j === 8 || j === 10){
			// 		if(j === 10) {
			// 			pos = this._scene.getMeshByName("perso" + i + ".0" + j);
			// 		}
			// 		else{
			// 			pos = this._scene.getMeshByName("perso" + i + ".00" + j);
			// 		}
			// 		if (pos) {
			// 			let position = new Vector3(-pos.position.x, pos.position.y, pos.position.z);
			// 			await this._loadCharacterAssets(this._scene, position, fileName, "public" + i + j, new Vector3(0, 80, 0));
			// 		}
			// 	}
				
			// }	
		}
	}

	public async loadPublicLateral() {
		for(let i = 0; i <= 1; i++) {
			//3 pos for each public
			let randomNumber1, randomNumber2, randomNumber3;
			do {
				randomNumber1 = Math.floor(Math.random() * 6) + 1;
				randomNumber2 = Math.floor(Math.random() * 6) + 1;
				randomNumber3 = Math.floor(Math.random() * 6) + 1;
			} while (randomNumber1 === randomNumber2 || randomNumber1 === randomNumber3 || randomNumber2 === randomNumber3);
		
			if(i === 0){
				//gauche
				const pos = this._scene.getMeshByName("persoD" + randomNumber1);
				if (pos) {
					let position = new Vector3(-pos.position.x, pos.position.y, pos.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 160, 0));
				}
				const pos2 = this._scene.getMeshByName("persoD" + randomNumber2);
				if (pos2) {
					let position = new Vector3(-pos2.position.x, pos2.position.y, pos2.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber1, new Vector3(0, 160, 0));
				}
				const pos3 = this._scene.getMeshByName("persoD" + randomNumber3);
				if (pos3) {
					let position = new Vector3(-pos3.position.x, pos3.position.y, pos3.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber1, new Vector3(0, 160, 0));
				}
				//droite
				const posd = this._scene.getMeshByName("persoF" + randomNumber1);
				if (posd) {
					let position = new Vector3(-posd.position.x, posd.position.y, posd.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 0, 0));
				}
				const posd2 = this._scene.getMeshByName("persoF" + randomNumber2);
				if (posd2) {
					let position = new Vector3(-posd2.position.x, posd2.position.y, posd2.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber1, new Vector3(0, 0, 0));
				}
				const posd3 = this._scene.getMeshByName("persoF" + randomNumber3);
				if (posd3) {
					let position = new Vector3(-posd3.position.x, posd3.position.y, posd3.position.z);
					// console.log(position);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber1, new Vector3(0, 0, 0));
				}
			}
			else{
				let pos1 = this._scene.getMeshByName("persoD" + randomNumber1 + ".00" + i);
				let pos2 = this._scene.getMeshByName("persoD" + randomNumber2 + ".00" + i);
				let pos3 = this._scene.getMeshByName("persoD" + randomNumber3 + ".00" + i);
				if(pos1){
					let position = new Vector3(-pos1.position.x, pos1.position.y, pos1.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 160, 0));
				}
				if(pos2){
					let position = new Vector3(-pos2.position.x, pos2.position.y, pos2.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber2, new Vector3(0, 160, 0));
				}
				if(pos3){
					let position = new Vector3(-pos3.position.x, pos3.position.y, pos3.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber3, new Vector3(0, 160, 0));
				}
				let posd1 = this._scene.getMeshByName("persoF" + randomNumber1 + ".00" + i);
				let posd2 = this._scene.getMeshByName("persoF" + randomNumber2 + ".00" + i);
				let posd3 = this._scene.getMeshByName("persoF" + randomNumber3 + ".00" + i);
				if(posd1){
					let position = new Vector3(-posd1.position.x, posd1.position.y, posd1.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 0, 0));
				}
				if(posd2){
					let position = new Vector3(-posd2.position.x, posd2.position.y, posd2.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber2, new Vector3(0, 0, 0));
				}
				if(posd3){
					let position = new Vector3(-posd3.position.x, posd3.position.y, posd3.position.z);
					await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber3, new Vector3(0, 0, 0));
				}
			}
		}
	}

	public removeCircle() {
		for(let i = 1; i <= 6; i++){
			for(let j = 0; j <= 11; j++){
				if(j === 0){
					const circle = this._scene.getMeshByName("perso" + i);
					if(circle){
						circle.isVisible = false;
					}
					const circle2 = this._scene.getMeshByName("persoO" + i);
					if(circle2){
						circle2.isVisible = false;
					}
				}
				else{
					if(j === 10 || j === 11){
						const circle = this._scene.getMeshByName("perso" + i + ".0" + j);
						if(circle){
							circle.isVisible = false;
						}
						const circle2 = this._scene.getMeshByName("persoO" + i + ".0" + j);
						if(circle2){
							circle2.isVisible = false;
						}
					}
					else{
						const circle = this._scene.getMeshByName("perso" + i + ".00" + j);
						if(circle){
							circle.isVisible = false;
						}
						const circle2 = this._scene.getMeshByName("persoO" + i + ".00" + j);
						if(circle2){
							circle2.isVisible = false;
						}
					}
				}
			}
		}
		for(let i = 1; i <= 6; i++){
			for(let j = 0; j <= 1; j++){
				if(j === 0){
					const circle = this._scene.getMeshByName("persoD" + i);
					if(circle){
						circle.isVisible = false;
					}
					const circle2 = this._scene.getMeshByName("persoF" + i);
					if(circle2){
						circle2.isVisible = false;
					}
				}
				else{
					const circle = this._scene.getMeshByName("persoD" + i + ".00" + j);
					if(circle){
						circle.isVisible = false;
					}
					const circle2 = this._scene.getMeshByName("persoF" + i + ".00" + j);
					if(circle2){
						circle2.isVisible = false;
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
				"./models/characters/",
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
				body.scaling = new Scaling(0.09);
				body.showBoundingBox = true;

                outer.position = position;
                outer.rotation = rotation;

				// enlever l'animation à l'indice 0 de animationsGroups
				result.animationGroups[0].stop();

				let randomNumber = Math.floor(Math.random() * 2) + 1;
				if(randomNumber == 1){
					const idle = result.animationGroups.find(ag => ag.name === "Anim|idle");
					if(idle){
						idle.loopAnimation = true;
						idle.play(true);
					}
				}
				else{
					const applause = result.animationGroups.find(ag => ag.name === "Anim|applause");
					if(applause){
						applause.loopAnimation = true;
						applause.play(true);
					}
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
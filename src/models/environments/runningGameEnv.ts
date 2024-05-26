import { AssetContainer, Matrix, Mesh, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
import { InstanceManager } from "./InstManager";

export class runningGameEnv {
    private _scene: Scene;
	public assets;
	public filename: string[] = ["perso1.glb", "perso2.glb", "perso3.glb", "perso4.glb", "perso5.glb", "perso6.glb", "perso7.glb", "perso8.glb", "perso1.glb"];
	public assetContainerTab: AssetContainer[] = [];
	public parentMesh: Mesh;

    constructor(scene: Scene) {
		this._scene = scene;
		this.parentMesh = new Mesh("parentPublic", this._scene);
	}

    public async load() {
		const assets = await this._loadAsset();
		//Loop through all environment meshes that were imported
		assets.allMeshes.forEach(m => {
			// m.receiveShadows = true;
			m.checkCollisions = true;
		});
		this.createSkybox(this._scene);

		const outer = MeshBuilder.CreateBox(
			"masterOuter",
			{ width: 1, depth: 1, height: 15 },
			this._scene,
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
		this.parentMesh = outer;
		
		// charger les assets des personnages
		this.assetContainerTab = await InstanceManager.initInstance(this.filename, this._scene, "./models/characters/");
		this.loadPublic();
		this.loadPublicLateral();
		this.removeCircle();
	}

	public loadPublic() {
		for (let i = 0; i <= 11; i++) {
			// Generate 3 unique random numbers
			let randomNumbers = this.getUniqueRandomNumbers(3, 6);
			let baseNames = randomNumbers.map(num => `perso${num}`);
			let offsets = [80, 80, 80, 45];

			if (i !== 0) {
				baseNames = baseNames.map((name, index) => {
					return i === 10 || i === 11 ? `${name}.0${i}` : `${name}.00${i}`;
				});
				baseNames.push(`persoO${randomNumbers[0]}.${i === 10 || i === 11 ? '0' : '00'}${i}`);
			} else {
				baseNames.push(`persoO${randomNumbers[0]}`);
			}

			for (let j = 0; j < baseNames.length; j++) {
				let mesh = this._scene.getMeshByName(baseNames[j]);
				if (mesh) {
					const pos = new Vector3 (mesh.getAbsolutePosition().x, mesh.getAbsolutePosition().y, mesh.getAbsolutePosition().z);
					const child = InstanceManager.duplicateParentMesh(this.parentMesh, `public${i}${randomNumbers[j % 3]}`);
					const res = InstanceManager.duplicateInstance(this.assetContainerTab[randomNumbers[j % 3]], pos, new Vector3(0, offsets[j % offsets.length], 0), child, 0.09);
					const idle = res.animationGroups.find(ag => ag.name.includes("idle"));
					const applause = res.animationGroups.find(ag => ag.name.includes("applause"));

					let randomNumber = Math.floor(Math.random() * 2) + 1;
					applause?.play(true);

					// Générer un délai aléatoire entre 10 et 20 secondes, puis le multiplier par 1000 pour obtenir des millisecondes
					const delay = (Math.random() * 20 + 100) * 100;
					// Démarrer les animations après le délai
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
					}, delay);
					
				}
			}
		}
	}

	private getUniqueRandomNumbers(count: number, max: number): number[] {
		let nums = new Set<number>();
		while (nums.size < count) {
			nums.add(Math.floor(Math.random() * max) + 1);
		}
		return Array.from(nums);
	}

	private loadInstance(i : number, randomNumber1 : number, position : Vector3) {
		const child = InstanceManager.duplicateParentMesh(this.parentMesh, `public${i}${randomNumber1}`);
		const res = InstanceManager.duplicateInstance(this.assetContainerTab[randomNumber1], position, new Vector3(0, 160, 0), child, 0.09);
		const idle = res.animationGroups.find(ag => ag.name.includes("idle"));
		const applause = res.animationGroups.find(ag => ag.name.includes("applause"));

		let randomNumber = Math.floor(Math.random() * 2) + 1;
		if(randomNumber == 1){
			if(applause){
				idle?.stop();
				applause.play(true);
				console.log("applause")
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

	public loadPublicLateral() {
		for(let i = 0; i <= 1; i++) {
			//3 pos for each public
			let randomNumber1 : number, randomNumber2 : number, randomNumber3 : number;
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
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 160, 0));
					this.loadInstance(i, randomNumber1, position);
				}
				const pos2 = this._scene.getMeshByName("persoD" + randomNumber2);
				if (pos2) {
					let position = new Vector3(-pos2.position.x, pos2.position.y, pos2.position.z);
					// console.log(position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber1, new Vector3(0, 160, 0));
					this.loadInstance(i, randomNumber2, position);
				}
				const pos3 = this._scene.getMeshByName("persoD" + randomNumber3);
				if (pos3) {
					let position = new Vector3(-pos3.position.x, pos3.position.y, pos3.position.z);
					// console.log(position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber1, new Vector3(0, 160, 0));
					this.loadInstance(i, randomNumber3, position);
				}
				//droite
				const posd = this._scene.getMeshByName("persoF" + randomNumber1);
				if (posd) {
					let position = new Vector3(-posd.position.x, posd.position.y, posd.position.z);
					// console.log(position);
					this.loadInstance(i, randomNumber1, position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 0, 0));
				}
				const posd2 = this._scene.getMeshByName("persoF" + randomNumber2);
				if (posd2) {
					let position = new Vector3(-posd2.position.x, posd2.position.y, posd2.position.z);
					// console.log(position);
					this.loadInstance(i, randomNumber2, position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber1, new Vector3(0, 0, 0));
				}
				const posd3 = this._scene.getMeshByName("persoF" + randomNumber3);
				if (posd3) {
					let position = new Vector3(-posd3.position.x, posd3.position.y, posd3.position.z);
					// console.log(position);
					this.loadInstance(i, randomNumber3, position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber1, new Vector3(0, 0, 0));
				}
			}
			else{
				let pos1 = this._scene.getMeshByName("persoD" + randomNumber1 + ".00" + i);
				let pos2 = this._scene.getMeshByName("persoD" + randomNumber2 + ".00" + i);
				let pos3 = this._scene.getMeshByName("persoD" + randomNumber3 + ".00" + i);
				if(pos1){
					let position = new Vector3(-pos1.position.x, pos1.position.y, pos1.position.z);
					this.loadInstance(i, randomNumber1, position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 160, 0));
				}
				if(pos2){
					let position = new Vector3(-pos2.position.x, pos2.position.y, pos2.position.z);
					this.loadInstance(i, randomNumber2, position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber2, new Vector3(0, 160, 0));
				}
				if(pos3){
					let position = new Vector3(-pos3.position.x, pos3.position.y, pos3.position.z);
					this.loadInstance(i, randomNumber3, position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber3, new Vector3(0, 160, 0));
				}
				let posd1 = this._scene.getMeshByName("persoF" + randomNumber1 + ".00" + i);
				let posd2 = this._scene.getMeshByName("persoF" + randomNumber2 + ".00" + i);
				let posd3 = this._scene.getMeshByName("persoF" + randomNumber3 + ".00" + i);
				if(posd1){
					let position = new Vector3(-posd1.position.x, posd1.position.y, posd1.position.z);
					this.loadInstance(i, randomNumber1, position);

					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber1], "public" + i + randomNumber1, new Vector3(0, 0, 0));
				}
				if(posd2){
					let position = new Vector3(-posd2.position.x, posd2.position.y, posd2.position.z);
					this.loadInstance(i, randomNumber2, position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber2], "public" + i + randomNumber2, new Vector3(0, 0, 0));
				}
				if(posd3){
					let position = new Vector3(-posd3.position.x, posd3.position.y, posd3.position.z);
					this.loadInstance(i, randomNumber3, position);
					// await this._loadCharacterAssets(this._scene, position, this.filename[randomNumber3], "public" + i + randomNumber3, new Vector3(0, 0, 0));
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

}
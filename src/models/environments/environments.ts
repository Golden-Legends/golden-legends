import {
	Scene,
	SceneLoader,
	MeshBuilder,
	Vector3,
	ExecuteCodeAction,
	ActionManager,
	Mesh,
	AssetsManager,
	Color3,
	Texture,
} from "@babylonjs/core";
import { SkyMaterial, WaterMaterial } from "@babylonjs/materials";
import { gateInformation } from "../intefaces/EnvironmentsInterfaces";
import { Player } from "../controller/Player";
import { InGameState } from "../scene/InGameState";
import { Pnj } from "./pnj";
import { PnjTalk } from "./pnjTalk";
import { PnjMobile } from "./pnjMobile";
import { SoundManager } from "./sound";
import { Voitures } from "./voitures";
import { StationScore } from "./stationScore";
import { TpGame } from "./tp";

export class Environment {
	private _scene: Scene;
	private player: Player | null;
	private messageDisplayed: boolean = false;
	public currentGate: Mesh | null = null;
	private inGameState: InGameState;
	public pnj!: Pnj;
	public pnjTalk!: PnjTalk;
	public pnjMobile!: PnjMobile;
	public voitures!: Voitures;
	public stationScore!: StationScore;
	public tpGame!: TpGame;
	public waterMaterial!: WaterMaterial;
	private skyBox!: Mesh;

	private gateInformations: gateInformation[] = [
		{
			position: new Vector3(-175, 2.75, -5),
			rotation: 0,
			name: "runningGate",

		}
	];

	constructor(scene: Scene, player : Player | null, inGameState: InGameState) {
		this._scene = scene;
		this.player = player;
		this.inGameState = inGameState;
		this.createRunningGates(scene);
	}

	public async load() {
		// var ground = Mesh.CreateBox("ground", 24, this._scene);
		// ground.scaling = new Vector3(1,.02,1);

		const assets = await this._loadAsset();
		//Loop through all environment meshes that were imported
		assets.allMeshes.forEach(m => {
			// m.receiveShadows = true;
			m.checkCollisions = true;
		});
		// this.createSkybox(this._scene);

		this.disableBuild(1,173);
		this.invisibleBox(1,172);
		this.disableCar(1,63);
		this.invisibleBoxCar(1,21);
		this.loadSky();
		this.pnj = new Pnj(this._scene);
		this.pnj.init();
		this.pnjTalk = new PnjTalk(this._scene, this.player?.mesh as Mesh);
		this.pnjTalk.init();
		this.pnjMobile = new PnjMobile(this._scene);
		this.pnjMobile.init();
		new SoundManager(this._scene);
		this.voitures = new Voitures(this._scene);
		this.voitures.init();
		this.stationScore = new StationScore(this._scene, this.player?.mesh as Mesh);
		this.stationScore.init();		
		this.tpGame = new TpGame(this._scene, this.player?.mesh as Mesh);
		this.tpGame.init();
		this.createSkybox(this._scene);
		this.createWater();
	}

	//Load all necessary meshes for the environment
	public async _loadAsset() {
		const result = await SceneLoader.ImportMeshAsync(
			null,
			"./models/maps/",
			"V3_JO.glb",
			this._scene,
		);

		let env = result.meshes[0];
		let allMeshes = env.getChildMeshes();

		return {
			env: env, //reference to our entire imported glb (meshes and transform nodes)
			allMeshes: allMeshes, // all of the meshes that are in the environment
		};
	}

	public loadSky(){
		var loader = new AssetsManager(this._scene);
		var gltfLoader = loader.addMeshTask("gltf task", "", "", "./models/maps/skyV2.glb");
		gltfLoader.onSuccess = function (task) {
			task.loadedMeshes.forEach(function(mesh) {
				mesh.position = new Vector3(-200, 10, -60);
				mesh.scaling = new Vector3(0.6, 0.6, 0.6);
			});
		};
		loader.load();
	}

	// public createSkybox(scene: Scene): void {
	// 	const skyMaterial = new SkyMaterial("skyMaterial", scene);
	// 	skyMaterial.backFaceCulling = false;
	// 	skyMaterial.turbidity = 10;
	// 	skyMaterial.luminance = 1;
	// 	skyMaterial.inclination = 0;
	// 	const skyBox = MeshBuilder.CreateBox("skyBox", { size: 2500.0 }, scene);
	// 	skyBox.material = skyMaterial;
	// }

	private createRunningGates (scene: Scene) {
		const guiFromInGameState = this.inGameState.getBackground();
		// retrieves gateInformations.length once
		for (let i = 0, n = this.gateInformations.length ;i < n; i++) {
			const gateInformation = this.gateInformations[i];
			const gate = MeshBuilder.CreateBox(gateInformation.name, { height: 10, width: 4, depth: 1 }, scene);
			gate.position = gateInformation.position;
			gate.rotation.y = gateInformation.rotation;
			gate.checkCollisions = true;

			const logPickUpMessage = () => {
				if (guiFromInGameState && !this.messageDisplayed) {
					// ICI 
					this.inGameState.removeHandlePointerLock();
					this.inGameState.openGui(guiFromInGameState);
					this.currentGate = gate;
					this.messageDisplayed = true;
				}
			};

			const removeMessage = () => {
				if (guiFromInGameState) {
					this.messageDisplayed = false;
					this.currentGate = null;
					// REMOVE LE PANEL
					this.inGameState.closeGui(guiFromInGameState)	;
				}
			};

			const enterAction = new ExecuteCodeAction(
				{
					trigger: ActionManager.OnIntersectionEnterTrigger,
					parameter: gate,
				},
				logPickUpMessage,
			);

			const exitAction = new ExecuteCodeAction(
				{
					trigger: ActionManager.OnIntersectionExitTrigger,
					parameter: gate,
				},
				removeMessage, // Ajoutez la fonction pour enlever le message ici
			);

			if (this.player && this.player.mesh.actionManager) { 
				this.player.mesh.actionManager.registerAction(enterAction);
				this.player.mesh.actionManager.registerAction(exitAction);
			}
		}

	}


	public disableBuild(startNumber: number, endNumber: number) {
		for (let i = startNumber; i <= endNumber; i++) {
			if(i in [8, 9, 16, 17, 22, 26, 30, 32, 105]){
				for(let j = 0; j <= 1; j++){
					let mesh = this._scene.getMeshByName("build" + i + "_primitive" + j);
					if(mesh){
						mesh.checkCollisions = false;
						mesh.isPickable = false;
					}	
				}
			}
			else if(i in [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 
					18, 19, 20, 21, 23, 25, 27, 28, 29,
					33, 34, 35, 36, 37, 38, 39, 40, 43, 44]){
				for(let j = 0; j <= 2; j++){
					let mesh = this._scene.getMeshByName("build" + i + "_primitive" + j);
					if(mesh){
						mesh.checkCollisions = false;
						mesh.isPickable = false;
					}	
				}
			}
			else if(i == 24){
				for(let j = 0; j <= 3; j++){
					let mesh = this._scene.getMeshByName("build" + i + "_primitive" + j);
					if(mesh){
						mesh.checkCollisions = false;
						mesh.isPickable = false;
					}	
				}
			}
			else{
				let mesh = this._scene.getMeshByName("build" + i);
				if(mesh){
					mesh.checkCollisions = false;
					mesh.isPickable = false;
				}	
			}
		}
	}


	public disableCar(startNumber: number, endNumber: number) {
		for (let i = startNumber; i <= endNumber; i++) {
			if(i in [9, 18, 27]){
				for(let j = 0; j <= 7; j++){
					let mesh = this._scene.getMeshByName("car" + i + "_primitive" + j);
					if(mesh){
						mesh.checkCollisions = false;
						mesh.isPickable = false;
					}	
				}
			}
			else if(i in [5, 6, 10, 11, 25, 26, 28, 29]){
				for(let j = 0; j <= 8; j++){
					let mesh = this._scene.getMeshByName("car" + i + "_primitive" + j);
					if(mesh){
						mesh.checkCollisions = false;
						mesh.isPickable = false;
					}	
				}
			}
			else if(i>=34 && i<=63){
				for(let j = 0; j <= 10; j++){
					let mesh = this._scene.getMeshByName("car" + i + "_primitive" + j);
					if(mesh){
						mesh.checkCollisions = false;
						mesh.isPickable = false;
					}	
				}
			}
			else{
				let mesh = this._scene.getMeshByName("car" + i);
				if(mesh){
					mesh.checkCollisions = false;
					mesh.isPickable = false;
				}	
			}
		}
	}

	public invisibleBox(startNumber: number, endNumber: number) {
		for (let i = startNumber; i <= endNumber; i++) {
			let mesh = this._scene.getMeshByName("coverB" + i);
			if (mesh) {
				mesh.isVisible = false;
			}
		}
	}

	public invisibleBoxCar(startNumber: number, endNumber: number) {
		for (let i = startNumber; i <= endNumber; i++) {
			let mesh = this._scene.getMeshByName("coverC" + i);
			if (mesh) {
				mesh.isVisible = false;
			}
		}
	}

	public createWater() {
		const waterMesh = this._scene.getMeshByName("Cube.063");
		if (waterMesh) {
			waterMesh.scaling = new Vector3(2000,1,2000);
			waterMesh.position = new Vector3(0, -2, 0);	
			this.waterMaterial = new WaterMaterial("water_material", this._scene);
			this.waterMaterial.bumpTexture = new Texture(
				"./assets/water/water_bump.jpg",
				this._scene,
			);
			this.waterMaterial.windForce = 3;
			this.waterMaterial.waveHeight = 0.8;
			this.waterMaterial.alpha = 0.9;
			this.waterMaterial.waterColor = new Color3(0.1, 0.1, 0.6);
			this.waterMaterial.colorBlendFactor = 0.5;
			this.waterMaterial.addToRenderList(this.skyBox);
			waterMesh.material = this.waterMaterial;
		}
	}

	public createSkybox(scene: Scene): void {
		const skyMaterial = new SkyMaterial("skyMaterial", scene);
		skyMaterial.backFaceCulling = false;
		skyMaterial.turbidity = 10;
		skyMaterial.luminance = 1;
		skyMaterial.inclination = 0;
		this.skyBox = MeshBuilder.CreateBox("skyBox", { size: 2500.0 }, scene);
		this.skyBox.material = skyMaterial;
	}

}
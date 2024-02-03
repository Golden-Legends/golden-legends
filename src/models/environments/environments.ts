import {
	Scene,
	SceneLoader,
	MeshBuilder,
	Vector3,
	ExecuteCodeAction,
	ActionManager,
	Mesh,
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
import { gateInformation } from "../intefaces/EnvironmentsInterfaces";
import { Player } from "../controller/Player";
import { InGameState } from "../scene/InGameState";

export class Environment {
	private _scene: Scene;
	private player: Player | null;
	private messageDisplayed: boolean = false;
	public currentGate: Mesh | null = null;
	private inGameState: InGameState;

	private gateInformations: gateInformation[] = [
		{
			position: new Vector3(0, 0, 20),
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
		this.createSkybox(this._scene);
	}

	//Load all necessary meshes for the environment
	public async _loadAsset() {
		const result = await SceneLoader.ImportMeshAsync(
			null,
			"./models/maps/",
			"V1_JO.glb",
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

	private createRunningGates (scene: Scene) {
		const guiFromInGameState = this.inGameState.getGui();
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
					console.log(this.inGameState);
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
}
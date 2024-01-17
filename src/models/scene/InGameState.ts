import {
	Vector3,
	HemisphericLight,
	MeshBuilder,
	Mesh,
	PointLight,
	Color3,
	ShadowGenerator,
} from "@babylonjs/core";
import { GameState } from "../GameState";
import { PlayerInput } from "../player/PlayerInput";
import { Player } from "../controller/Player";

export class InGameState extends GameState {
	private _player!: Player; // remonter
	private _input: PlayerInput | null = null; // remonter
	private mesh!: Mesh;
	private plane: Mesh | null = null;
	public alreadylocked: boolean = false;
	public assets; // asset du joueur

	async enter() {
		// Logique d'entrée pour InGameState
		// création du sol
		this.addSurface();

		this.mesh = MeshBuilder.CreateBox("cylinder", { size: 4 }, this.scene);
		// création des controlles du joueur
		this._input = new PlayerInput(this.scene);

		this.assets = {
			mesh: this.mesh as Mesh,
			animationGroups: [],
		};

		this.scene.onPointerDown = () => {
			if (!this.alreadylocked) {
				this.canvas.requestPointerLock();
			}
		};

		document.addEventListener("pointerlockchange", () => {
			let element = document.pointerLockElement || null;
			if (element) {
				// lets create a custom attribute
				this.alreadylocked = true;
			} else {
				this.alreadylocked = false;
			}
		});

		this._input = new PlayerInput(this.scene);
		this._initPlayer(this.scene).then(() => {
			this._player.activatePlayerCamera();
		});
	}

	exit() {
		// Nettoyer la scène lors de la sortie de cet état
		this.clearScene();
	}

	update() {
		// Logique de mise à jour pour InGameState
	}

	private async _initPlayer(scene): Promise<void> {
		new HemisphericLight("HemiLight", new Vector3(0, 3, 0), scene);

		const light = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
		light.diffuse = new Color3(
			0.08627450980392157,
			0.10980392156862745,
			0.15294117647058825,
		);
		light.intensity = 35;
		light.radius = 1;

		const shadowGenerator = new ShadowGenerator(1024, light);
		shadowGenerator.darkness = 0.4;

		//Create the player
		this._player = new Player(this.assets, scene, shadowGenerator, this._input);
	}

	private addSurface(): void {
		this.plane = MeshBuilder.CreateGround(
			"ground",
			{ width: 100, height: 100 },
			this.scene,
		);
		this.plane.position = new Vector3(0, 0, 0);
	}
}

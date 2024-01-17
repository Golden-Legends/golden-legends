import {
	Vector3,
	HemisphericLight,
	MeshBuilder,
	Mesh,
	PointLight,
	Color3,
	ShadowGenerator,
	Matrix,
	StandardMaterial,
	Quaternion,
	Color4,
} from "@babylonjs/core";
import { GameState } from "../GameState";
import { PlayerInput } from "../player/PlayerInput";
import { Player } from "../controller/Player";
import { Environment } from "../environments/environments";

export class InGameState extends GameState {
	private _player!: Player; // remonter
	private _input: PlayerInput | null = null; // remonter
	private _environment;
	public alreadylocked: boolean = false;
	public assets; // asset du joueur

	async enter() {
		// Logique d'entrée pour InGameState
		// ENVIRONMENT
		const environment = new Environment(this.scene);
        this._environment = environment;
        await this._environment.load();

		// PLAYER
		await this._loadCharacterAssets(this.scene);

		// création des controlles du joueur
		this._input = new PlayerInput(this.scene);

		this._initPlayer(this.scene).then(() => {
			this._player.activatePlayerCamera();
		});

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
	}

	exit() {
		// Nettoyer la scène lors de la sortie de cet état
		this.clearScene();
	}

	update() {
		// Logique de mise à jour pour InGameState
	}

	private async _loadCharacterAssets(scene){

		async function loadCharacter() {
			//collision mesh
			const outer = MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, scene);
			outer.isVisible = false;
			outer.isPickable = false;
			outer.checkCollisions = true;

			//move origin of box collider to the bottom of the mesh (to match player mesh)
			outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))

			//for collisions
			outer.ellipsoid = new Vector3(1, 1.5, 1);
			outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

			outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player

			const box = MeshBuilder.CreateBox("Small1", { width: 0.5, depth: 0.5, height: 0.25, faceColors: [new Color4(0,0,0,1), new Color4(0,0,0,1), new Color4(0,0,0,1), new Color4(0,0,0,1),new Color4(0,0,0,1), new Color4(0,0,0,1)] }, scene);
			box.position.y = 1.5;
			box.position.z = 1;

			const body = MeshBuilder.CreateCylinder("body", {height:3, diameterTop:2, diameterBottom: 2} , scene);
			const bodymtl = new StandardMaterial("red",scene);
			bodymtl.diffuseColor = new Color3(.8,.5,.5);
			body.material = bodymtl;
			body.isPickable = false;
			body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin

			//parent the meshes
			box.parent = body;
			body.parent = outer;

		   	return {
				mesh: outer as Mesh,
				// animationGroups: []
			}
		}	

		return loadCharacter().then(assets=> {
			this.assets = assets;
		})

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

}

import { Vector3, HemisphericLight, MeshBuilder, Mesh, Matrix, PointLight, Color3, ShadowGenerator } from "@babylonjs/core";
import { GameState } from "../GameState";
import { PlayerInput } from "../player/PlayerInput";
import { Player } from "../controller/Player";
import { Character } from "./models/Character";

export class InGameState extends GameState {
    private mesh !: Mesh;
    private plane : Mesh | null = null;
    private _player : Player | null = null;
    private _input : PlayerInput | null = null;
    public alreadylocked : boolean = false;
    public assets; // asset du joueur

    async enter() {
        // Créer et configurer la scène pour InGameState
        this.createScene();
        this._input = new PlayerInput(this.scene);
        // await this._loadCharacterAssets(this.scene);

        //collision mesh
        const outer = MeshBuilder.CreateBox(
            "outer",
            { width: 3.5, depth: 2.5, height: 10 },
            this.scene,
        );
        outer.position = new Vector3(0,1,0)
        // pour afficher la box qui sert de collision
        outer.isVisible = true;
        outer.isPickable = true;
        outer.checkCollisions = true;
        //move origin of box collider to the bottom of the mesh (to match player mesh)
        outer.bakeTransformIntoVertices(Matrix.Translation(0, 4, 0));
        //for collisions
        outer.ellipsoid = new Vector3(1, 1.5, 1);
        outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

        this.assets = {
            mesh: this.mesh as Mesh,
            animationGroups: [],
        };
        this._input = new PlayerInput(this.scene);
        await this._initializeGameAsync(this.scene);
    }

    exit() {
        // Nettoyer la scène lors de la sortie de cet état
        this.clearScene();
        
    }

    update() {
        // Logique de mise à jour pour InGameState

    }

    private createScene(): void {
        // Ajouter caméra, lumière, et objets à la scène
        // this.addLight();
        this.addCylinder();
        this.addSurface();

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

    private addCylinder(): void {
        this.mesh = MeshBuilder.CreateBox("cylinder", {size: 4}, this.scene);
        this.mesh.position = new Vector3(0, 1, 0);
    }

    private addSurface(): void {
        this.plane = MeshBuilder.CreateGround("ground", {width: 15, height: 15}, this.scene);
        this.plane.position = new Vector3(0, 0, 0);
    }
    private async _initializeGameAsync(scene): Promise<void> {
		// this._engine.displayLoadingUI();
		//temporary light to light the entire scene
		var light0 = new HemisphericLight("HemiLight", new Vector3(0, 3, 0), scene);

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

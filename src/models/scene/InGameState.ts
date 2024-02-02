import {
	Vector3,
	HemisphericLight,
	MeshBuilder,
	Mesh,
	PointLight,
	Color3,
	ShadowGenerator,
	Matrix,
	SceneLoader,
} from "@babylonjs/core";
import { GameState } from "../GameState";
import { PlayerInput } from "../inputsMangement/PlayerInput";
import { Player } from "../controller/Player";
import { Environment } from "../environments/environments";
import { Character } from "../intefaces/Character";
import {Scaling} from "../../utils/Scaling.ts";

export class InGameState extends GameState {
	public assets; // asset du joueur
	private character: Character = {
		fileName: "amy.glb",
		scalingVector3: new Scaling(0.02)
	};

	async enter() {
		// set environments
		await this.setEnvironment();

		await this._loadCharacterAssets(this.scene);

		// création des controlles du joueur
		this._input = new PlayerInput(this.scene);

		this._initPlayer(this.scene).then(async () => {
			if (!!this._player) {
				await this._player.activatePlayerCamera();
			}
		});

		// lancer la boucle de rendu
		this.runRender();
		// si besoin lancer la boucle de mise à jour
		// this.runUpdate();
	}

	exit() {
		// Nettoyer la scène lors de la sortie de cet état
		this.clearScene();
	}

	update() {
		// Logique de mise à jour pour InGameState
		
	}

	private async _loadCharacterAssets(scene){

		async function loadCharacter(characterFileAndScaling: Character){
			//collision mesh
			const outer = MeshBuilder.CreateBox(
				"outer",
				{ width: 3.5, depth: 2.5, height: 15 },
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
				characterFileAndScaling.fileName,
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
				body.scaling = characterFileAndScaling.scalingVector3;
				body.showBoundingBox = true;
				// enlever l'animation à l'indice 0 de animationsGroups
				result.animationGroups[0].stop();
				const idle = result.animationGroups.find(ag => ag.name === "idle");
				idle?.start();
				//return the mesh and animations
				return {
					mesh: outer as Mesh,
					animationGroups: result.animationGroups,
				};
			});
		}	

		return loadCharacter(this.character).then(assets=> {
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

	async setEnvironment(): Promise<void> {
		// ENVIRONMENT
		const environment = new Environment(this.scene);
        this._environment = environment;
        await this._environment.load();
	}

}

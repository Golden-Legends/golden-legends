import {
    Animation,
	AnimationGroup,
	Matrix,
	Mesh,
	MeshBuilder,
	Quaternion,
	Scene, SceneLoader, Vector3,
} from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";

export class Pnj {
	private _scene: Scene;
    public assets;
    // private animations: Animation[] = [];
    private pnjPositions: Vector3[] = [
        new Vector3(-163, 2.75, -10),
        //1er groupe
        new Vector3(-259, 2.75, 60),
        new Vector3(-261, 2.75, 58),
        new Vector3(-257, 2.75, 58),
        //2eme groupe
        new Vector3(-180, 2.75, -10),
        new Vector3(-182, 2.75, -12),
        new Vector3(-178, 2.75, -12),
        //3eme groupe
        new Vector3(-195, 2.75, -30),
        new Vector3(-197, 2.75, -32),
        new Vector3(-193, 2.75, -32),
        new Vector3(-195, 2.75, -34),
        //4eme groupe
        new Vector3(-245, 2.75, -45),
        new Vector3(-245, 2.75, -48),
        //5eme groupe
        new Vector3(-258, 2.75, -162),
        new Vector3(-260, 2.75, -164),
        new Vector3(-256, 2.75, -164),
        //6eme groupe
        new Vector3(-180, 2.75, -135),
        new Vector3(-182, 2.75, -137),
        new Vector3(-178, 2.75, -137),
        new Vector3(-180, 2.75, -139),
        //7eme groupe
        new Vector3(-96, 2.75, -172),
        new Vector3(-89, 2.75, -172),
        new Vector3(-89, 2.75, -166),
        //8eme groupe
        new Vector3(-60, 2.75, -115),
        new Vector3(-62, 2.75, -117),
        new Vector3(-58, 2.75, -117),
        //9eme groupe
        new Vector3(-60, 2.75, -30),
        new Vector3(-62, 2.75, -32),
        new Vector3(-58, 2.75, -32),   
        //10eme groupe
        new Vector3(-34, 2.75, -10),
        new Vector3(-43.5, 2.75, 18),
        new Vector3(-52, 2.75, 58),
        //11eme groupe
        new Vector3(-150, 2.75, 28),
        new Vector3(-152, 2.75, 30),
        new Vector3(-148, 2.75, 30),
        new Vector3(-150, 2.75, 32),
        // Ajoutez d'autres positions pour les autres PNJ ici
    ];

    private pnjRotation: Vector3[] = [
        new Vector3(0, 0, 0),
        //1er groupe
        new Vector3(0, 0, 0),
        new Vector3(0, -90, 0),
        new Vector3(0, 90, 0),
        //2eme groupe
        new Vector3(0, 0, 0),
        new Vector3(0, -90, 0),
        new Vector3(0, 90, 0),
        //3eme groupe
        new Vector3(0, 0, 0),
        new Vector3(0, 80, 0),
        new Vector3(0, -80, 0),
        new Vector3(0, 160, 0),
        //4eme groupe
        new Vector3(0, 0, 0),
        new Vector3(0, 160, 0),
        //5eme groupe
        new Vector3(0, 0, 0),
        new Vector3(0, -90, 0),
        new Vector3(0, 90, 0),
        //6eme groupe
        new Vector3(0, 0, 0),
        new Vector3(0, 80, 0),
        new Vector3(0, -80, 0),
        new Vector3(0, 160, 0),
        //7eme groupe
        new Vector3(0, 160, 0),
        new Vector3(0, 160, 0),
        new Vector3(0, 0, 0),
        //8eme groupe
        new Vector3(0, 0, 0),
        new Vector3(0, -90, 0),
        new Vector3(0, 90, 0),
        //9eme groupe
        new Vector3(0, 0, 0),
        new Vector3(0, -90, 0),
        new Vector3(0, 90, 0),
        //10eme groupe
        new Vector3(0, -80, 0),
        new Vector3(0, -80, 0),
        new Vector3(0, 0, 0),
        //11eme groupe
        new Vector3(0, 160, 0),
        new Vector3(0, 80, 0),
        new Vector3(0, -80, 0),
        new Vector3(0, 0, 0),
        // Ajoutez d'autres rotations pour les autres PNJ ici
    ];


	constructor(scene: Scene) {
		this._scene = scene;
	}

	public async init() {
		console.log("init pnj");
        //load des pnj "sans discussions" à leurs positions
        // await this._loadCharacterAssets(this._scene, new Vector3(-163, 2.75, -10), "pnjStrong.glb");

        for (let i = 0; i < this.pnjPositions.length; i++) {
            const position = this.pnjPositions[i];
            const rotation = this.pnjRotation[i];
            
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
                case 4:
                    fileName = "pnjWoman.glb";
                    break;
                case 5:
                    fileName = "pnjStrong.glb";
                    break;
                default:
                    console.log("Invalid random number.");
                    continue; // Skip to the next iteration
            }
        
            await this._loadCharacterAssets(this._scene, position, fileName, "pnj" + i, rotation);
        }
       
       
        //animation des pnj "sans discussions" avec un certain "chemin" à suivre
        //certains assis, d'autres debout, d'autres marchant,...

        // this.createAnimation(this.assets.mesh);
        // for (let i = 0; i < 10; i++) {
        //     await this.moveCharacter();
        // }

	}


    // public loadPnj(position: Vector3, path: string){
    //     console.log("load pnj");
    // }

    public async moveCharacter() {
        const characterMesh = this._scene.getMeshByName("pnj1") as Mesh; // Supposons que le personnage principal est nommé "outer"

        // Démarrez l'animation de marche
        const walk = this.assets.animationGroups.find(ag => ag.name === "walk");
        if(walk){
            walk.loopAnimation = true;
            walk.play(true);
        }
        // Déplacement vers l'avant
        await this.moveLinear(new Vector3(0, 0, -5), 150, walk);


        // Démarrez l'animation idle
        const idle = this.assets.animationGroups.find(ag => ag.name === "idle");
        if(idle){
            idle.loopAnimation = true;
            idle.play(true);
        }
        // Attente pendant 5 secondes
        await this.wait(5000);


        //rotation
        const rotationQuaternion = Quaternion.RotationAxis(Vector3.Up(), Math.PI / 6); // 30 degrés en radians
        characterMesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(rotationQuaternion.toEulerAngles().y, 0, 0);
        await this.wait(1000);
        
    }

    private async moveLinear(distance: Vector3, frames: number, anim: AnimationGroup) {
        const characterMesh = this._scene.getMeshByName("pnj1") as Mesh; // Supposons que le personnage principal est nommé "outer"

        const startPosition = characterMesh.position.clone();
        const endPosition = startPosition.add(distance);

        const animation = new Animation("moveAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const keys: { frame: number, value: Vector3 }[] = [];
        keys.push({ frame: 0, value: startPosition });
        keys.push({ frame: frames, value: endPosition });
        animation.setKeys(keys);

        characterMesh.animations.push(animation);
        this._scene.beginAnimation(characterMesh, 0, frames, false);

        
        // Attendez la fin de l'animation
        await this.wait(frames * 33.333); // 33.333 ms par frame à 30 FPS
        anim.stop();
    }

    private async wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
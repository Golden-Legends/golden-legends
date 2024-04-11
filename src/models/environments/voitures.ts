import {
	Matrix,
	Mesh,
	MeshBuilder,
	Scene, SceneLoader, Vector3,
} from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";

export class Voitures {
	private _scene: Scene;
    public assets;
    private _cars: Mesh[] = [];
    private _cars2: Mesh[] = [];
    private _carSpeed: number = 0.1;
    private _destroyPosition: number = -180;
    private _destroyPosition2: number = 62;
    private _spawnIntervalId: NodeJS.Timeout | undefined;
    private _spawnIntervalId2: NodeJS.Timeout | undefined;

	constructor(scene: Scene) {
		this._scene = scene;
	}

	public async init() {
        //1er spawner de voitures
        this._startSpawning();

        //2ème spawner de voitures
        this._startSpawning2();

        // Spawner de voitures à une position donnée
        // this.spawnCar(new Vector3(-115.25, 3.1, 62), new Vector3(0, 0, 0), "voitures.glb");
        
        // await this._loadCharacterAssets(this._scene, new Vector3(-115.25, 3.1, 62), "voitures.glb", "voitures", new Vector3(0, 0, 0));
	}

    private _startSpawning2() {
        this._spawnIntervalId2 = setInterval(() => {
            const position2 = new Vector3(-110.75, 3.1, -180);
            const rotation = new Vector3(0, Math.PI, 0); // Rotation par défaut
            const randomNumber = Math.floor(Math.random() * 4) + 1;
            let path ="";
            switch (randomNumber) {
                case 1:
                    path = "voitures.glb";
                    break;
                case 2:
                    path = "voitures2.glb";
                    break;
                case 3:
                    path = "voitures3.glb";
                    break;
                case 4:
                    path = "voitures4.glb";
                    break;
                default:
                    console.log("Nombre aléatoire hors de la plage spécifiée");
                    break;
            }
            this.spawnCar2(position2, rotation, path);
        }, 10000); // Appel toutes les 10 secondes pour le deuxième spawner
    }

    private async spawnCar2(position: Vector3, rotation: Vector3, path: string) {
        const carAssets = await this._loadCharacterAssets(this._scene, position, path, "voitures", rotation);
        const car = carAssets.mesh;
        this._cars2.push(car);
        this.moveCar2(car);
    }

    private moveCar2(car: Mesh) {
        this._scene.onBeforeRenderObservable.add(() => {
            car.position.z += this._carSpeed; // Fait avancer la voiture tout droit

            // Vérifie si la voiture a atteint la position de destruction
            if (car.position.z > this._destroyPosition2) {
                this.destroyCar2(car);
            }
        });
    }

    private destroyCar2(car: Mesh) {
        // Supprime la voiture de la scène et du tableau des voitures
        const index = this._cars2.indexOf(car);
        if (index !== -1) {
            this._cars2.splice(index, 1);
            car.dispose();
        }
    }

    private _stopSpawning2() {
        if (this._spawnIntervalId2 !== undefined) {
            clearInterval(this._spawnIntervalId2);
        }
    }

    private _startSpawning() {
        this._spawnIntervalId = setInterval(() => {
            const position = new Vector3(-115, 3.1, 62);
            const rotation = new Vector3(0, 0, 0); // Rotation par défaut
            const randomNumber = Math.floor(Math.random() * 4) + 1;
            let path ="";
            switch (randomNumber) {
                case 1:
                    path = "voitures.glb";
                    break;
                case 2:
                    path = "voitures2.glb";
                    break;
                case 3:
                    path = "voitures3.glb";
                    break;
                case 4:
                    path = "voitures4.glb";
                    break;
                default:
                    console.log("Nombre aléatoire hors de la plage spécifiée");
                    break;
            }
            this.spawnCar(position, rotation, path);
        }, 10000); // Appel toutes les 3 secondes
    }

    private _stopSpawning() {
        if (this._spawnIntervalId !== undefined) {
            clearInterval(this._spawnIntervalId);
        }
    }

    private async spawnCar(position: Vector3, rotation: Vector3, path: string) {
        const carAssets = await this._loadCharacterAssets(this._scene, position, path, "voitures", rotation);
        const car = carAssets.mesh;
        this._cars.push(car);
        this.moveCar(car);
    }

    private moveCar(car: Mesh) {
        this._scene.onBeforeRenderObservable.add(() => {
            car.position.z -= this._carSpeed; // Fait avancer la voiture tout droit

            // Vérifie si la voiture a atteint la position de destruction
            if (car.position.z < this._destroyPosition) {
                this.destroyCar(car);
            }
        });
    }  

    private destroyCar(car: Mesh) {
        // Supprime la voiture de la scène et du tableau des voitures
        const index = this._cars.indexOf(car);
        if (index !== -1) {
            this._cars.splice(index, 1);
            car.dispose();
        }
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
				"./models/voitures/",
				path,
				scene,
			).then(result => {
				const root = result.meshes[0];
				//body is our actual player mesh
				const body = root;
				body.parent = outer;
				body.isPickable = false;
                body.checkCollisions = false;
				body.getChildMeshes().forEach(m => {
					m.isPickable = false;
                    m.checkCollisions = false;
				});
				body.scaling = new Scaling(1);
				body.showBoundingBox = true;

                outer.position = position;
                outer.rotation = rotation;

				return {
					mesh: outer as Mesh,
				};
			});
		}	

		return loadCharacter().then(assets=> {
            // console.log(assets);
			this.assets = assets;
            return assets;
		})

	}
}
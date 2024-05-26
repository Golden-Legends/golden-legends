import {
    AssetContainer,
	InstancedMesh,
	Matrix,
	Mesh,
	MeshBuilder,
	Scene, SceneLoader, Vector3,
} from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";
import { CharacterAssets } from "./pnjMobile";

export class Voitures {
	private _scene: Scene;
    public assets;
    private _cars: InstancedMesh[] = [];
    private _cars2: InstancedMesh[] = [];
    private _carSpeed: number = 0.1;
    private _destroyPosition: number = -180;
    private _destroyPosition2: number = 62;
    private _spawnIntervalId: number | undefined;
    private _spawnIntervalId2: number | undefined;

	constructor(scene: Scene) {
		this._scene = scene;
	}

    private _startSpawning2(assetContainers : AssetContainer[], parentMesh : Mesh) {
        this._spawnIntervalId2 = setInterval(() => {
            if(!this._scene.isDisposed) {
                const position = new Vector3(-110.75, 3.1, -180);
                const rotation = new Vector3(0, Math.PI, 0); // Rotation par défaut
                const randomNumber = Math.floor(Math.random() * 4);
                // création d'un parent pour la voiture
                const parent = parentMesh.createInstance("voitures");
                parent.checkCollisions = true;
                parent.isVisible = false;
                const carAssert = this.duplicateCar(assetContainers[randomNumber], position, rotation, parent);
                const car = carAssert.mesh;
                this._cars2.push(car);
                this.moveCar2(car);
            }
        }, 10000); // Appel toutes les 10 secondes pour le deuxième spawner
    }

    private _startSpawning(assetContainers : AssetContainer[], parentMesh : Mesh) {
        this._spawnIntervalId = setInterval(() => {
            if(!this._scene.isDisposed) {
                const position = new Vector3(-115, 3.1, 62);
                const rotation = new Vector3(0, 0, 0); // Rotation par défaut
                const randomNumber = Math.floor(Math.random() * 4);
                // création d'un parent pour la voiture
                const parent = parentMesh.createInstance("voitures");
                parent.checkCollisions = true;
                parent.isVisible = false;
                // this.spawnCar(position, rotation, parent);
                const carAssert = this.duplicateCar(assetContainers[randomNumber], position, rotation, parent);
                const car = carAssert.mesh;
                this._cars.push(car);
                this.moveCar(car);
            }
        }, 10000); // Appel toutes les 3 secondes
    }

    private moveCar2(car: InstancedMesh) {
        this._scene.onBeforeRenderObservable.add(() => {
            car.position.z += this._carSpeed; // Fait avancer la voiture tout droit

            // Vérifie si la voiture a atteint la position de destruction
            if (car.position.z > this._destroyPosition2) {
                this.destroyCar2(car);
            }
        });
    }

    private destroyCar2(car: InstancedMesh) {
        // Supprime la voiture de la scène et du tableau des voitures
        const index = this._cars2.indexOf(car);
        if (index !== -1) {
            this._cars2.splice(index, 1);
            car.dispose();
        }
    }

    private moveCar(car: InstancedMesh) {
        this._scene.onBeforeRenderObservable.add(() => {
            car.position.z -= this._carSpeed; // Fait avancer la voiture tout droit

            // Vérifie si la voiture a atteint la position de destruction
            if (car.position.z < this._destroyPosition) {
                this.destroyCar(car);
            }
        });
    }  

    private destroyCar(car: InstancedMesh) {
        // Supprime la voiture de la scène et du tableau des voitures
        const index = this._cars.indexOf(car);
        if (index !== -1) {
            this._cars.splice(index, 1);
            car.dispose();
        }
    }

    public createCar (assetContainers : AssetContainer[], parentMesh : Mesh) { 
        //1er spawner de voitures
        this._startSpawning(assetContainers, parentMesh);

        //2ème spawner de voitures
        this._startSpawning2(assetContainers, parentMesh);
    }

    private duplicateCar(container: AssetContainer, position: Vector3, rotation: Vector3, parent : InstancedMesh): CharacterAssets {
        let entries = container.instantiateModelsToScene();
        const root = entries.rootNodes[0] as Mesh;
        const body = root;

        body.parent = parent;
        body.isPickable = false;
        body.getChildMeshes().forEach(m => {
            m.isPickable = false;
        });
        body.scaling = new Scaling(1);
    
        // Set the position and rotation of the ellipsoid
        parent.position = position;
        parent.rotation = rotation;

        root.position = Vector3.Zero();

        return {
            mesh: parent,
            animationGroups: entries.animationGroups,
        }
    }

}
import {
    Animation,
	AnimationGroup,
	AssetContainer,
	InstancedMesh,
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
    
    private duplicatePnjIdle(container: AssetContainer, position: Vector3, rotation: Vector3, parent : InstancedMesh): void {
        let entries = container.instantiateModelsToScene();
        const root = entries.rootNodes[0] as Mesh;
        const body = root;

        body.parent = parent;
        body.isPickable = false;
        body.getChildMeshes().forEach(m => {
            m.isPickable = false;
        });
        body.scaling = new Scaling(2);
    
        // Set the position and rotation of the ellipsoid
        parent.position = position;
        parent.rotation = rotation;

        root.position = Vector3.Zero();
    
        entries.animationGroups[0].stop();
        // Play the idle animation if available
        const idle = entries.animationGroups.find(ag => ag.name.includes("idle"));
        idle?.play(true);
    }
    
    // Initialize character with instances
    public async initInstance(tabOfName : string[]) {
        const assetContainerTabPromise: Promise<AssetContainer>[] = [];
            // Load the asset containers
        for (let i = 0; i < tabOfName.length; i++) {
            assetContainerTabPromise.push(SceneLoader.LoadAssetContainerAsync("./models/characters/pnj/",
                tabOfName[i],
                this._scene
            ));
        }    
        const assetContainers = await Promise.all(assetContainerTabPromise);

        // init nos personnages de base
        for (let i = 0; i < assetContainers.length; i++) {
            this.initAssetsContainerWithDefaultValues(assetContainers[i])
        }
    
        return assetContainers;        
    }

    public initParentMesh () : Mesh {
        // Create the collision ellipsoid
        const outer = MeshBuilder.CreateBox(
            "masterPnj",
            { width: 1, depth: 1, height: 4 },
            this._scene,
        );
        outer.isVisible = false;
        outer.isPickable = false;
        outer.checkCollisions = true;
        //move origin of box collider to the bottom of the mesh (to match player mesh)
        outer.bakeTransformIntoVertices(Matrix.Translation(0, 2, 0));
        //for collisions
        outer.ellipsoid = new Vector3(1, 1.5, 1);
        outer.ellipsoidOffset = new Vector3(0, 1.5, 0);
        return outer;
    }

    public initAssetsContainerWithDefaultValues (assetContainer : AssetContainer) { 
        assetContainer.meshes[0].position = new Vector3(-183, 6, -95);
        assetContainer.meshes[0].scaling = new Vector3(2, 2, 2);
        assetContainer.meshes[0].getChildMeshes().forEach((m) => {
            m.isPickable = false;
        });
        assetContainer.meshes[0].isPickable = false;
        assetContainer.meshes[0].isVisible = false;
        assetContainer.meshes[0].setParent(null);
    }

    public createPnjIdle (assetContainers : AssetContainer[], parentMesh : Mesh) { 
        // pnj Talk
        for (let i = 0; i < this.pnjPositions.length; i++) {
            const position = this.pnjPositions[i];
            const rotation = this.pnjRotation[i];
            const parent = parentMesh.createInstance("pnj" + i);
            parent.checkCollisions = true;
            parent.isVisible = false;
            const randomNumber = Math.floor(Math.random() * 5);
            this.duplicatePnjIdle(assetContainers[randomNumber], position, rotation, parent);
        }
    }
    
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

}
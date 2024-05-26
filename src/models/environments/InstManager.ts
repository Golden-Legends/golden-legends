import { Scaling } from "@/utils/Scaling";
import { Scene, AssetContainer, SceneLoader, Vector3, InstancedMesh, Mesh, MeshBuilder, Matrix } from "@babylonjs/core";
import { CharacterAssets } from "./pnjMobile";

export class InstanceManager {
    // Initialize character with instances
    public static async initInstance(tabOfName : string[], scene : Scene, folderUrl : string) {
        const assetContainerTabPromise: Promise<AssetContainer>[] = [];
            // Load the asset containers
        for (let i = 0; i < tabOfName.length; i++) {
            assetContainerTabPromise.push(SceneLoader.LoadAssetContainerAsync(folderUrl,
                tabOfName[i],
                scene
            ));
        }    
        const assetContainers = await Promise.all(assetContainerTabPromise);

        // init nos personnages de base
        for (let i = 0; i < assetContainers.length; i++) {
            this.initAssetsContainerWithDefaultValues(assetContainers[i])
        }
    
        return assetContainers;        
    }

    public static initAssetsContainerWithDefaultValues (assetContainer : AssetContainer) { 
        assetContainer.meshes[0].position = new Vector3(-183, 6, -95);
        assetContainer.meshes[0].scaling = new Vector3(2, 2, 2);
        assetContainer.meshes[0].getChildMeshes().forEach((m) => {
            m.isPickable = false;
        });
        assetContainer.meshes[0].isPickable = false;
        assetContainer.meshes[0].isVisible = false;
        assetContainer.meshes[0].setParent(null);
    }

    public static duplicateInstance(container: AssetContainer, position: Vector3, rotation: Vector3, parent : InstancedMesh, scalingValue : number): CharacterAssets {
        let entries = container.instantiateModelsToScene();
        const root = entries.rootNodes[0] as Mesh;
        const body = root;

        body.parent = parent;
        body.isPickable = false;
        body.getChildMeshes().forEach(m => {
            m.isPickable = false;
        });
        body.scaling = new Scaling(scalingValue);
    
        // Set the position and rotation of the ellipsoid
        parent.position = position;
        parent.rotation = rotation;

        root.position = Vector3.Zero();
    
        entries.animationGroups[0].stop();

        return {
            mesh: parent,
            animationGroups: entries.animationGroups,
        }
    }
    
    public static initParentMesh (scene : Scene, name : string) : Mesh {
        // Create the collision ellipsoid
        const outer = MeshBuilder.CreateBox(
            name,
            { width: 1, depth: 1, height: 4 },
            scene,
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
    
    public static duplicateParentMesh (parentMesh : Mesh, nameNewInstance : string) : InstancedMesh { 
        const newMesh = parentMesh.createInstance(nameNewInstance);
        newMesh.checkCollisions = true;
        newMesh.isVisible = false;
        return newMesh
    }
}
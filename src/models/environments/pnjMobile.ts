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
import { Scaling } from "@/utils/Scaling";

interface CharacterAssets {
  mesh: Mesh;
  animationGroups: AnimationGroup[];
}

export class PnjMobile {
  private _scene: Scene;
  private assets: CharacterAssets[] = [];
  private pnjPositions: Vector3[] = [
    //straight
    new Vector3(-166, 2.75, -5),
    new Vector3(-68.6, 2.75, 46.5),
    new Vector3(-90, 2.75, -24.5),
    new Vector3(-138.5, 2.75, -41.4),
    new Vector3(-229.9, 2.75, -46.9),
    new Vector3(-252.8, 2.75, -72.4),
    new Vector3(-199.4, 2.75, -116),
    new Vector3(-64.6, 2.75, -105.7),

    //cross
    new Vector3(-201.6, 2.75, -21.7),
    new Vector3(-229.6, 2.75, 31.9),
    new Vector3(-181.7, 2.75, 55.6),
    new Vector3(-108.8, 2.75, -20.4),
    new Vector3(-107.7, 2.75, -158.3),
    new Vector3(-181.4, 2.75, -144.3),
    new Vector3(-250.5, 2.8, -162.8),
    new Vector3(-241.5, 2.8, -72),
  ];

  private pnjRotation: Vector3[] = [
    //straight
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),

    //cross
    new Vector3(0, -77, 0),
    new Vector3(0, -77, 0),
    new Vector3(0, -77, 0),
    new Vector3(0, -77, 0),
    new Vector3(0, -77, 0),
    new Vector3(0, -77, 0),
    new Vector3(0, -77, 0),
    new Vector3(0, -77, 0),
  ];

  private pnjDirection: Vector3[] = [
    //straight
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 10),

    //cross
    new Vector3(-10, 0, 0),
    new Vector3(-10, 0, 0),
    new Vector3(-10, 0, 0),
    new Vector3(-10, 0, 0),
    new Vector3(-10, 0, 0),
    new Vector3(-10, 0, 0),
    new Vector3(-10, 0, 0),
    new Vector3(-10, 0, 0),
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
    
        // Play the idle animation if available
        const idle = entries.animationGroups.find(ag => ag.name.includes("idle"));
        idle?.play(true);
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

  public async init() {
    const characters = [];
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
          fileName = "pnjWoman.glb";
          break;
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
      await this._loadCharacterAssets(
        this._scene,
        position,
        fileName,
        "pnjMobile" + i,
        rotation,
      );
    }

    await Promise.all(characters);

    while (true) {
      const movePromises: Promise<void>[] = [];
      for (let i = 0; i < this.pnjPositions.length; i++) {
        const direction = this.pnjDirection[i];
        const movePromise = this.moveCharacter(i, direction);
        movePromises.push(movePromise);
      }
      await Promise.all(movePromises);
    }
  }

  public async moveCharacter(num: number, direction: Vector3) {
    const characterMesh = this._scene.getMeshByName("pnjMobile" + num) as Mesh; // Supposons que le personnage principal est nommé "outer"

    // Démarrez l'animation de marche
    const walk = this.assets[num].animationGroups.find(
      (ag) => ag.name === "walk",
    );
    if (walk) {
      walk.loopAnimation = true;
      walk.play(true);
    }
    // Déplacement vers l'avant
    const inv = new Vector3(-direction.x, -direction.y, -direction.z);
    await this.moveLinear(inv, 150, walk!, num);

    // Démarrez l'animation idle
    const idle = this.assets[num].animationGroups.find(
      (ag) => ag.name === "idle",
    );
    if (idle) {
      idle.loopAnimation = true;
      idle.play(true);
    }
    // Attente pendant 5 secondes
    await this.wait(1500);

    for (let i = 0; i < 3; i++) {
      const randomDirection = Math.floor(Math.random() * 3); // Générer un nombre aléatoire entre 0 et 2
      if (direction.z === 10) {
        await this.lookDirection(characterMesh, randomDirection); // Appel d'une fonction pour regarder dans une direction aléatoire
      } else if (direction.x === -10) {
        await this.lookDirectionBis(characterMesh, randomDirection);
      }
    }
    if (direction.z === 10) {
      await this.lookDirection(characterMesh, 3); // Appel d'une fonction pour regarder dans une direction aléatoire
    } else if (direction.x === -10) {
      await this.lookDirectionBis(characterMesh, 3);
    }

    // Démarrez l'animation de marche
    if (walk) {
      walk.loopAnimation = true;
      walk.play(true);
    }
    // Déplacement vers l'avant
    await this.moveLinear(direction, 150, walk!, num);

    // Démarrez l'animation idle
    if (idle) {
      idle.loopAnimation = true;
      idle.play(true);
    }
    // Attente pendant 5 secondes
    await this.wait(1500);

    for (let i = 0; i < 3; i++) {
      const randomDirection = Math.floor(Math.random() * 3); // Générer un nombre aléatoire entre 0 et 2
      if (direction.z === 10) {
        await this.lookDirection(characterMesh, randomDirection); // Appel d'une fonction pour regarder dans une direction aléatoire
      } else if (direction.x === -10) {
        await this.lookDirectionBis(characterMesh, randomDirection);
      } // Appel d'une fonction pour regarder dans une direction aléatoire
    }
    if (direction.z === 10) {
      await this.lookDirection(characterMesh, 2); // Appel d'une fonction pour regarder dans une direction aléatoire
    } else if (direction.x === -10) {
      await this.lookDirectionBis(characterMesh, 2);
    }
  }

  private async moveLinear(
    distance: Vector3,
    frames: number,
    anim: AnimationGroup,
    num: number,
  ) {
    const characterMesh = this._scene.getMeshByName("pnjMobile" + num) as Mesh; // Supposons que le personnage principal est nommé "outer"
    const fps = 30;

    const startPosition = characterMesh.position.clone();
    const endPosition = startPosition.add(distance);

    const animation = new Animation(
      "moveAnimation",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
    const keys: { frame: number; value: Vector3 }[] = [];
    keys.push({ frame: 0, value: startPosition });
    keys.push({ frame: frames, value: endPosition });
    animation.setKeys(keys);

    characterMesh.animations.push(animation);
    this._scene.beginAnimation(characterMesh, 0, frames, false);

    // Attendez la fin de l'animation
    await this.wait((frames * 1000) / fps); // 33.333 ms par frame à 30 FPS
    anim.stop();
  }

  private async wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async lookDirection(mesh: Mesh, direction: number) {
    let rotationAngle = 0;
    switch (direction) {
      case 0: // Regarder à droite
        rotationAngle = Math.PI / 2; // 90 degrés en radians
        break;
      case 1: // Regarder à gauche
        rotationAngle = (3 * Math.PI) / 2; // -90 degrés en radians
        break;
      case 2: // Regarder devant
        rotationAngle = 0; // Aucune rotation nécessaire
        break;
      case 3: // Regarder derrière
        rotationAngle = Math.PI; // 180 degrés en radians
        break;
      default:
        console.log("Invalid direction");
        return;
    }

    const rotationQuaternion = Quaternion.RotationAxis(
      Vector3.Up(),
      rotationAngle,
    );
    mesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(
      rotationQuaternion.toEulerAngles().y,
      0,
      0,
    );

    // Attente pour donner le temps de voir la direction
    await this.wait(1500);
  }

  private async lookDirectionBis(mesh: Mesh, direction: number) {
    let rotationAngle = 0;
    switch (direction) {
      case 0: // Regarder à droite
        rotationAngle = 0; // Aucune rotation nécessaire
        break;
      case 1: // Regarder à gauche
        rotationAngle = Math.PI; // 180 degrés en radians
        break;
      case 2: // Regarder devant
        rotationAngle = (3 * Math.PI) / 2; // -90 degrés en radians
        break;
      case 3: // Regarder derrière
        rotationAngle = Math.PI / 2; // 90 degrés en radians
        break;
      default:
        console.log("Invalid direction");
        return;
    }

    const rotationQuaternion = Quaternion.RotationAxis(
      Vector3.Up(),
      rotationAngle,
    );
    mesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(
      rotationQuaternion.toEulerAngles().y,
      0,
      0,
    );

    // Attente pour donner le temps de voir la direction
    await this.wait(1500);
  }

  private async _loadCharacterAssets(
    scene: Scene,
    position: Vector3,
    path: string,
    name: string,
    rotation: Vector3,
  ) {
    async function loadCharacter() {
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
      ).then((result) => {
        const root = result.meshes[0];
        //body is our actual player mesh
        const body = root;
        body.parent = outer;
        body.isPickable = false;
        body.getChildMeshes().forEach((m) => {
          m.isPickable = false;
        });
        body.scaling = new Scaling(2);
        body.showBoundingBox = true;

        outer.position = position;
        outer.rotation = rotation;

        // enlever l'animation à l'indice 0 de animationsGroups
        result.animationGroups[0].stop();
        const idle = result.animationGroups.find((ag) => ag.name === "idle");
        if (idle) {
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

    return loadCharacter().then((assets) => {
      this.assets.push(assets);
    });
  }
}

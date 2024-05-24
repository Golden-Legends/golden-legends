import {
  ActionManager,
  AssetContainer,
  ExecuteCodeAction,
  InstancedMesh,
  Matrix,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { Scaling } from "../../utils/Scaling";

export class PnjTalk {
  private _scene: Scene;
  public assets;
  // private animations: Animation[] = [];
  private pnjPositions: Vector3[] = [
    //1er groupe
    new Vector3(-195, 2.75, -80),
    //2eme groupe
    new Vector3(-165, 2.75, -127),
    // //3eme groupe
    new Vector3(-70, 2.75, -130),
    //4eme groupe
    new Vector3(-61, 2.75, -63),
    //5eme groupe
    new Vector3(-188.5, 2.75, -15.5),
  ];

  private pnjRotation: Vector3[] = [
    //1er groupe
    new Vector3(0, -60, 0),
    //2eme groupe
    new Vector3(0, 0, 0),
    //3eme groupe
    new Vector3(0, 160, 0),
    //4eme groupe
    new Vector3(0, -80, 0),
    //5eme groupe
    new Vector3(0, 80, 0),
  ];
  private cube: Mesh[] = [];
  private player: Mesh;

  constructor(scene: Scene, player: Mesh) {
    this._scene = scene;
    this.player = player;
  }

  private duplicatePnjTalk(container: AssetContainer, position: Vector3, rotation: Vector3, parent : InstancedMesh): void {
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

    // enlever l'animation à l'indice 0 de animationsGroups
    entries.animationGroups[0].stop();
    const idle = entries.animationGroups.find((ag) => ag.name.includes("idle"));
    if (idle) {
      idle.loopAnimation = true;
      idle.play(true);
    }
    const iTourne = entries.animationGroups.find((ag) => ag.name.includes("CubeAction.026"));

    if (iTourne) {
      iTourne.loopAnimation = true;
      iTourne.play(true);
    }
}

  public createPnjTalk (assetContainers : AssetContainer[], parentMesh : Mesh) { 
    // pnj Talk
    for (let i = 0; i < this.pnjPositions.length; i++) {
      const position = this.pnjPositions[i];
      const rotation = this.pnjRotation[i];

      const parent = parentMesh.createInstance("pnjTalk" + i);
      parent.checkCollisions = true;
      parent.isVisible = false;

      this.duplicatePnjTalk(assetContainers[0], position, rotation, parent);
      this.initCube(position, i);
    }
    this.registerPickUpActions();
  }

  public async init() {
    for (let i = 0; i < this.pnjPositions.length; i++) {
      const position = this.pnjPositions[i];
      const rotation = this.pnjRotation[i];

      let fileName = "pnjTalkV2.glb";

      await this._loadCharacterAssets(
        this._scene,
        position,
        fileName,
        "pnj" + i,
        rotation,
      );


      this.initCube(position, i);
    }
    //faire bouger le "i"
    this.registerPickUpActions();
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
        const iTourne = result.animationGroups.find(
          (ag) => ag.name === "CubeAction.026",
        );
        if (iTourne) {
          iTourne.loopAnimation = true;
          iTourne.play(true);
        }
        //return the mesh and animations
        return {
          mesh: outer as Mesh,
          animationGroups: result.animationGroups,
        };
      });
    }

    return loadCharacter().then((assets) => {
      this.assets = assets;
    });
  }

  initCube(position: Vector3, pos: number): void {
    this.cube[pos] = MeshBuilder.CreateBox("cube" + pos, { size: 1.5 }, this._scene);
    this.cube[pos].position = position; // Changez la position du cube selon vos besoins
    // this.cube.position._y += 2;
    this.cube[pos].visibility = 0; // Rendre le cube invisible
    this.cube[pos].checkCollisions = false; // Empêcher les collisions avec le cube
  }

  private registerPickUpActions(): void {
    // Pour chaque boîte, enregistrez une action pour détecter l'entrée du joueur dans la zone
    for (let i = 0; i < this.cube.length; i++) {
      const box = this.cube[i];

      // Ajoutez une action pour détecter l'entrée du joueur dans la zone de la boîte
      box.actionManager = new ActionManager(this._scene);
      box.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnIntersectionEnterTrigger, // Déclenché lorsque le joueur entre dans la zone
            parameter: this.player,
          },
          () => {
            if(box.name === "cube" + 0 || box.name === "cube" + 1){
              document.getElementById("tp-game-dialog")!.classList.remove("hidden");
            }
            else if(box.name === "cube" + 2){
              document.getElementById("jump-game-dialog")!.classList.remove("hidden");
            }
            else if(box.name === "cube" + 3){
              document.getElementById("foot-game-dialog")!.classList.remove("hidden");
            }
            else if(box.name === "cube" + 4){
              document.getElementById("object-game-dialog")!.classList.remove("hidden");
            }
          },
        ),
      );

      box.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnIntersectionExitTrigger, // Déclenché lorsque le joueur entre dans la zone
            parameter: this.player,
          },
          () => {
            if(box.name === "cube" + 0 || box.name === "cube" + 1){
              document.getElementById("tp-game-dialog")!.classList.add("hidden");
            }
            else if(box.name === "cube" + 2){
              document.getElementById("jump-game-dialog")!.classList.add("hidden");
            }
            else if(box.name === "cube" + 3){
              document.getElementById("foot-game-dialog")!.classList.add("hidden");
            }
            else if(box.name === "cube" + 4){
              document.getElementById("object-game-dialog")!.classList.add("hidden");
            }
          },
        ),
      );
    }
  }
}

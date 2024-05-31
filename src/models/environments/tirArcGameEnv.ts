import { Scaling } from "@/utils/Scaling";
import {
  AnimationGroup,
  AssetContainer,
  Matrix,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
import { InstanceManager } from "./InstManager";

export class tirArcGameEnv {
  private _scene: Scene;
  public assets;
  public filename: string[] = [
    "perso1.glb",
    "perso2.glb",
    "perso3.glb",
    "perso4.glb",
    "perso5.glb",
    "perso6.glb",
    "perso7.glb",
  ];
  public gameAssets;
  public animArc: AnimationGroup | undefined = new AnimationGroup("Anim|corde");
  public flecheAssets;
  public assetContainerTab: AssetContainer[] = [];
  public parentMesh: Mesh;

  constructor(scene: Scene) {
    this._scene = scene;
    this.parentMesh = InstanceManager.initParentPublicMesh(this._scene);
  }

  public async load() {
    const assets = await this._loadAsset();
    //Loop through all environment meshes that were imported
    assets.allMeshes.forEach((m) => {
      // m.receiveShadows = true;
      m.checkCollisions = true;
    });
    this.createSkybox(this._scene);
    this.assetContainerTab = await InstanceManager.initInstance(
      this.filename,
      this._scene,
      "./models/characters/",
    );
    this.loadPublic();
  }

  private loadInstance(
    fileNameId: number,
    i: number,
    position: Vector3,
    rotation: Vector3,
  ) {
    // position, i, "public" + i, rotation
    const child = InstanceManager.duplicateParentMesh(
      this.parentMesh,
      `publicTirArc${i}`,
    );
    const res = InstanceManager.duplicateInstance(
      this.assetContainerTab[fileNameId],
      position,
      rotation,
      child,
      0.018,
    );
    const idle = res.animationGroups.find((ag) => ag.name.includes("idle"));
    const applause = res.animationGroups.find((ag) =>
      ag.name.includes("applause"),
    );

    let randomNumber = Math.floor(Math.random() * 2) + 1;
    if (randomNumber == 1) {
      if (applause) {
        idle?.stop();
        applause.play(true);
      }
    } else {
      if (idle) {
        idle.stop();
        idle.play(true);
      }
    }
    setTimeout(() => {
      if (randomNumber == 1) {
        if (applause) {
          idle?.stop();
          applause.stop();
          applause.play(true);
        }
      } else {
        if (idle) {
          idle.stop();
          applause?.stop();
          idle.play(true);
        }
      }
    }, randomNumber);
  }

  public loadPublic() {
    let compteur = 0;
    let tour = 0;

    let randomNumber1, randomNumber2;
    do {
      randomNumber1 = Math.floor(Math.random() * 6) + 1;
      randomNumber2 = Math.floor(Math.random() * 6) + 1;
    } while (randomNumber1 === randomNumber2);

    for (let i = 1; i <= 90; i++) {
      let pos;
      if (i < 10) {
        pos = this._scene.getMeshByName("perso1.00" + i);
      } else if (i < 100) {
        pos = this._scene.getMeshByName("perso1.0" + i);
      }
      if (pos) {
        pos.isVisible = false;
      }

      if (i - tour * 6 === randomNumber1 || i - tour * 6 === randomNumber2) {
        let rotation;
        if (i <= 40) {
          rotation = new Vector3(0, -80, 0);
        } else if (i >= 41 && i <= 45) {
          rotation = new Vector3(0, 120, 0);
        } else if (i >= 46 && i <= 50) {
          rotation = new Vector3(0, -120, 0);
        } else if (i >= 51 && i <= 90) {
          rotation = new Vector3(0, 80, 0);
        }
        let position = new Vector3(
          -pos.position.x,
          pos.position.y,
          pos.position.z,
        );
        // await this._loadCharacterAssets(this._scene, position, this.filename[i-tour*6], "public" + i, rotation);
        this.loadInstance(i - tour * 6, i, position, rotation);
      }

      compteur += 1;
      if (compteur === 6) {
        tour += 1;
        compteur = 0;
        randomNumber1 = randomNumber2 = 0;
        do {
          randomNumber1 = Math.floor(Math.random() * 6) + 1;
          randomNumber2 = Math.floor(Math.random() * 6) + 1;
        } while (randomNumber1 === randomNumber2);
      }
    }
  }

  //Load all necessary meshes for the environment
  public async _loadAsset() {
    const result = await SceneLoader.ImportMeshAsync(
      null,
      "./models/maps/games/",
      "tirArc2.glb",
      this._scene,
    );

    let env = result.meshes[0];
    let allMeshes = env.getChildMeshes();

    return {
      env: env, //reference to our entire imported glb (meshes and transform nodes)
      allMeshes: allMeshes, // all of the meshes that are in the environment
    };
  }

  public createSkybox(scene: Scene): void {
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.turbidity = 10;
    skyMaterial.luminance = 1;
    skyMaterial.inclination = 0;
    const skyBox = MeshBuilder.CreateBox("skyBox", { size: 2500.0 }, scene);
    skyBox.material = skyMaterial;
  }

  public async _loadGameAssets(
    scene: Scene,
    position: Vector3,
    path: string,
    name: string,
    rotation: Vector3,
  ) {
    async function loadAsset() {
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
        "./models/maps/games/",
        path,
        scene,
      ).then((result) => {
        const root = result.meshes[0];
        //body is our actual player mesh
        const body = root;
        body.parent = outer;
        body.isPickable = false;
        body.checkCollisions = false;
        body.getChildMeshes().forEach((m) => {
          m.isPickable = false;
          m.checkCollisions = false;
        });
        body.scaling = new Scaling(0.02);
        body.showBoundingBox = true;

        outer.position = position;
        outer.rotation = rotation;

        result.animationGroups[0].stop();

        return {
          mesh: outer as Mesh,
          animationGroups: result.animationGroups,
        };
      });
    }

    return loadAsset().then((assets) => {
      // (assets);
      this.gameAssets = assets.mesh;
      this.animArc = assets.animationGroups.find(
        (ag) => ag.name === "Take 001",
      );
      // (this.animArc);
      return assets;
    });
  }

  public async _loadFlecheAssets(
    scene: Scene,
    position: Vector3,
    path: string,
    name: string,
    rotation: Vector3,
  ) {
    async function loadFleche() {
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
        "./models/maps/games/",
        path,
        scene,
      ).then((result) => {
        const root = result.meshes[0];
        //body is our actual player mesh
        const body = root;
        body.parent = outer;
        body.isPickable = false;
        body.checkCollisions = false;
        body.getChildMeshes().forEach((m) => {
          m.isPickable = false;
          m.checkCollisions = false;
        });
        body.scaling = new Scaling(0.5);
        body.showBoundingBox = true;

        outer.position = position;
        outer.rotation = rotation;

        return {
          mesh: outer as Mesh,
        };
      });
    }

    return loadFleche().then((assets) => {
      // (assets);
      this.flecheAssets = assets;
      return assets;
    });
  }
}

import {
	Scene,
	SceneLoader,
	MeshBuilder,
	Vector3,
	Mesh,
	Color3,
	Texture,
} from "@babylonjs/core";
import { SkyMaterial, WaterMaterial } from "@babylonjs/materials";
import { gateInformation } from "../intefaces/EnvironmentsInterfaces";
import { Player } from "../controller/Player";
import { InGameState } from "../scene/InGameState";
import { Pnj } from "./pnj";
import { PnjTalk } from "./pnjTalk";
import { PnjMobile } from "./pnjMobile";
import { Voitures } from "./voitures";
import { StationScore } from "./stationScore";
import { TpGame } from "./tp";
import { Carte } from "./carte";
import { Options } from "./options";
import { Music } from "@/utils/Music";

export class Environment {
  private _scene: Scene;
  private player: Player | null;
  private messageDisplayed: boolean = false;
  public currentGate: Mesh | null = null;
  private inGameState: InGameState;
  public pnj!: Pnj;
  public pnjTalk!: PnjTalk;
  public pnjMobile!: PnjMobile;
  public voitures!: Voitures;
  public stationScore!: StationScore;
  public tpGame!: TpGame;
  public carte: Carte;
  public options!: Options;
  public waterMaterial!: WaterMaterial;
  private skyBox!: Mesh;

  private gateInformations: gateInformation[] = [
    {
      position: new Vector3(-184.8, 5.6, -114.9),
      rotation: 0,
      name: "runningGate",
    },
    {
      position: new Vector3(-190.7, 5.6, -109.3),
      rotation: 0,
      name: "natationGate",
    },
    {
      position: new Vector3(-192.85, 5.6, -101.3),
      rotation: 0,
      name: "tirArcGate",
    },
    {
      position: new Vector3(-191.9, 5.6, -94.43),
      rotation: 0,
      name: "tennisGate",
    },
    {
      position: new Vector3(-173.4, 5.6, -87.58),
      rotation: 0,
      name: "plongeonGate",
    },
    {
      position: new Vector3(-167.8, 5.6, -93.3),
      rotation: 0,
      name: "runninghaieGate",
    },
    {
      position: new Vector3(-165.2, 5.6, -101.36),
      rotation: 0,
      name: "boxeGate",
    },
    {
      position: new Vector3(-166.3, 5.6, -109.2),
      rotation: 0,
      name: "tothink",
    },
  ];

  constructor(scene: Scene, player: Player | null, inGameState: InGameState) {
    this._scene = scene;
    this.player = player;
    this.inGameState = inGameState;
    // this.createRunningGates(scene);
    this.carte = new Carte(this._scene, this.player!);
  }

  public async load() {
    const music = Music.getInstance("./sounds/newAccueil.mp3", 0.1);
    music.stop();
    // var ground = Mesh.CreateBox("ground", 24, this._scene);
    // ground.scaling = new Vector3(1,.02,1);

    const assets = await this._loadAsset();
    //Loop through all environment meshes that were imported
    assets.allMeshes.forEach((m) => {
      // m.receiveShadows = true;
      m.checkCollisions = true;
    });
    // this.createSkybox(this._scene);

		this.disableBuild(1,173);
		this.invisibleBox(1,172);
		this.disableCar(1,63);
		this.invisibleBoxCar(1,21);
		this.loadSky();

        const tabOfNamePnj = ["pnjStrong.glb", "pnjMan.glb", "pnjWoman.glb", "pnjKid.glb", "pnjGirl.glb"];
        const tabOfNamePnjTalk = ["pnjTalkV2.glb"];
        const tabOfNameCar = ["voitures.glb", "voitures2.glb", "voitures3.glb", "voitures4.glb"];
		
		this.pnj = new Pnj(this._scene);
		this.pnjTalk = new PnjTalk(this._scene, this.player?.mesh as Mesh);
		this.pnjMobile = new PnjMobile(this._scene);
		this.voitures = new Voitures(this._scene);

        const parentMesh = this.pnj.initParentMesh();
		const assetContainerTabPnj = await Pnj.initInstance(tabOfNamePnj, this._scene, "./models/characters/pnj/");
		const assetContainerTabPnjTalk = await Pnj.initInstance(tabOfNamePnjTalk, this._scene, "./models/characters/pnj/");
		const assetContainerTabCar = await Pnj.initInstance(tabOfNameCar, this._scene, "./models/voitures/");

		this.pnj.createPnjIdle(assetContainerTabPnj, parentMesh);
		this.pnjTalk.createPnjTalk(assetContainerTabPnjTalk, parentMesh);
		this.pnjMobile.createPnjMobile(assetContainerTabPnj, parentMesh);
		this.voitures.createCar(assetContainerTabCar, parentMesh);

		// await this.pnjTalk.init();
		// await this.pnjMobile.init();
		this.stationScore = new StationScore(this._scene, this.player?.mesh as Mesh);
		this.stationScore.init();		
		this.tpGame = new TpGame(this._scene, this.player?.mesh as Mesh, this.inGameState);
		this.tpGame.init();
		this.createSkybox(this._scene);
		this.createWater();
		this.moveLogo();
		this.options = new Options(this._scene, this.player!);
	}

  //Load all necessary meshes for the environment
  public async _loadAsset() {
    const result = await SceneLoader.ImportMeshAsync(
      null,
      "./models/maps/",
      "V3_JO.glb",
      this._scene,
    );

    let env = result.meshes[0];
    let allMeshes = env.getChildMeshes();

    return {
      env: env, //reference to our entire imported glb (meshes and transform nodes)
      allMeshes: allMeshes, // all of the meshes that are in the environment
    };
  }

  public async loadSky() {
    const result = await SceneLoader.ImportMeshAsync(
      "",
      "./models/maps/skyV2.glb",
      "",
      this._scene,
    );
    result.meshes.forEach((mesh) => {
      mesh.position = new Vector3(-145, 0, -54.1);
      mesh.scaling = new Vector3(0.6, 0.6, 0.6);
    });
  }

  public disableBuild(startNumber: number, endNumber: number) {
    for (let i = startNumber; i <= endNumber; i++) {
      if (i in [8, 9, 16, 17, 22, 26, 30, 32, 105]) {
        for (let j = 0; j <= 1; j++) {
          let mesh = this._scene.getMeshByName("build" + i + "_primitive" + j);
          if (mesh) {
            mesh.checkCollisions = false;
            mesh.isPickable = false;
          }
        }
      } else if (
        i in
        [
          1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 23, 25,
          27, 28, 29, 33, 34, 35, 36, 37, 38, 39, 40, 43, 44,
        ]
      ) {
        for (let j = 0; j <= 2; j++) {
          let mesh = this._scene.getMeshByName("build" + i + "_primitive" + j);
          if (mesh) {
            mesh.checkCollisions = false;
            mesh.isPickable = false;
          }
        }
      } else if (i == 24) {
        for (let j = 0; j <= 3; j++) {
          let mesh = this._scene.getMeshByName("build" + i + "_primitive" + j);
          if (mesh) {
            mesh.checkCollisions = false;
            mesh.isPickable = false;
          }
        }
      } else {
        let mesh = this._scene.getMeshByName("build" + i);
        if (mesh) {
          mesh.checkCollisions = false;
          mesh.isPickable = false;
        }
      }
    }
  }

  public disableCar(startNumber: number, endNumber: number) {
    for (let i = startNumber; i <= endNumber; i++) {
      if (i in [9, 18, 27]) {
        for (let j = 0; j <= 7; j++) {
          let mesh = this._scene.getMeshByName("car" + i + "_primitive" + j);
          if (mesh) {
            mesh.checkCollisions = false;
            mesh.isPickable = false;
          }
        }
      } else if (i in [5, 6, 10, 11, 25, 26, 28, 29]) {
        for (let j = 0; j <= 8; j++) {
          let mesh = this._scene.getMeshByName("car" + i + "_primitive" + j);
          if (mesh) {
            mesh.checkCollisions = false;
            mesh.isPickable = false;
          }
        }
      } else if (i >= 34 && i <= 63) {
        for (let j = 0; j <= 10; j++) {
          let mesh = this._scene.getMeshByName("car" + i + "_primitive" + j);
          if (mesh) {
            mesh.checkCollisions = false;
            mesh.isPickable = false;
          }
        }
      } else {
        let mesh = this._scene.getMeshByName("car" + i);
        if (mesh) {
          mesh.checkCollisions = false;
          mesh.isPickable = false;
        }
      }
    }
  }

  public invisibleBox(startNumber: number, endNumber: number) {
    for (let i = startNumber; i <= endNumber; i++) {
      let mesh = this._scene.getMeshByName("coverB" + i);
      if (mesh) {
        mesh.isVisible = false;
      }
    }
  }

  public invisibleBoxCar(startNumber: number, endNumber: number) {
    for (let i = startNumber; i <= endNumber; i++) {
      let mesh = this._scene.getMeshByName("coverC" + i);
      if (mesh) {
        mesh.isVisible = false;
      }
    }
  }

  public createWater() {
    const waterMesh = this._scene.getMeshByName("Cube.063");
    if (waterMesh) {
      waterMesh.scaling = new Vector3(750, 1, 750);
      waterMesh.position = new Vector3(-145, 0, -54.1);
      this.waterMaterial = new WaterMaterial("water_material", this._scene);
      this.waterMaterial.bumpTexture = new Texture(
        "./water/water_bump.jpg",
        this._scene,
      );
      // this.waterMaterial.windForce = 3;
      // this.waterMaterial.waveHeight = 0.8;
      this.waterMaterial.alpha = 0.9;
      this.waterMaterial.waterColor = new Color3(0.1, 0.1, 0.6);
      this.waterMaterial.colorBlendFactor = 0.5;
      this.waterMaterial.addToRenderList(this.skyBox);
      waterMesh.material = this.waterMaterial;
    }
  }

  public createSkybox(scene: Scene): void {
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.turbidity = 10;
    skyMaterial.luminance = 1;
    skyMaterial.inclination = 0;
    this.skyBox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    this.skyBox.material = skyMaterial;
  }

  public moveLogo() {
    const animation = this._scene.getAnimationGroupByName("CubeAction.005");
    const animation2 = this._scene.getAnimationGroupByName("CubeAction.004");
    const raquette = this._scene.getAnimationGroupByName("CubeAction.010");
    const javelot = this._scene.getAnimationGroupByName("CubeAction.011");
    const arc = this._scene.getAnimationGroupByName("CubeAction.012");
    const gant = this._scene.getAnimationGroupByName("CubeAction.013");
    const run = this._scene.getAnimationGroupByName("CubeAction.014");
    const plongeon = this._scene.getAnimationGroupByName("CubeAction.015");
    const natation = this._scene.getAnimationGroupByName("CubeAction.016");
    if (animation) {
      // Lancer l'animation
      animation.start(true); // Le paramètre true indique de rejouer l'animation même si elle est déjà en cours
    }
    if (animation2) {
      animation2.start(true);
    }
    if (raquette) {
      raquette.start(true);
    }
    if (javelot) {
      javelot.start(true);
    }
    if (arc) {
      arc.start(true);
    }
    if (gant) {
      gant.start(true);
    }
    if (run) {
      run.start(true);
    }
    if (plongeon) {
      plongeon.start(true);
    }
    if (natation) {
      natation.start(true);
    }
    for (let i = 1; i <= 7; i++) {
      const animation3 = this._scene.getAnimationGroupByName("station" + i);
      if (animation3) {
        animation3.start(true);
      }
    }
  }
}

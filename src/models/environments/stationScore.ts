import {
    ActionManager,
    ExecuteCodeAction,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
  } from "@babylonjs/core";
  
  export class StationScore {
    private _scene: Scene;
    public assets;
    // private animations: Animation[] = [];
    private pnjPositions: Vector3[] = [
      //1er groupe
      new Vector3(-189, 2.75, -6),
      //2eme groupe
      new Vector3(-259.91, 2.75, -135.21),
      // //3eme groupe
      new Vector3(-178.4, 2.75, -77.9),
      //4eme groupe
      new Vector3(-181.2, 2.75, -124.9),
      //5eme groupe
      new Vector3(-59, 2.75, -72),
        //6eme groupe
      new Vector3(-132.4, 2.75, 32),
        //7eme groupe
      new Vector3(-144.6, 2.75, 32),
    ];
  
    private cube: Mesh[] = [];
    private player: Mesh;
  
    constructor(scene: Scene, player: Mesh) {
      this._scene = scene;
      this.player = player;
    }
  
    public async init() {
      for (let i = 0; i < this.pnjPositions.length; i++) {
        const position = this.pnjPositions[i];
  
        this.initCube(position, i);
      }
      //faire bouger le "i"
      this.registerPickUpActions();
      
    }
  
  
    initCube(position: Vector3, pos: number): void {
      this.cube[pos] = MeshBuilder.CreateBox("cube" + pos, { size: 1 }, this._scene);
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
                document.getElementById("scoreboard-station-dialog")!.style.display = "block";
                document.getElementById("scoreboard-station-dialog")!.style.position = "absolute";
                document.getElementById("scoreboard-station-dialog")!.style.bottom = "8";
                document.getElementById("scoreboard-station-dialog")!.style.left = "8";
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
                document.getElementById("scoreboard-station-dialog")!.style.display = "none";
            },
          ),
        );
      }
    }
  }
  
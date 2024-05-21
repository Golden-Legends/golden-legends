import {
    ActionManager,
    ExecuteCodeAction,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
  } from "@babylonjs/core";
import { GameState } from "../GameState";
  
  export class TpGame {
    private _scene: Scene;
    public assets;
    // private animations: Animation[] = [];
    private pnjPositions: Vector3[] = [
      //haut gauche
      new Vector3(-184.8, 5.6, -114.9),
      new Vector3(-190.7, 5.6, -109.3),
      new Vector3(-192.85, 5.6, -101.3),
      new Vector3(-191.9, 5.6, -94.43),
      //bas droite
      new Vector3(-173.4, 5.6, -87.58),
      new Vector3(-167.8, 5.6, -93.3),
      new Vector3(-165.2, 5.6, -101.36),
      new Vector3(-166.3, 5.6, -109.2),
    ];
  
    private cube: Mesh[] = [];
    private player: Mesh;

    private gameState : GameState;
    
    constructor(scene: Scene, player: Mesh, gameState: GameState ) {
      this._scene = scene;
      this.player = player;
      this.gameState = gameState;
    }
  
    public async init() {
      for (let i = 0; i < this.pnjPositions.length; i++) {
        const position = this.pnjPositions[i];
  
        this.initCube(position, i);
      }
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
              switch (i) {
                case 0:
                  document.getElementById("100mtp")!.classList.remove("hidden");
                  break;
                case 1:
                  document.getElementById("natationtp")!.classList.remove("hidden");
                  break;
                case 2: 
                  document.getElementById("boxetp")!.classList.remove("hidden");
                  break;
                case 3: 
                  document.getElementById("plongeontp")!.classList.remove("hidden");
                  break;
                case 4:
                  document.getElementById("tirArctp")!.classList.remove("hidden");
                  break;
                case 5: 
                document.getElementById("javelottp")!.classList.remove("hidden");
                break;
                default:
                  document.getElementById("tpGame-dialog")!.classList.remove("hidden");
                  // console.log("no tp");
                  break;
              }
              this.gameState.removeHandlePointerLock();
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
              switch (i) {
                case 0:
                  document.getElementById("100mtp")!.classList.add("hidden");
                  break;
                case 1:
                  document.getElementById("natationtp")!.classList.add("hidden");
                  break;
                case 2: 
                  document.getElementById("boxetp")!.classList.add("hidden");
                  break;
                case 3: 
                  document.getElementById("plongeontp")!.classList.add("hidden");
                  break;
                case 4:
                  document.getElementById("tirArctp")!.classList.add("hidden");
                  break;
                case 5:
                  document.getElementById("javelottp")!.classList.add("hidden");
                  break;
                default:
                  document.getElementById("tpGame-dialog")!.classList.add("hidden");
                  console.log("no tp");
                  break;
              }
            },
          ),
        );
      }
    }
  }
  
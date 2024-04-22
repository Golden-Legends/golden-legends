import { ActionManager, Color4, ExecuteCodeAction, Mesh, MeshBuilder, ParticleSystem, Scene, Texture, Vector3 } from "@babylonjs/core";
import { PlayerInput } from "../../inputsMangement/PlayerInput";
import { objects }  from "@/components/BabylonScene.vue";


export class ObjectGame {
    progress: number;
    private scene: Scene;
    private player: Mesh;  
    private playerInput: PlayerInput;
    private cube: Mesh[] = [];
    private name: string[] = [];
    private totalObjects: number = 0;
    private objectToPickUp: Mesh | undefined;
    private isPlayerInsideTrigger: boolean = false;
    private objectsCollectedSet: Set<number> = new Set<number>();
    private particleSystems: ParticleSystem[] = [];


    constructor(scene: Scene, player: Mesh, input: PlayerInput) {
        this.progress = 0;
        this.scene = scene;
        this.player = player;
        this.playerInput = input;
    }

  
    public init(){
        //création d'une box près de chaque objet olympique
        this.initCube(-256, 2.5, -56.5, 0, "Haies");
        this.initCube(-259, 3, 43, 1, "Gants de boxe");
        this.initCube(-261, 2.5, -135, 2, "Raquette de tennis");
        this.initCube(-201, 2.5, -96, 3, "Ballon de basket");
        this.initCube(-96, 2.5, -168.5, 4, "Skateboard");
        this.initCube(-35.5, 2.5, -18, 5, "Arc");
        this.initCube(-46.5, 2.5, 58, 6, "Chaussures");
        this.initCube(-163, 2.5, 4.5, 7, "Vélo");
       
        this.totalObjects = this.cube.length;

        //apparition d'un message quand je suis à côté de la box
        this.registerPickUpActions();


        //intéragir avec G pour ramasser l'objet olympique 
        this.miniGame();
        this.scene.registerBeforeRender(() => {
            if (this.isPlayerInsideTrigger && this.playerInput.inputMap["Space"]) {
                this.collectObject();
            }
        });
        
        this.createParticleSystems();
        this.interactObjectFound();
    }

    private createParticleSystems() {
        for (let i = 0; i < this.cube.length; i++) {
            const particleSystem = new ParticleSystem("particles", 2000, this.scene);
            particleSystem.particleTexture = new Texture("textures/flare.png", this.scene);
            particleSystem.emitter = this.cube[i];
            particleSystem.minEmitBox = new Vector3(-0.25, 0.25, -0.25); // Starting all from
            particleSystem.maxEmitBox = new Vector3(0.25, 0.25, 0.25); // To...
            particleSystem.color1 = new Color4(1, 0, 0, 1);
            particleSystem.color2 = new Color4(1, 0.5, 0, 1);
            particleSystem.colorDead = new Color4(0, 0, 0, 0.1);
            particleSystem.minSize = 0.05;
            particleSystem.maxSize = 0.2;
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 1.5;
            particleSystem.emitRate = 150;
            particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
            particleSystem.gravity = new Vector3(0, -1, 0);
            particleSystem.direction1 = new Vector3(-1, 1, -1);
            particleSystem.direction2 = new Vector3(1, 1, 1);
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
            particleSystem.minEmitPower = 0.5;
            particleSystem.maxEmitPower = 1;
            particleSystem.updateSpeed = 0.005;
            particleSystem.start();

            this.particleSystems.push(particleSystem);
        }
    }


    private miniGame(){
        console.log("miniGame");
    }

    private collectObject(): void {
        if (!this.objectToPickUp) return; // Vérifiez si un objet est défini

        const objectIndex = this.cube.indexOf(this.objectToPickUp); // Obtenez l'indice de l'objet à ramasser

        if (objectIndex === -1 || this.objectsCollectedSet.has(objectIndex)) {
            // L'objet n'a pas été trouvé ou a déjà été ramassé
            return;
        }

        // Incrémentez le nombre d'objets collectés
        this.objectsCollectedSet.add(objectIndex);

        // Masquez l'objet
        this.objectToPickUp.dispose();

        //modifie la valeur de la propriété found de l'objet
        this.modifierValeurFound(this.name[objectIndex]);

        document.getElementById("haie-object-dialog")!.style.display = "none";
        document.getElementById("gant-object-dialog")!.style.display = "none";
        document.getElementById("raquette-object-dialog")!.style.display = "none";
        document.getElementById("ballon-object-dialog")!.style.display = "none";
        document.getElementById("skate-object-dialog")!.style.display = "none";
        document.getElementById("arc-object-dialog")!.style.display = "none";
        document.getElementById("chaussure-object-dialog")!.style.display = "none";
        document.getElementById("velo-object-dialog")!.style.display = "none";

        // Affichez le message de collecte
        if (this.objectsCollectedSet.size === this.totalObjects) {
            // Si tous les objets ont été collectés, affichez un message de victoire
            document.getElementById("recup-allObject-dialog")!.style.display = "block";
            document.getElementById("recup-allObject-dialog")!.style.position = "absolute";
            document.getElementById("recup-allObject-dialog")!.style.bottom = "8";
            document.getElementById("recup-allObject-dialog")!.style.left = "8";
            setTimeout(() => {
                document.getElementById("recup-allObject-dialog")!.style.display = "none";
            }, 3000);
        } else {
            // Sinon, affichez un message indiquant que l'objet a été récupéré avec succès
            document.getElementById("recup-object-dialog")!.style.display = "block";
            document.getElementById("recup-object-dialog")!.style.position = "absolute";
            document.getElementById("recup-object-dialog")!.style.bottom = "8";
            document.getElementById("recup-object-dialog")!.style.left = "8";
            setTimeout(() => {
                document.getElementById("recup-object-dialog")!.style.display = "none";
            }, 3000);
            console.log(objects);
        }
    }



    private registerPickUpActions(): void {
        // Pour chaque boîte, enregistrez une action pour détecter l'entrée du joueur dans la zone
        for (let i = 0; i < this.cube.length; i++) {
            const box = this.cube[i];

            // Ajoutez une action pour détecter l'entrée du joueur dans la zone de la boîte
            box.actionManager = new ActionManager(this.scene);
            box.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger, // Déclenché lorsque le joueur entre dans la zone
                        parameter: this.player,
                    },
                    () => {
                        // Affichez le message lorsque le joueur entre dans la zone de la boîte
                        switch (i) {
                            case 0:
                                document.getElementById("haie-object-dialog")!.style.display = "block";
                                document.getElementById("haie-object-dialog")!.style.position = "absolute";
                                document.getElementById("haie-object-dialog")!.style.bottom = "8";
                                document.getElementById("haie-object-dialog")!.style.left = "8";
                                break;
                            case 1:
                                document.getElementById("gant-object-dialog")!.style.display = "block";
                                document.getElementById("gant-object-dialog")!.style.position = "absolute";
                                document.getElementById("gant-object-dialog")!.style.bottom = "8";
                                document.getElementById("gant-object-dialog")!.style.left = "8";
                                break;
                            case 2:
                                document.getElementById("raquette-object-dialog")!.style.display = "block";
                                document.getElementById("raquette-object-dialog")!.style.position = "absolute";
                                document.getElementById("raquette-object-dialog")!.style.bottom = "8";
                                document.getElementById("raquette-object-dialog")!.style.left = "8";
                                break;
                            case 3:
                                document.getElementById("ballon-object-dialog")!.style.display = "block";
                                document.getElementById("ballon-object-dialog")!.style.position = "absolute";
                                document.getElementById("ballon-object-dialog")!.style.bottom = "8";
                                document.getElementById("ballon-object-dialog")!.style.left = "8";
                                break;
                            case 4:
                                document.getElementById("skate-object-dialog")!.style.display = "block";
                                document.getElementById("skate-object-dialog")!.style.position = "absolute";
                                document.getElementById("skate-object-dialog")!.style.bottom = "8";
                                document.getElementById("skate-object-dialog")!.style.left = "8";
                                break;
                            case 5:
                                document.getElementById("arc-object-dialog")!.style.display = "block";
                                document.getElementById("arc-object-dialog")!.style.position = "absolute";
                                document.getElementById("arc-object-dialog")!.style.bottom = "8";
                                document.getElementById("arc-object-dialog")!.style.left = "8";
                                break;
                            case 6:
                                document.getElementById("chaussure-object-dialog")!.style.display = "block";
                                document.getElementById("chaussure-object-dialog")!.style.position = "absolute";
                                document.getElementById("chaussure-object-dialog")!.style.bottom = "8";
                                document.getElementById("chaussure-object-dialog")!.style.left = "8";
                                break;
                            case 7:
                                document.getElementById("velo-object-dialog")!.style.display = "block";
                                document.getElementById("velo-object-dialog")!.style.position = "absolute";
                                document.getElementById("velo-object-dialog")!.style.bottom = "8";
                                document.getElementById("velo-object-dialog")!.style.left = "8";
                                break;
                            default:
                                break;
                        }
                        this.objectToPickUp = box;
                        this.isPlayerInsideTrigger = true;
                        if(this.playerInput.inputMap["Space"]){
                            this.collectObject();
                        }
                    }
                )
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
                                document.getElementById("haie-object-dialog")!.style.display = "none";
                                break;
                            case 1:
                                document.getElementById("gant-object-dialog")!.style.display = "none";
                                break;
                            case 2:
                                document.getElementById("raquette-object-dialog")!.style.display = "none";
                                break;
                            case 3:
                                document.getElementById("ballon-object-dialog")!.style.display = "none";
                                break;
                            case 4:
                                document.getElementById("skate-object-dialog")!.style.display = "none";
                                break;
                            case 5:
                                document.getElementById("arc-object-dialog")!.style.display = "none";
                                break;
                            case 6:
                                document.getElementById("chaussure-object-dialog")!.style.display = "none";
                                break;
                            case 7:
                                document.getElementById("velo-object-dialog")!.style.display = "none";
                                break;
                            default:
                                break;
                        }
                        this.isPlayerInsideTrigger = false;
                    }
                )
            );

        }
    }

    initCube(x: number, y: number, z: number, pos: number, name: string): void {
        this.cube[pos] = MeshBuilder.CreateBox("cube", { size: 1 }, this.scene);
        this.cube[pos].position = new Vector3(
            x, y, z
        ); // Changez la position du cube selon vos besoins
        // this.cube.position._y += 2;
        this.cube[pos].visibility = 0; // Rendre le cube invisible
        this.cube[pos].checkCollisions = false; // Empêcher les collisions avec le cube
        this.name[pos] = name;
    }

    public interactObjectFound() {
		document.addEventListener("keydown", function(event) {
			if (event.key === 'n' && document.getElementById("objectsFound")!.style.display == "block"){
				document.getElementById("objectsFound")!.style.display = "none";
			}
			else if (event.key === 'n'){
				document.getElementById("objectsFound")!.style.display = "block";
			}
		});
	}

    public modifierValeurFound(nomObjet: string) {
        // Recherche de l'objet dans la variable objects
        const objetTrouve = objects.find(objet => objet.name === nomObjet);
      
        // Si l'objet est trouvé, met à jour la valeur de la propriété found
        if (objetTrouve) {
          objetTrouve.found = true;
        } else {
          console.error(`L'objet ${nomObjet} n'a pas été trouvé.`);
        }
    }
}
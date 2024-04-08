import { AbstractMesh, ActionManager, Color3, Color4, ExecuteCodeAction, Material, Mesh, MeshBuilder, ParticleSystem, Scene, Space, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { PlayerInput } from "../../inputsMangement/PlayerInput";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";


export class ObjectGame {
    progress: number;
    private scene: Scene;
    private player: Mesh;  
    private playerInput: PlayerInput;
    private cube: Mesh[] = [];
    private name: string[] = [];
    private guiTextureButton!: AdvancedDynamicTexture;
    private objectsCollected: number = 0;
    private totalObjects: number = 0;
    private objectPickedUp: boolean = false;
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
        this.initCube(-256, 2.5, -56.5, 0, "Haie olympique");
        this.initCube(-259, 3, 43, 1, "Gant de boxe");
        this.initCube(-261, 2.5, -135, 2, "Raquette de tennis");
        this.initCube(-201, 2.5, -96, 3, "Ballon de basket");
        this.initCube(-96, 2.5, -168.5, 4, "Skateboard");
        this.initCube(-35.5, 2.5, -18, 5, "Arc olympique");
        this.initCube(-46.5, 2.5, 58, 6, "Chaussures de course");
        this.initCube(-163, 2.5, 4.5, 7, "Vélo olympique");
       
        this.totalObjects = this.cube.length;

        //apparition d'un message quand je suis à côté de la box
        this.registerPickUpActions();


        //intéragir avec G pour ramasser l'objet olympique 
        this.miniGame();
        this.scene.registerBeforeRender(() => {
            if (this.isPlayerInsideTrigger && this.playerInput.inputMap["Space"]) {
                this.collectObject();
                this.objectPickedUp = true
            }
        });
        
        this.createParticleSystems();
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

        this.objectPickedUp = false;

        // Affichez le message de collecte
        if (this.objectsCollectedSet.size === this.totalObjects) {
            // Si tous les objets ont été collectés, affichez un message de victoire
            this.guiTextureButton.dispose();
            this.displayMessageSuccess("Tous les objets olympiques ont été ramassés !");
            // console.log("Tous les objets olympiques ont été ramassés !");
        } else {
            // Sinon, affichez un message indiquant que l'objet a été récupéré avec succès
            this.guiTextureButton.dispose();
            this.displayMessageSuccess(this.name[objectIndex] + " récupéré avec succès !");
            // console.log(this.name[objectIndex] + " récupéré avec succès !");
        }
    }



    private registerPickUpActions(): void {
        this.guiTextureButton = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        // Pour chaque boîte, enregistrez une action pour détecter l'entrée du joueur dans la zone
        for (let i = 0; i < this.cube.length; i++) {
            const box = this.cube[i];
            const message = "Récupérer l'objet " + this.name[i] + " avec P";
            
            const messageBlock = new TextBlock();
            messageBlock.text = message;
            messageBlock.color = "white";
            messageBlock.fontSize = 24;
            messageBlock.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
            messageBlock.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;

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
                        this.guiTextureButton.addControl(messageBlock);
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
                        this.guiTextureButton.removeControl(messageBlock);
                        this.isPlayerInsideTrigger = false;
                    }
                )
            );

        }
    }

    // private displayMessage(message: string): void {
    //     // Créez un message à afficher à l'écran
    //     this.guiTextureButton = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    //     const messageBlock = new TextBlock();
    //     messageBlock.text = message;
    //     messageBlock.color = "white";
    //     messageBlock.fontSize = 24;
    //     messageBlock.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    //     messageBlock.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    //     this.guiTextureButton.addControl(messageBlock);
    // }

    private displayMessageSuccess(message: string): void {
        // Créez un message à afficher à l'écran
        this.guiTextureButton = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const messageBlock = new TextBlock();
        messageBlock.text = message;
        messageBlock.color = "white";
        messageBlock.fontSize = 24;
        messageBlock.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        messageBlock.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
        this.guiTextureButton.addControl(messageBlock);

        setTimeout(() => {
            this.guiTextureButton.removeControl(messageBlock);
        }, 3000);
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
}
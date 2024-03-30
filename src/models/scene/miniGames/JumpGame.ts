import { AbstractMesh, ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";
import { PlayerInput } from "../../inputsMangement/PlayerInput";



export class JumpGame {
    progress: number;
    private scene: Scene;
    private player: Mesh;  
    private cube!: Mesh;
    private guiTextureButton!: AdvancedDynamicTexture;
    private isPlayerInsideTrigger: boolean = false;
    private playerInput: PlayerInput;
    private platformsJumped: number = 0;
    private platformsAlreadyJump: string[] = [];
    


    constructor(scene: Scene, player: Mesh, input: PlayerInput,) {
        this.scene = scene;
        this.player = player;
        this.progress = 0;
        this.playerInput = input;
    }

  
    public init(){
        //invisible platform
        // console.log(this.player.position);
        this.invisiblePlatform(1, 20);

        
        //apparition message pour afficher les plateformes
        this.initCube();
        this.registerBoxPickUpActions();



        //apparition des plateformes
        this.scene.registerBeforeRender(() => {
            if (this.isPlayerInsideTrigger && this.playerInput.inputMap["Space"]) {
                this.visiblePlatform(1, 20);
            }
        });


        //Mini jeu
        this.miniGame();


        //compteur pour arriver au nombre de plateformes
        //si touche l'eau, le jeu se termine et s'il arrive au bon nombre, apparition du message de fin de jeu





    }



    miniGame(){
        this.player.onCollide = (collidedMesh?: AbstractMesh) => {
            // console.log("Collision détectée: ", collidedMesh?.name);
            if (collidedMesh && collidedMesh.name.startsWith("platform") && !this.platformsAlreadyJump.includes(collidedMesh.name)) {
                // Plateforme visible et collision détectée
                this.platformsJumped++; // Incrémenter le compteur de plateformes sautées
                console.log("Plateforme sautée: ", this.platformsJumped);
            }
            if (collidedMesh && collidedMesh.name.startsWith("Cube.063")){
                console.log("endgame");
            }
        };
    }


    initCube(): void {
		// if (this.progress === 100) {
		// 	return;
		// }

		this.cube = MeshBuilder.CreateBox("cube", { size: 2 }, this.scene);
		this.cube.position = new Vector3(
			-70, 3, -127
		); // Changez la position du cube selon vos besoins
		// this.cube.position._y += 2;
		this.cube.visibility = 0; // Rendre le cube invisible
		this.cube.checkCollisions = false; // Empêcher les collisions avec le cube
	}


    registerBoxPickUpActions(): void {
		this.guiTextureButton = AdvancedDynamicTexture.CreateFullscreenUI("UI");

		const message = new TextBlock();
		message.text = "Start jump quest !";
		message.fontSize = 30;
		message.color = "#00FF00";
		message.fontFamily = "STENCIL";
		message.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
		message.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;

        if (this.player && this.player.actionManager){
            this.player.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: {
                            mesh: this.cube,
                            usePreciseIntersection: true,
                        },
                    },
                    () => {
                        if (this.progress !== 100) {
                            this.isPlayerInsideTrigger = true;
    
                            this.guiTextureButton.addControl(message);
                            // console.log("Player is inside the trigger");
                        }
                    },
                ),
            );
        }

        if (this.player && this.player.actionManager){
            this.player.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionExitTrigger,
                        parameter: {
                            mesh: this.cube,
                            usePreciseIntersection: true,
                        },
                    },
                    () => {
                        this.isPlayerInsideTrigger = false;
                        this.guiTextureButton.removeControl(message);
                    },
                ),
            );
        }
	}



    private invisiblePlatform(startNumber: number, endNumber: number){
        for (let i = startNumber; i <= endNumber; i++) {
            let mesh = this.scene.getMeshByName("platform" + i);
            if (mesh) {
                mesh.isVisible = false;
            }
        }
    }


    private visiblePlatform(startNumber: number, endNumber: number){
        for (let i = startNumber; i <= endNumber; i++) {
            let mesh = this.scene.getMeshByName("platform" + i);
            if (mesh) {
                mesh.isVisible = true;
            }
        }
    }



}
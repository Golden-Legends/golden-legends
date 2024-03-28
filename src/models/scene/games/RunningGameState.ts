import { ActionManager, Animation, ExecuteCodeAction, FreeCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import { GameState } from "../../GameState";import { runningGameEnv } from "../../environments/runningGameEnv";
import { PlayerInputRunningGame } from "../../inputsMangement/PlayerInputRunningGame";
import { Game } from "../../Game";
import { PlayerRunningGame } from "../../controller/PlayerRunningGame";


export class RunningGameState extends GameState {
    private _input : PlayerInputRunningGame;
    public _camera !: FreeCamera;
    private endGame : boolean = false;
    private raceStartTime: number = 0;

    private player !: PlayerRunningGame;

    constructor(game: Game, canvas: HTMLCanvasElement) {
        super(game, canvas);
        this._input = new PlayerInputRunningGame(this.scene);
    }

    async enter(): Promise<void>{
        try {            

            this.handlePointerLockChange();

            //load the gui iin the mainmenu and not here only for prod 
            await this.game.loadingScreen.loadGui();
            this.game.engine.displayLoadingUI();

            // Inspector.Show(this.scene, {});
            await this.setEnvironment();

            // test classe player
            const disque = this.scene.getMeshByName("Cylindre");
            this.player = new PlayerRunningGame(disque?.getAbsolutePosition().x || 0, 
                                                disque?.getAbsolutePosition().y || 0, 
                                                disque?.getAbsolutePosition().z || 0, 
                                                this.scene, 
                                                "./models/characters/character-skater-boy.glb", 
                                                this._input, false);
            await this.player.init();

            this.createLight();
            this.runUpdateAndRender();

            this.game.engine.hideLoadingUI();

            // collision
            const endMesh = this.scene.getMeshByName("Cylindre.002");
            if (endMesh) { 
                endMesh.actionManager = new ActionManager(this.scene);
                endMesh.actionManager.registerAction(
                    new ExecuteCodeAction(
                        {
                            trigger: ActionManager.OnIntersectionEnterTrigger,
                            parameter: this.player.transform
                        },
                        () => {
                            this.endGame = true;
                            this.player.stopAnimations();
                            const raceEndTime = performance.now();
                            const raceDurationInSeconds = (raceEndTime - this.raceStartTime) / 1000; // Convert milliseconds to seconds
                            console.log("Durée de la course :", raceDurationInSeconds, "secondes");
                        }
                    )
                );
            }
            
            this.raceStartTime = performance.now();


            this._camera = new FreeCamera("camera100m", new Vector3(-12, 10, 20), this.scene);
            this._camera.setTarget(this.player.transform.position);

            this.AnimPublic();
            this.CreateCameraMouv();

        
        } catch (error) {
            throw new Error("erreur.");
        }
    }

    exit(): void {
        console.log("exit running game");
    }
    
    update(): void {
        try 
        {  
            this.player._updateGroundDetection();
            this.player.animationPlayer();
            if (!this.endGame) {
                this.player.movePlayer();
                this.player.processInput();
            }            
        } catch (error) 
        {
            throw new Error("error : Running game class update." + error);
        }
    }

    async setEnvironment(): Promise<void> {
        try {
            const maps = new runningGameEnv(this.scene);
            await maps.load();
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }

    private createLight() {
        const light = new HemisphericLight("light", new Vector3(0, 2, 0), this.scene);
        light.intensity = 0.7;
    }



    // private async animateCamera(): Promise<void> {
    //     const cameraStartPosition = this._camera.position.clone();
    //     const radius = 30; // Taille du cercle
    
    //     // Position de l'objet que la caméra regarde
    //     const targetPosition = this.player.transform.position.clone();
    
    //     // Créez une animation pour la caméra
    //     const cameraAnimation = new Animation("cameraAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
    //     const keys: { frame: number, value: Vector3 }[] = []; // Spécifiez le type des clés explicitement
    //     keys.push({ frame: 0, value: cameraStartPosition.clone() });
    
    //     // Ajoutez des étapes pour effectuer un mouvement circulaire
    //     for (let angle = 0; angle < 2 * Math.PI; angle += 0.1) {
    //         const newX = Math.sin(angle) * radius;
    //         const newZ = Math.cos(angle) * radius;
    
    //         // Calculez la nouvelle position de la caméra
    //         const newPosition = cameraStartPosition.add(new Vector3(newX, 0, newZ));
    
    //         // Calculez la nouvelle cible de la caméra en fonction de la position de l'objet
    //         const newTargetPosition = targetPosition.clone();
    
    //         // Définissez la nouvelle position et la nouvelle cible de la caméra
    //         this._camera.position = newPosition;
    //         this._camera.setTarget(newTargetPosition);
    
    //         keys.push({ frame: angle * 20, value: newPosition });
    //     }
    //     cameraAnimation.setKeys(keys);
    
    //     // Ajoutez l'animation à la caméra
    //     this._camera.animations = [];
    //     this._camera.animations.push(cameraAnimation);
    
    //     // Lancez l'animation
    //     this.scene.beginAnimation(this._camera, 0, keys[keys.length - 1].frame, false);
    
    //     // Attendez la fin de l'animation avant de continuer
    //     await new Promise<void>(resolve => {
    //         setTimeout(() => {
    //             resolve();
    //         }, keys[keys.length - 1].frame / 30 * 1000); // Attendre la durée de l'animation
    //     });
    
    //     // Définir la position finale de la caméra et ajuster la cible
    //     this._camera.position = new Vector3(22.72, 22.07, -31.21);
    //     this._camera.setTarget(this.player.transform.position);
    // }

    async CreateCameraMouv(): Promise<void> {
        const fps = 60;
        const camAnim = new Animation("camAnim", 
                                    "position", 
                                    fps, 
                                    Animation.ANIMATIONTYPE_VECTOR3, 
                                    Animation.ANIMATIONLOOPMODE_CONSTANT,
                                    true);

        const camKeys: { frame: number, value: Vector3 }[] = [];
        camKeys.push({frame: 0, value: new Vector3(-2, 10, 20)});
        camKeys.push({frame: 3, value: new Vector3(-15, 2, -30)});
        camKeys.push({frame: 8 * fps, value: new Vector3(0.5, 2, -25)});
        camKeys.push({frame: 10 * fps, value: new Vector3(0.5, 2, -25)});
        camKeys.push({frame: 14 * fps, value: new Vector3(-6, 6, -10)});

        camAnim.setKeys(camKeys);
        this._camera.animations.push(camAnim);

        await this.scene.beginAnimation(this._camera, 0, 14 * fps).waitAsync();

        this.AfterCamAnim();
    }

    AfterCamAnim(): void {
        this._camera.attachControl();
        // this._camera.attachControl(this.player.transform, true);
        this._camera.position = new Vector3(22.72, 22.07, -31.21);
        this._camera.setTarget(this.player.transform.position);
    }


    AnimPublic() {
        let animationGroup = this.scene.getAnimationGroupByName("idle");
        if (animationGroup) {
            animationGroup.loopAnimation = true;
            animationGroup.play(true);
        }
    }

}
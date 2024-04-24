import {
    Animation,
    EasingFunction,
    FollowCamera,
    Mesh,
    QuadraticEase,
    Scene,
    Vector3,
} from "@babylonjs/core";
import { Player } from "../controller/Player";

export class Carte {
    private _scene: Scene;
    private player: Player;

    constructor(scene: Scene, player: Player) {
        this._scene = scene;
        this.player = player;
    }

    public init() {


        this.interactCarte();
    }


    public interactCarte() {
		document.addEventListener("keydown", async (event) => {
			if (event.key === 'm' && document.getElementById("carte-dialog")!.classList.contains("hidden")
                                    && !document.getElementById("objects-keybind")!.classList.contains("hidden")){
                document.getElementById("carte-dialog")!.classList.remove("hidden");              
                //créer une caméra qui se déplace sur la carte
                const camera = new FollowCamera("carteCamera", this.player.mesh.position, this._scene);
                //camera.lockedTarget = this.player.mesh;
                //camera.radius = 10;
                //camera.heightOffset = 20;
                //camera.rotationOffset = 180;

                const animation = new Animation(
                    "cameraAnimation",
                    "position",
                    30,
                    Animation.ANIMATIONTYPE_VECTOR3,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                );

                // Définir les frames clés de l'animation
                const camKeys: { frame: number, value: Vector3 }[] = [];
                camKeys.push({
                    frame: 0,
                    value: camera.position.clone(), // Position actuelle de la caméra
                });
                camKeys.push({
                    frame: 100, // Durée de l'animation (en frames)
                    value: new Vector3(-140, 80, -260), // Nouvelle position de la caméra
                });

                // Ajouter les keys à l'animation
                animation.setKeys(camKeys);

                // Ajouter une fonction d'interpolation (ici, interpolation linéaire)
                const easingFunction = new QuadraticEase();
                easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
                animation.setEasingFunction(easingFunction);
                

                // Ajouter l'animation à la caméra
                camera.animations.push(animation);


                const rotationAnimation = new Animation(
                    "cameraRotationAnimation",
                    "rotation",
                    30,
                    Animation.ANIMATIONTYPE_VECTOR3,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                );

                // Définir les frames clés de l'animation de rotation
                const rotationKeys: { frame: number, value: Vector3 }[] = [];
                rotationKeys.push({
                    frame: 0,
                    value: camera.rotation.clone(), // Rotation actuelle de la caméra
                });
                rotationKeys.push({
                    frame: 100, // Durée de l'animation (en frames)
                    value: new Vector3(Math.PI/6, 0, 0), // Rotation vers le bas de 20 degrés
                });
                rotationAnimation.setKeys(rotationKeys);
                rotationAnimation.setEasingFunction(easingFunction);
                camera.animations.push(rotationAnimation);

                // Lancer l'animation
                this._scene.beginAnimation(camera, 0, 100, false);

                this._scene.activeCamera = camera;  
			}
			else if (event.key === 'm' && !document.getElementById("carte-dialog")!.classList.contains("hidden")
                                        && !document.getElementById("objects-keybind")!.classList.contains("hidden")){
                document.getElementById("carte-dialog")!.classList.add("hidden");   
                //retourner à la caméra du joueur
                if(this._scene.activeCameras){
                    //this._scene.activeCamera = this._scene.activeCameras[0];
                    //await this.player.activatePlayerCamera();
                    //console.log(this._scene.activeCameras);    
                    this._scene._activeCamera = await this.player.activatePlayerCamera();
                }
			}
		});
	}

}
  
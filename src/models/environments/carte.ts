import {
    Animation,
    EasingFunction,
    FollowCamera,
    QuadraticEase,
    Scene,
    Vector3,
} from "@babylonjs/core";
import { Player } from "../controller/Player";

export class Carte {
    private _scene: Scene;
    private player: Player;
    public positionCam!: Vector3;
    private fps: number = 30;
    private camera : FollowCamera;

    constructor(scene: Scene, player: Player) {
        this._scene = scene;
        this.player = player;
        this.camera = new FollowCamera("carteCamera", new Vector3(0, 0, 0), this._scene);
    }

    public openCarte() {
        document.getElementById("carte-dialog")!.classList.remove("hidden");
        document.getElementById("map-keybind")!.classList.add("hidden");              
        //créer une caméra qui se déplace sur la carte
        this.positionCam = this.player._camRoot.position.clone();

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
            value: this.positionCam, // Position actuelle de la caméra
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
        this.camera.animations.push(animation);

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
            value: this.camera.rotation.clone(), // Rotation actuelle de la caméra
        });
        rotationKeys.push({
            frame: 100, // Durée de l'animation (en frames)
            value: new Vector3(Math.PI/6, 0, 0), // Rotation vers le bas de 20 degrés
        });
        rotationAnimation.setKeys(rotationKeys);
        rotationAnimation.setEasingFunction(easingFunction);
        this.camera.animations.push(rotationAnimation);

        // Lancer l'animation
        this._scene.beginAnimation(this.camera, 0, 100 * this.fps, false);

        setTimeout(() => {
            document.getElementById("map-keybind")!.classList.remove("hidden");
        }, 100*this.fps);

        this._scene.activeCamera = this.camera; 
    }

    public closeCarte() {
        document.getElementById("carte-dialog")!.classList.add("hidden");   
        document.getElementById("map-keybind")!.classList.add("hidden");
        //retourner à la caméra du joueur
        if(this._scene.activeCameras){
            this.camera.position = new Vector3(-140, 80, -260);

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
                value: new Vector3(-140, 80, -260), // Position actuelle de la caméra
            });
            camKeys.push({
                frame: 100, // Durée de l'animation (en frames)
                value: this.positionCam, // Nouvelle position de la caméra
            });

            // Ajouter les keys à l'animation
            animation.setKeys(camKeys);

            // Ajouter une fonction d'interpolation (ici, interpolation linéaire)
            const easingFunction = new QuadraticEase();
            easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
            animation.setEasingFunction(easingFunction);
            
            // Ajouter l'animation à la caméra
            this.camera.animations.push(animation);

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
                value: this.camera.rotation.clone(), // Rotation actuelle de la caméra
            });
            rotationKeys.push({
                frame: 100, // Durée de l'animation (en frames)
                value: new Vector3(Math.PI/6, 0, 0), // Rotation vers le bas de 20 degrés
            });
            rotationAnimation.setKeys(rotationKeys);
            rotationAnimation.setEasingFunction(easingFunction);
            this.camera.animations.push(rotationAnimation);

            // Lancer l'animation
            this._scene.beginAnimation(this.camera, 0, 100 * this.fps, false);

            setTimeout(() => {
                this._scene._activeCamera = this._scene.cameras[0];
                document.getElementById("map-keybind")!.classList.remove("hidden");
            }, 100*this.fps);
        }
    }
}
  
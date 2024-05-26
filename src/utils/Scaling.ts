import { Vector3 } from "@babylonjs/core";

export class Scaling extends Vector3 {
    constructor(scale: number) {
        super(scale, scale, scale);
    }
}

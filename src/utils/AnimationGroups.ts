import { AnimationGroup } from "@babylonjs/core";

export class AnimationsGroup {
    private animationGroup : AnimationGroup;

    constructor (animationGroup : AnimationGroup) {
        this.animationGroup = animationGroup;
    }

    playAnAnim() {
        this.animationGroup.play(true);
    }
}
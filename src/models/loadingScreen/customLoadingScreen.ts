import { ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {
    public loadingUIBackgroundColor: string;

    constructor(public loadingUIText: string) {
        this.loadingUIBackgroundColor = "black";
    }
    
    public displayLoadingUI() {
        console.log(this.loadingUIText);
        
    }

    public hideLoadingUI() {
        console.log("Loaded !")
    }
    
    public asyncHideLoadingUI(promiseArray : Promise<any>[]) {
        Promise.all(promiseArray).then(() => {
            setTimeout(() => {
                this.hideLoadingUI();
            }, 1000);
        });

    }


}
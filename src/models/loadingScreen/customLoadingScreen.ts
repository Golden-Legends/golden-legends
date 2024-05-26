import { ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {
    //optional, but needed due to interface definitions
    public loadingUIBackgroundColor: string;

    constructor(public loadingUIText: string) {
        this.loadingUIBackgroundColor = "white";
    }

    public displayLoadingUI() {
        console.log("je charge l'ui");
        alert(this.loadingUIText);
    }
  
    public hideLoadingUI() {
      alert("Loaded!");
    }
  }
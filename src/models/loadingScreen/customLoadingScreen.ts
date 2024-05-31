import { ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {
    //optional, but needed due to interface definitions
    public loadingUIBackgroundColor: string;

    constructor(public loadingUIText: string) {
        this.loadingUIBackgroundColor = "black";
    }

    public displayLoadingUI() {
      console.log(performance.now());
      console.log("je charge l'ui");
      // alert(this.loadingUIText);
      document.getElementById("loading")!.classList.remove("hidden");
    }
  
    public hideLoadingUI() {
      console.log(performance.now());
      document.getElementById("loading")!.classList.add("hidden");
      console.log("tout est chargé");
    }
  }
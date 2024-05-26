export const BACK_URL = import.meta.env.VITE_BACKEND;

type Character = {
  name: string;
  path: string;
  pathGlb: string;
  description: string;
  enabled: boolean | string;
};

export let CHARACTERS: Character[] = [
  {
    name: "Seb",
    path: "1",
    pathGlb: "perso1.glb",
    description: "The best",
    enabled: true,
  },
  {
    name: "Adam",
    path: "7",
    pathGlb: "perso7.glb",
    description: "The best of the worst",
    enabled: true,
  },
  {
    name: "Nico",
    path: "3",
    pathGlb: "perso4.glb",
    description: "The middle",
    enabled: true,
  },
  {
    name: "Rémi",
    path: "4",
    pathGlb: "perso2.glb",
    description: "The worst of the worst",
    enabled: true,
  },
  {
    name: "Cédric",
    path: "5",
    pathGlb: "perso5.glb",
    description: "The best of the worst",
    enabled: "jeuSaut",
  },
  {
    name: "Chaimae",
    path: "6",
    pathGlb: "perso6.glb",
    description: "The best of the worst",
    enabled: "jeuSaut",
  },

  {
    name: "Théo",
    path: "2",
    pathGlb: "perso2.glb",
    description: "The worst",
    enabled: "jeuObjets",
  },
  {
    name: "Michel",
    path: "8",
    pathGlb: "perso8.glb",
    description: "The GOAT",
    enabled: "jeuObjets",
  },
];

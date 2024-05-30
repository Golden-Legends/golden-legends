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
    description: "Le mentor",
    enabled: true,
  },
  {
    name: "Michel",
    path: "7",
    pathGlb: "perso7.glb",
    description: "Le tryhardeur",
    enabled: true,
  },
  {
    name: "Cédric",
    path: "3",
    pathGlb: "perso4.glb",
    description: "Le toulousain",
    enabled: true,
  },
  {
    name: "David",
    path: "4",
    pathGlb: "perso2.glb",
    description: "Le créateur",
    enabled: true,
  },
  {
    name: "Nico",
    path: "8",
    pathGlb: "perso8.glb",
    description: "L'artiste",
    enabled: "jeuObjets",
  },
  {
    name: "Théo",
    path: "2",
    pathGlb: "perso3.glb",
    description: "Le techos",
    enabled: "jeuObjets",
  },
  {
    name: "Rem",
    path: "6",
    pathGlb: "perso6.glb",
    description: "L'architecte",
    enabled: "jeuSaut",
  },
  {
    name: "Johanna",
    path: "5",
    pathGlb: "perso5.glb",
    description: "La tricheuse",
    enabled: "jeuSaut",
  },
];

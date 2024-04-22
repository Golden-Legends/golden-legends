import { createStore } from 'vuex';
import { TBF_OBJECT } from './foundobjects/FoundObjectsContainer.vue';

let objects:TBF_OBJECT[] = [
    {
      name: "Ballon de basket",
      path: "ball",
      found: false,
    },
    {
      name: "Vélo",
      path: "bike",
      found: false,
    },
    {
      name: "Arc",
      path: "bow",
      found: false,
    },
    {
      name: "Gants de boxe",
      path: "gloves",
      found: false,
    },
    {
      name: "Haies",
      path: "hurdles",
      found: false,
    },
    {
      name: "Raquette de tennis",
      path: "racket",
      found: false,
    },
    {
      name: "Chaussures",
      path: "shoes",
      found: false,
    },
    {
      name: "Skateboard",
      path: "skate",
      found: false,
    },
];
  
// Create a new store instance.
export const storeObjects = createStore({
  state () {
    return {
      objects: objects
    }
  },
  mutations: {
    setObjects (state, value) {
      state.objects = value
    }
  }
})
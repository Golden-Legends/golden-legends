import { createStore } from 'vuex';
import { TBF_OBJECT } from './foundobjects/FoundObjectsContainer.vue';

let objects:TBF_OBJECT[] = [
    {
      name: "Basketball",
      path: "ball",
      found: false,
    },
    {
      name: "Bike",
      path: "bike",
      found: false,
    },
    {
      name: "Bow",
      path: "bow",
      found: false,
    },
    {
      name: "Boxing gloves",
      path: "gloves",
      found: false,
    },
    {
      name: "Hurdles",
      path: "hurdles",
      found: false,
    },
    {
      name: "Tennis racket",
      path: "racket",
      found: false,
    },
    {
      name: "Running shoes",
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
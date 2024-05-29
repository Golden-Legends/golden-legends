import { createStore } from 'vuex'
import { Result } from './results/ResultsContent.vue';

const results: Result[] = [

  { place: 1, name: "Sebastien", result: "10.12" },
  
  { place: 2, name: "Nicolas", result: "10.15" },
  
  { place: 3, name: "Théo", result: "10.20" },
  
  { place: 4, name: "Rémi", result: "10.25" },
  
  { place: 5, name: "John", result: "10.30" },
  
  { place: 6, name: "Doe", result: "10.35" },
  
  ];
  
// Create a new store instance.
export const store = createStore({
  state () {
    return {
      timer: 0,
      results: results,
      setSpeedBar0 : 0,
      setSpeedBar1 : 0,
      setSpeedBar2 : 0,
    }
  },
  mutations: {
    setTimer (state, value) {
      state.timer = value
    },
    setResults (state, value) {
      state.results = value
    },
    setSpeedBar0 (state, value) {
      state.setSpeedBar0 = value
    },
    setSpeedBar1 (state, value) {
      state.setSpeedBar1 = value
    },
    setSpeedBar2 (state, value) {
      state.setSpeedBar2 = value
    },
  }
})
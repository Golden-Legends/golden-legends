import { createStore } from 'vuex'
import { Result } from './results/ResultsContent.vue';

const results: Result = 
  { place: 1, name: "Sebastien", result: "10.12" };
  
// Create a new store instance.
export const storeJump = createStore({
  state () {
    return {
      timer: 0,
      results: results
    }
  },
  mutations: {
    setTimer (state, value) {
      state.timer = value
    },
    setResults (state, value) {
      state.results = value
    }
  }
})
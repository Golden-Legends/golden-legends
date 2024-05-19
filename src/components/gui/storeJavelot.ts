import { createStore } from 'vuex'
import { Result } from './results/ResultsContent.vue';

const results: Result[] = 
  [ {place: 1, name: "Sebastien", result: "0"}];
  
// Create a new store instance.
export const storeJavelot = createStore({
  state () {
    return {
      score: 0,
      results: results,
    }
  },
  mutations: {
    setScore (state, value) {
      state.score = value
    },
    setResults (state, value) {
      state.results = value
    }
  }
})
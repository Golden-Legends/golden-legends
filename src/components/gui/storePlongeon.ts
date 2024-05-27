import { createStore } from 'vuex'
import { Result } from './results/ResultsContent.vue';

export interface StatePlongeon { 
  score: number;
  results: Result[];
  letters: string[];
  lettersBooleanArray: string[];
  index: number;
}

const results: Result[] = 
  [ {place: 1, name: "Sebastien", result: "0"}];
  
// Create a new store instance.
export const storePlongeon = createStore<StatePlongeon>({
  state () {
    return {
      score: 0,
      results: results,
      letters: [],
      lettersBooleanArray: [],
      index : 0
    }
  },
  mutations: {
    setScore (state, value) {
      state.score = value
    },
    setResults (state, value) {
      state.results = value
    },
    setLetters (state, value){
      state.letters = value
    },
    setLettersBolleanArray (state, value){
      state.lettersBolleanArray = value
    },
    setIndex (state, value){
      state.index = value
    }
  }
})
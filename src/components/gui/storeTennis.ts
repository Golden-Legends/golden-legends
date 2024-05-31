import { createStore } from 'vuex'
import { Result } from './results/ResultsContent.vue';
import { set } from 'firebase/database';

const results: Result[] = 
  [ {place: 1, name: "Sebastien", result: "0"}];
  
// Create a new store instance.
export const storeTennis = createStore({
    state () {
        return {
            score: 0,
            scoreMultiJ1: 0,
            scoreMultiJ2: 0,
            results: results,
        }
    },
    mutations: {
        setScore (state, value) {
            state.score = value
        },
        setScoreMultiJ1 (state, value) {
            state.scoreMultiJ1 = value
        },
        setScoreMultiJ2 (state, value) {
            state.scoreMultiJ2 = value
        }, 
        setResults (state, value) {
        state.results = value
        },

    }
})
import { createStore } from "vuex";
import { Result } from "./results/ResultsContent.vue";

const results: Result[] = [{ place: 1, name: "Sebastien", result: "0" }];

// Create a new store instance.
export const storeBoxe = createStore({
  state() {
    return {
      score: 0,
      results: results,
      playable: false,
      timeout: 1500,
      timer: 30,
    };
  },
  mutations: {
    setScore(state, value) {
      state.score = value;
    },
    setResults(state, value) {
      state.results = value;
    },
    setPlayable(state, value) {
      state.playable = value;
    },
    setTimeout(state, value) {
      state.timeout = value;
    },
    resetTimer(state) {
      state.timer = 30;
    },
  },
});

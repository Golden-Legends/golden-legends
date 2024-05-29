import { createStore } from "vuex";
import { Result } from "./results/ResultsContent.vue";

const results: Result[] = [{ place: 1, name: "Sebastien", result: "0" }];

// Create a new store instance.
export const storeJavelot = createStore({
  state() {
    return {
      score: 0,
      results: results,
      speedBar: 0,
      speedBarPlayable: false,
      playable: false,
      angle: 0,
      angleSpeed: 0,
    };
  },
  mutations: {
    setScore(state, value) {
      state.score = value;
    },
    setResults(state, value) {
      state.results = value;
    },
    setSpeedBar(state, value) {
      state.speedBar = value;
    },
    setPlayable(state, value) {
      state.playable = value;
    },
    setAngle(state, value) {
      state.angle = value;
    },
    setSpeedBarPlayable(state, value) {
      state.speedBarPlayable = value;
    },
    setAngleSpeed(state, value) {
      state.angleSpeed = value;
    },
  },
});

import { createStore } from 'vuex'

// Create a new store instance.
export const store = createStore({
  state () {
    return {
      timer: 0
    }
  },
  mutations: {
    setTimer (state, value) {
      state.timer = value
    }
  }
})
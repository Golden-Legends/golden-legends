import { createStore } from 'vuex'
  
// Create a new store instance.
export const storeOnboard = createStore({
  state () {
    return {
      debut: false
    }
  },
  mutations: {
    setDebut (state, value) {
      state.debut = value
    }
  }
})
import { createStore } from 'vuex'
  
// Create a new store instance.
export const storeSound = createStore({
  state () {
    return {
      sound: 50,
      oldSound: 50,
      etat: false
    }
  },
  mutations: {
    setSound (state, value) {
        state.oldSound = state.sound
        state.sound = value
    },
  }
})
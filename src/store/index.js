import Vue from 'vue'
import Vuex from 'vuex'

//Modules
import Auth from './modules/Auth.js'
import Recipes from './modules/Recipes.js'
import Reviews from './modules/Reviews.js'
import Favorites from './modules/Favorites.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    //modules names here
    Auth,
    Recipes,
    Reviews,
    Favorites
  }
})

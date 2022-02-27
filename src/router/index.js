import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../components/About.vue'
import AddRecipe from '../components/AddRecipe.vue'
import EditRecipe from '../components/EditRecipe.vue'
import Favorites from '../components/Favorites.vue'
import Login from '../components/Login.vue'
import MyRecipes from '../components/MyRecipes.vue'
import Page404 from '../components/Page404.vue'
import Recipes from '../components/Recipes.vue'
import Register from '../components/Register.vue'
import ShowRecipe from '../components/ShowRecipe.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => { //this adds navigation rules to routers
      window.scrollTo(0,0); //this will position page scroll to the very top
      if (sessionStorage.getItem("user-session") != null) {
          history.back()
      }
      else {
          next()
      }
  } 
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => { //this adds navigation rupgles to routers
      window.scrollTo(0,0); //this will position page scroll to the very top
      if (sessionStorage.getItem("user-session") != null) {
          history.back()
      }
      else {
          next()
      }
  } 
  },
  {
    path: '/',
    name: 'Recipes',
    component: Recipes
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/recipe/:slug', //Using the slug props parameter
    name: 'ShowRecipe',
    component: ShowRecipe,
    props: true, //enabling props
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/add-recipe',
    name: 'AddRecipe',
    component: AddRecipe
  },
  {
    path: '/edit-recipe/:slug', //Using the slug props parameter
    name: 'EditRecipe',
    component: EditRecipe,
    props: true, //enabling props
  },
  {
    path: '/my-recipes',
    name: 'MyRecipes',
    component: MyRecipes
  },
  { path: '/404', name: 'Page404', component: Page404 },
  { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

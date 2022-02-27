<template>
  <v-container>
    <v-card class="mt-5" max-height="auto">
      <v-card-title>
        <v-icon color="purple">
          mdi-cookie
        </v-icon>
        &nbsp;My Recipes
      </v-card-title>
      <v-card-text v-if="this.getRecipeResponse != 'none' && this.getStateRecipes != null">
        <v-list three-line>
          <template v-for="(item, index) in this.getStateRecipes">
            <v-tooltip :key="index" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  :key="index"
                  v-bind="attrs"
                  v-on="on"
                  @click="showRecipe(item.id, item.name)"
                  link
                >
                  <v-list-item-avatar>
                    <v-img 
                    lazy-src="https://picsum.photos/id/11/500/300"
                    src="https://picsum.photos/id/11/500/300">
                     </v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-bold"
                      v-html="item.name"
                    ></v-list-item-title>
                    {{item.rating}}
                    <v-list-item-subtitle
                      v-html="item.description"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider :inset="true"></v-divider>
              </template>
              <span>View</span>
            </v-tooltip>
          </template>
          
        </v-list>
      </v-card-text>
       <v-card-text v-else>
            No Recipes Found.
        </v-card-text>
      <v-container class="text-center">
        <v-pagination 
        v-model="pagination.current"
        :length="pagination.total"
        @input="next"
        circle>
        </v-pagination>
      </v-container>
    </v-card>
      <v-dialog
        v-model="diaload"
        persistent
        width="300"
      >
        <v-card color="green" dark>
          <v-card-text>
            Loading content, please wait...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>

         
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
var CryptoJS = require("crypto-js");
export default {
  data: () => ({
    pagination: [],
    diaload: true,
  }),
  methods:{
    next(page){
       this.getMyRecipePage(page);
       this.diaload = true
    },
     showRecipe(id, name){
       var nospaces = name.replace(/[\W_]+/g, '-') //replaces all non alphanumeric characters with a dash
      var slug = nospaces+'-'+id
      if (sessionStorage.getItem("recipe-session") != null) {
          sessionStorage.removeItem("recipe-session");
      }
      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(slug), 'recipe-slug-SCQxTgCEWWhaXiEGmoevb').toString(); //encrypting recipe slug and saving it to session
      sessionStorage.setItem('recipe-session', encrypted)
      
      if (sessionStorage.getItem("recipe-session") != null) {
        this.diaload = true
        this.$router.push({name:'ShowRecipe', params: {slug: slug}}) //passing slug props to route
      }
    },
    ...mapActions({
      getMyRecipes: "getMyRecipes",
      getMyRecipePage: 'getMyRecipePage'
    }),
  },
  computed:{
    ...mapGetters({
      getStateRecipes: 'getStateRecipes',
      getRecipeResponse: 'getRecipeResponse',
      getRecipePagination: 'getRecipePagination'
    })
  },
  watch:{
    getStateRecipes: function() {
      //listeing to changes in a vuex state
      if (this.getStateRecipes != "" && this.getStateRecipes != null) {
        this.pagination = this.getRecipePagination
        this.diaload = false
      }
    },
     getRecipeResponse: function() {
       console.log(this.getRecipeResponse)
      //listeing to changes in a vuex state
      if (this.getRecipeResponse == "none") {
        this.diaload = false
      }
    },
  },
  mounted(){
    this.getMyRecipes()
  }
};
</script>

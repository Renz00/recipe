<template>
  <div>
    <v-sheet
      class="mx-auto my-5 rounded-xl"
      elevation="2"
      max-height="auto"
      max-width="600"
    >
    <v-row class="justify-center">
       <v-slide-group v-model="model" class="pa-4" center-active show-arrows>
        <v-slide-item v-for="(item, index) in categories" :key="index">
          <v-card
            :color="item.active ? 'blue' : '#8F2F3C'"
            class="ma-4"
            height="100"
            width="100"
            @click="gotoCategory(item.name, index)"
          >
            <v-img
              lazy-src="https://picsum.photos/200/300"
              src="https://picsum.photos/200/300"
              max-height="75"
              max-width="100"
            ></v-img>
            <p
              class="text-center"
              :class="item.active ? 'white--text' : 'white--text'"
            >
              {{ item.name }}
            </p>
          </v-card>
        </v-slide-item>
      </v-slide-group>
      </v-row>
      <v-row class="mx-10">
        <v-col cols="auto"></v-col>
        <v-col cols="4">
           <v-select
           v-model = 'filterRating'
          :items="ratings"
          label="Filter by Rating"
          solo
          dense
        ></v-select>
        </v-col>
        <v-col>
        <!-- To use autocomplete you need an items array, filter method with logic, and item-text for the text display -->
          <v-autocomplete
          v-model = "searchText"
          :items="filterRecipes"
          :filter="searchFilter" 
          item-text="name"
          label="Search..."
          @click="loadSearchAutocomplete()"
          :loading="autocompleteLoading"
          auto-select-first
          solo
          dense
          clearable
        ></v-autocomplete>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="gotoFilter()" color="orange darken-2" elevation="2" icon
            ><v-icon color="orange darken-2">mdi-magnify</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-sheet>
    <v-row class="my-15" justify="space-between" align="center" v-if="this.getStateRecipes == null || this.getStateRecipes == '' && this.diaload == false">
        <v-col>
          No Recipes Found.
        </v-col>
    </v-row>
    <v-row class="my-2" v-else>
      <v-col align="center" class="mb-2" cols="4" v-for="item in this.getStateRecipes" :key="item.id">
        <v-card class="rounded-xl" height="auto" width="250">
          <v-img :lazy-src="item.image_url" :src="item.image_url" max-height="170" max-width="300"></v-img>
          <h4 class="my-2">
            {{ item.name }}
          </h4>
          <div class="mb-2">
            <div v-if="item.rating > 0">
               <span v-for="n in item.rating" :key="n">
              <v-icon color="yellow">mdi-star</v-icon>
            </span>
            </div>
            <div v-else>
              <small><em>No Reviews.</em></small>
            </div>
          
          </div>
          <v-divider class="mx-5"></v-divider>
          <v-card-text>
            {{ item.description }}
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col></v-col>
              <v-col class="text-right">
                <v-btn @click="show(item.id, item.name)" text right>
                  View
                  <v-icon>
                    mdi-menu-right
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-container class="text-center">
       <v-pagination
        v-model="pagination.current"
        :length="pagination.total"
        @input="next"
    ></v-pagination>
    </v-container>
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
var CryptoJS = require("crypto-js");
export default {
  name: "Recipes",
  data: () => ({
    props: ["slug"], //defining a slug variable for url
    model: null,
    autocompleteLoading: false,
    searchText:'',
    filterRating:'',
    category_name:'',
    pagination: [],
    currentCategory:'',
    currentCategoryIndex:'',
    filterRecipes:[],
    categories:[
      { name:'Dessert', active: false },
      { name:'Main Dish', active: false },
      { name:'Appetizer', active: false },
      { name:'Beverage', active: false }
    ],
     ratings:[
      'No Filter',
      '5 stars',
      '4 stars', 
      '3 stars',
      '2 stars',
      '1 star',
    ],
    diaload: true
  }),
  methods: {
    show(id, name) {
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
    searchFilter (item, queryText, itemText) {
    const name = item.name.toLowerCase()
    const category = item.category.toLowerCase()
    const searchText = queryText.toLowerCase()

    return name.indexOf(searchText) > -1 ||
      category.indexOf(searchText) > -1
  },
  loadSearchAutocomplete(){
    this.autocompleteLoading = true
    this.getFilterRecipes()
  },
    next(page){
      if (this.category_name != ''){
        var name = this.category_name
        this.getcategoryPage({name, page});
      }
      else if (this.searchText != '' || this.filterRating != ''){
        if (this.filterRating == ''){
          this.filterRating = 'No Filter'
        }
        var filterobj = {
          category:'',
          searchText:'',
          rating:'',
          page: page
        }
        if (this.currentCategory != ''){
          filterobj.category = this.currentCategory
        }
        filterobj.searchText = this.searchText
        filterobj.rating = this.filterRating
        this.getFilterPage(filterobj)
      }
      else {
         this.getRecipePage(page);
      }
      this.diaload = true
    },
    gotoCategory(name, index){
      if (this.currentCategory != name){
        this.currentCategory = name
        this.currentCategoryIndex = index
        this.categories.map(function (value, key) {
        value.active = false
        });
        this.categories[index].active = true
        if (this.searchText != '' && this.filterRating != ''){ //when there are filter options, redirect to filter method
          this.gotoFilter()
        }
        else {
          this.category_name = name.split(' ').join('-')
          this.getCategory(this.category_name)
        }
      }
      else {
        this.categories[index].active = false
        this.currentCategory = ''
        this.category_name = ''
        this.getRecipes()
      }
      
    },
    gotoFilter(){
      if (this.searchText != '' || this.filterRating != ''){
        if (this.filterRating == ''){
          this.filterRating = 'No Filter'
        }

        var filterobj = {
          category:'',
          searchText:'',
          rating:''
        }
        if (this.currentCategory != ''){
          filterobj.category = this.currentCategory
        }
      
        filterobj.searchText = this.searchText
        filterobj.rating = this.filterRating
        this.getFilter(filterobj)
      }
    },
    ...mapActions({
      getRecipes: "getRecipes",
      getRecipePage: "getRecipePage",
      showRecipe: "showRecipe",
      getCategory: 'getCategory',
      getCategoryPage: 'getCategoryPage',
      getFilter: 'getFilter',
      getFilterPage: 'getFilterPage',
      getFilterRecipes: 'getFilterRecipes'
    }),
  },
  computed: {
    ...mapGetters({
      getStateRecipes: "getStateRecipes",
      getRecipeResponse: "getRecipeResponse",
      getRecipePagination: "getRecipePagination",
      getStateFilterRecipes: 'getStateFilterRecipes'
    })
  },
  watch: {
    getStateRecipes: function() {
      //listeing to changes in a vuex state
      if (this.getStateRecipes != "" && this.getStateRecipes != null) {
        this.pagination = this.getRecipePagination
        this.diaload = false
      }
    },
    getStateFilterRecipes: function() {
      //listeing to changes in a vuex state
      if (this.getStateFilterRecipes != "" && this.getStateFilterRecipes != null) {
        this.filterRecipes = this.getStateFilterRecipes
        this.autocompleteLoading = false
      }
    }
  },
  mounted(){
    this.getRecipes()
  }
  
}
</script>

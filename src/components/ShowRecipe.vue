<template>
  <div class="my-5">
    <!-- Edit review modal -->
     <v-dialog
      v-model="editModal"
      style="position:relative;"
      width="500"
      persistent
    >
      <v-card :loading="loading">
        <v-card-title class="text-h5 grey lighten-2">
          <v-btn color="red" @click="editModal = false" large icon>
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
          Edit Review
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="mx-5 mt-5">
              <v-col>
                <v-textarea
                 v-model="editData.content"
                  :rules="contentRules"
                  :loading="loading"
                  solo
                  rows="2"
                  name="input-7-4"
                  label="Write a review..."
                ></v-textarea>
                <p>Rating:</p>
                <v-rating
                v-model="editData.rating"
                  color="yellow"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  hover
                  size="28"
                ></v-rating>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="edit()"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit Recipe Modal -->
     <v-dialog
      v-model="editRecipeModal"
      persistent
      max-width="600px"
    >
      <v-sheet color="white" elevation="2" height="auto" width="auto">
          <v-container class="my-5">
            <v-row>
              <v-col cols="auto">
                <v-btn
                  color="purple"
                  @click="editRecipeModal = false"
                  outlined
                  large
                  icon
                  ><v-icon color="purple">mdi-close</v-icon></v-btn
                >
              </v-col>
              <v-col>
                <h2>
                  Edit Recipe
                </h2>
              </v-col>
            </v-row>
            <v-form ref="editRecipeForm" v-model="valid" lazy-validation>
              <v-divider class="my-3"></v-divider>
              <div class="mx-15 mt-5">
               <v-file-input
                v-model="editRecipeData.image"
                  label="Recipe Image"
                  :rules="compImageRules"
                  accept="image/png, image/jpeg, image/bmp"
                  @change="onFileChange"
                  show-size
                  outlined
                  prepend-icon="mdi-camera"
                ></v-file-input>
                <v-text-field
                  v-model="editRecipeData.name"
                  :rules="nameRules"
                  label="Recipe Name"
                  outlined
                ></v-text-field>
                
                <v-select
                v-model="editRecipeData.category"
                  :items="categories"
                  :rules="[(v) => !!v || 'Category is required']"
                  label="Category"
                  outlined
                ></v-select>
                <v-textarea
                  outlined
                  v-model="editRecipeData.description"
                  :rules="desciptionRules"
                  counter="500"
                  label="Description"
                  rows="2"
                ></v-textarea>
                  <v-text-field
                  v-model="editRecipeData.servings"
                  :rules="servingsRules"
                  type="number"
                  label="Servings Amount"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="ing_name"
                  :rules="ingnameRules"
                  label="Ingredient Name"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="ing_amount"
                  label="Ingredient Amount"
                  outlined
                ></v-text-field>
                <v-btn color="primary" @click="addIngredient" large outlined
                  ><v-icon>mdi-plus-thick</v-icon> Add Ingredient</v-btn
                >
                <v-sheet
                  class="my-5"
                  color="white"
                  elevation="1"
                  max-height="auto"
                  max-width="auto"
                >
                  <v-list dense>
                    <span style="color:grey;" class="mx-2">Ingredients:</span>
                    <v-list-item
                      v-for="(ingredient, index) in editRecipeData.ingredients"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-row>
                          <v-col
                            ><p class="mt-2">{{ ingredient.ingredient_name }}</p></v-col
                          >
                          <v-col
                            ><p class="mt-2">{{ ingredient.ingredient_amount }}</p></v-col
                          >
                          <v-col cols="2">
                            <v-btn
                              color="red"
                              @click="removeIngredient(index)"
                              outlined
                              icon
                              ><v-icon color="red">mdi-delete</v-icon></v-btn
                            >
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-sheet>
                <v-text-field
                  v-model="step_number"
                  :rules="stepnumRules"
                  label="Step Number"
                  type="number"
                  outlined
                ></v-text-field>

                <v-textarea
                  outlined
                  v-model="step_content"
                  :rules="stepconRules"
                  counter="800"
                  label="Content"
                  rows="3"
                ></v-textarea>

                <v-btn color="primary" @click="addStep" large outlined
                  ><v-icon>mdi-plus-thick</v-icon> Add Step</v-btn
                >

                <v-sheet
                  class="my-5"
                  color="white"
                  elevation="1"
                  max-height="auto"
                  max-width="auto"
                >
                  <v-list dense>
                    <span style="color:grey;" class="mx-2">Steps:</span>
                    <v-list-item
                      v-for="(step, index) in editRecipeData.steps"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-row>
                          <v-col cols="auto"
                            ><p class="mt-2 font-weight-bold">
                              {{ step.steps_count }}
                            </p></v-col
                          >
                          <v-col
                            ><p class="mt-2">{{ step.steps_description }}</p></v-col
                          >
                          <v-col cols="2">
                            <v-btn color="red" @click="removeStep" outlined icon
                              ><v-icon color="red">mdi-delete</v-icon></v-btn
                            >
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-sheet>
                <v-alert
                  v-model="alert"
                  dense
                  outlined
                  class="mx-2"
                  type="error"
                  ><v-icon large color="white">
                    mdi-warning-circle
                  </v-icon>
                  <span class="text-center">
                    Please add at least 1 item to Steps and Ingredients.
                  </span>
                </v-alert>
                <v-divider class="my-3"></v-divider>
                <div class="text-center">
                  <v-btn color="green darken-2" @click="editRecipe(recipe[0].id)" :loading='loading' dark block
                    ><v-icon>mdi-arrow-right-bold-box-outline</v-icon>
                    Submit</v-btn
                  >
                </div>
              </div>
            </v-form>
          </v-container>
        </v-sheet>
    </v-dialog>
    <div v-if="diaload == false && this.recipe[0] != null">
      <v-row>
        <v-col>
          <h1>{{ this.recipe[0].name }}</h1>
          <h3>{{ this.recipe[0].category }}</h3>
          <div v-if="this.rating != 0">
            <span v-for="n in this.rating" :key="n">
              <v-icon color="yellow">mdi-star</v-icon>
            </span>
          </div>
          <div v-else>
            <span>No Reviews.</span>
          </div>

          <p class="mt-2" style="color:gray;">
            Created By:
            {{ this.recipe[0].firstname + " " + this.recipe[0].lastname }} |
            Date: {{ this.recipe[0].updated_at }}
          </p>
        </v-col>
        <v-col class="text-right">
          <v-btn
            class="mt-2"
            color="purple"
            @click="addFavorite(recipe[0].id)"
            :loading="fav_loading"
            outlined
            light
            large
            v-if="user_id != this.recipe[0].user_id && this.fav_status == false"
          >
            <p class="mt-4 purple--text">Favorite</p>
            <v-icon color="purple">mdi-heart</v-icon></v-btn
          >
           <v-btn
            class="mt-2"
            color="purple"
            @click="addFavorite(recipe[0].id)"
            :loading="fav_loading"
            large
            v-if="user_id != this.recipe[0].user_id && this.fav_status == true"
          >
            <p class="mt-4 white--text">Remove</p>
            <v-icon color="white">mdi-heart</v-icon></v-btn
          >
          &nbsp;
          <v-btn @click="editRecipeModal = true" class="mt-2" color="blue" outlined light large v-if="user_id == this.recipe[0].user_id">
            <p class="mt-4 blue--text">Edit</p>
            <v-icon color="blue">mdi-pencil</v-icon></v-btn
          >
          &nbsp;
          <v-btn @click="destroy(recipe[0].id)" class="mt-2" color="red" outlined light large v-if="user_id == this.recipe[0].user_id">
            <p class="mt-4 red--text">Delete</p>
            <v-icon color="red">mdi-trash-can</v-icon></v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <p style="text-align:justify;">
        {{ this.recipe[0].description }}
      </p>
      <v-row>
        <v-col cols="auto">
          <v-img
            width="780"
            :lazy-src="this.recipe[0].image_url"
            :src="this.recipe[0].image_url"
            max-height="600"
            max-width="800"
          >
            <!-- <v-tooltip bottom v-if="user_id == this.recipe[0].user_id">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="2"
                  class="mb-10"
                  color="blue"
                  v-bind="attrs"
                  v-on="on"
                  dark
                  fab
                  absolute
                  bottom
                  right
                >
                  <v-icon>mdi-image-edit</v-icon>
                </v-btn>
              </template>
              <span>Change Image</span>
            </v-tooltip> -->

            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="black"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col align="center" justify="center">
          <v-card height="auto">
            <v-row>
              <v-col>
                <v-card-title>
                  Ingredients
                </v-card-title>
              </v-col>
              <v-col>
                <p class="mt-5 blue--text">
                  <b>Servings: {{ this.recipe[0].servings }}</b>
                </p>
              </v-col>
            </v-row>

            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in ingredients" :key="index">
                      <td>{{ item.ingredient_name }}</td>
                      <td>{{ item.ingredient_amount }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-sheet
        class="mt-5"
        color="white"
        elevation="2"
        height="auto"
        width="auto"
      >
        <v-list-item three-line v-for="(item, index) in steps" :key="index">
          <v-list-item-avatar>
            <v-icon>mdi-star</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.steps_count }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ item.steps_description }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-sheet>
      <v-card class="mt-5" max-height="auto">
        <v-card-title>
          Reviews
        </v-card-title>
        <v-card-text v-if="user_id != '' && user_id != null">
          <v-form ref="form" v-model="valid" lazy-validation>
          <v-sheet color="white" height="auto" width="auto">
            <v-row class="mx-5">
              <v-col>
                <v-textarea
                 v-model="formData.content"
                  :rules="contentRules"
                  :loading="loading"
                  solo
                  rows="2"
                  name="input-7-4"
                  label="Write a review..."
                ></v-textarea>
                <p>Rating:</p>
                <v-rating
                v-model="formData.rating"
                  color="yellow"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  hover
                  size="28"
                ></v-rating>
              </v-col>
              <v-col cols="auto" class="text-left">
                <v-btn class="mt-4" @click="add()" :loading="loading" :disabled="loading" >Send</v-btn>
              </v-col>
            </v-row>
          </v-sheet>
          </v-form>
        </v-card-text>
        <v-card-text>
          <v-list three-line v-if="this.reviews != null && this.reviews != ''">
            <template v-for="(item, index) in reviews">
              <v-divider class="mx-5" :key="item.updated_at"></v-divider>
              <v-list-item :key="index">
                <v-list-item-avatar>
                  <v-img src="https://i.pravatar.cc/300"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-row>
                    <v-col v-if="!editModal">
                      <v-list-item-title>{{ item.firstname+' '+item.lastname+' | ' }}
                        <span v-for="ctr in item.rating" :key="ctr">
                          <v-icon color="grey">
                            mdi-star
                          </v-icon>
                        </span>
                      </v-list-item-title>
                  <v-list-item-subtitle
                    v-html="item.description"
                  ></v-list-item-subtitle>
                    </v-col>
                    <v-col cols="2" v-if="user_id == item.user_id">
                      <v-btn @click="editModalSwitch(item)" color="blue" outlined small icon>
                        <v-icon>
                          mdi-pencil
                        </v-icon>
                      </v-btn>
                      &nbsp;
                      <v-btn @click="remove(item.id)" color="red" outlined small icon>
                         <v-icon>
                          mdi-trash-can
                        </v-icon>
                      </v-btn>

                    </v-col>
                    <v-col cols="auto">
                       <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="purple" @click="like(item.id)" v-bind="attrs" v-on="on" small icon>
                              <v-icon v-if="isLiked[item.id] == user_id">mdi-thumb-up</v-icon>
                              <v-icon v-else>mdi-thumb-up-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Like Review</span>
                      </v-tooltip>
                      <small>{{ item.likes }}</small>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
          <span v-else> No Reviews.</span>
        </v-card-text>
           <v-container class="text-center">
       <v-pagination
         v-model="pagination.current"
        :length="pagination.total"
        @input="next"
    ></v-pagination>
    </v-container>
      </v-card>
    </div>
    <v-dialog v-model="diaload" persistent width="300">
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
import { mapActions, mapGetters, mapMutations } from "vuex";
var CryptoJS = require("crypto-js");
export default {
  data: () => ({
    formData :{
      recipe_id:'',
      content:'',
      rating: 4
    },
    editData :{
      recipe_id:'',
      review_id:'',
      content:'',
      rating: 4
    },
    likeData: {
      id:'',
      recipe_id:''
    },
    recipe_image_url: '',
    pagination: [],
    noFile: '',
    alert: false, 
    likestatus: false,
    isLiked: [],
    fav_status: '',
    fav_loading: true,
    editModal: false,
    editRecipeModal: false,
    diaload: true,
    loading:false,
    valid:true,
    user_id: '',
    recipe: [],
    steps: [],
    ingredients: [],
    reviews: [],
    ing_name: "",
    ing_amount: "",
    step_number: "",
    step_content: "",
    editRecipeData: {
      recipe_id :'',
      name: "",
      description: "",
      category:"",
      servings:'',
      image:[],
      steps: [],
      ingredients: [],
    },
    categories:[
      'Dessert',
      'Main Dish',
      'Appetizer',
      'Beverage'
    ],
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 300 || "Name must be less than 300 characters",
    ],
    desciptionRules: [
      (v) => !!v || "Description is required",
      (v) => v.length <= 500 || "Description must be less than 500 characters",
    ],
    servingsRules: [
      (v) => !!v || "Servings is required",
      (v) => !isNaN(v) || "Servings must be a number",
    ],
    imageRules: [
      v => v.size < 2000000 || 'Size should be less than 2 MB!',
    ],
    ingnameRules: [
      (v) => v.length <= 100 || "Name must be less than 100 characters",
    ],
     stepnumRules: [
      (v) => !isNaN(v) || "Step Number must be a number",
    ],
    stepconRules: [
      (v) => v.length <= 800 || "Content must be less than 800 characters",
    ],
    contentRules: [
      (v) => !!v || "Content is required",
      (v) => v.length <= 1500 || "Content must be less than 1500 characters",
    ],
  }),
  methods: {
    next(page){
      var pageobj = {
        user_id: this.user_id,
        recipe_id: this.formData.recipe_id,
        page: page
      } //creating an object to send to api for page navigation
      this.getReviewsPage(pageobj)
    },
    add(){
       this.loading = true
      if (this.$refs.form.validate() == true) {
        this.addReview(this.formData);
        this.getReviews({'recipe_id': this.formData.recipe_id, 'user_id': this.user_id});
        this.formData.content = ''
        this.$refs.form.resetValidation()
      }
      else {
        this.loading = false
      }
    },
    edit(){
      this.loading = true
      if (this.$refs.form.validate() == true) {
        this.$refs.form.resetValidation()
        this.updateReview(this.editData);
        this.getReviews({'recipe_id': this.editData.recipe_id, 'user_id': this.user_id});
        this.editModal = false
      }
      else {
        this.loading = false
      }
    },
    destroy(id){
      this.diaload = true
      this.destroyRecipe(id)
      if (sessionStorage.getItem("recipe-session") != null) {
        sessionStorage.removeItem("recipe-session"); 
      }
      this.$router.push({name:'Recipes'})
    },
    like(id){
      if (this.user_id != ''){
        this.likeData.id = id
        this.likeData.recipe_id = this.formData.recipe_id
        this.updateLikes(this.likeData)
        this.getReviews({'recipe_id': this.formData.recipe_id, 'user_id': this.user_id});
      }
    },
    editModalSwitch(item){
      this.editModal = true
      this.editData.review_id = item.id
      this.editData.recipe_id = this.formData.recipe_id
      this.editData.content = item.description
      this.editData.rating = item.rating
    },
    remove(id){
      this.deleteReview(id)
      this.getReviews({'recipe_id': this.formData.recipe_id, 'user_id': this.user_id});
    },
    editRecipe(id) {
      this.loading = true
      this.diaload = true
      if (this.$refs.editRecipeForm.validate() == true) {
        if (this.editRecipeData.steps.length > 0 && this.editRecipeData.ingredients.length > 0) {
          this.alert = false;
          this.editRecipeData.recipe_id = id
          this.updateRecipe(this.editRecipeData);
          this.editRecipeModal = false
        } 
        else {
          this.loading = false
          this.alert = true;
        }
      }
      else {
        this.loading = false
      }
    },
     onFileChange(event){ // to check if there is a file selected
      if (event != null){
        this.noFile = false
      }
      else {
        this.noFile = true
      }
    },
    addStep() {
      if (this.step_number != "" && this.step_content != "") {
        this.editRecipeData.steps.push({
          steps_count: this.step_number,
          steps_description: this.step_content,
        });
        this.valid = true;
        this.step_number = "";
        this.step_content = "";
      }
    },
    addIngredient() {
      if (this.ing_name != "" && this.ing_amount != "") {
        this.editRecipeData.ingredients.push({
          ingredient_name: this.ing_name,
          ingredient_amount: this.ing_amount,
        });
        this.valid = true;
        this.ing_name = "";
        this.ing_amount = "";
      }
    },
    removeStep(index) {
      this.editRecipeData.steps.splice(index, 1); //Removes the list item
      if (this.editRecipeData.steps.length == 0) {
        //if list is empty the form is invalid
        this.valid = false;
      }
    },
    removeIngredient(index) {
      this.editRecipeData.ingredients.splice(index, 1); //Removes the list item
      if (this.editRecipeData.ingredients.length == 0) {
        //if list is empty the form is invalid
        this.valid = false;
      }
    },
    addFavorite(recipe_id){
      this.fav_loading = true
      var favData = {
        recipe_id: recipe_id,
        user_id: this.user_id
      }
      this.addFavorites(favData)
      this.checkFav(favData);
    },
    ...mapActions({
      showRecipe: "showRecipe",
      getReviews: "getReviews",
      addReview: "addReview",
      deleteReview: "deleteReview",
      updateReview:"updateReview",
      updateLikes:"updateLikes",
      updateRecipe: 'updateRecipe',
      destroyRecipe: 'destroyRecipe',
      addFavorites: 'addFavorites',
      checkFav: 'checkFav',
      getReviewsPage: 'getReviewsPage'
    }),
    ...mapMutations({
      clearRecipeResponse: "clearRecipeResponse",
    }),
  },
  computed: {
    ...mapGetters({
      getStateSelectedRecipe: "getStateSelectedRecipe",
      getRecipeResponse: 'getRecipeResponse',
      getStateSteps: "getStateSteps",
      getStateReviews: "getStateReviews",
      getStateIngredients: "getStateIngredients",
      getStateRating: "getStateRating",
      getReviewResponse: "getReviewResponse",
      getStateLikes: 'getStateLikes',
      getFavStatus: 'getFavStatus',
      getReviewsPagination: 'getReviewsPagination',
    }),
    compImageRules: function(){ // adds image rules only when there is a file selected
      return this.noFile == false ? this.imageRules : [] //if there is not file selected, no image rules will be set.
    }
  },
  watch: {
    getStateSelectedRecipe: function() {
      //listeing to changes in a vuex state
      if (this.getStateSelectedRecipe != "" && this.getStateSelectedRecipe != null) {
        this.recipe = this.getStateSelectedRecipe;
        this.formData.recipe_id = this.recipe[0].id //pagination is using this data for page navigation
        if (this.user_id != ''){// checking if recipe is favorited by current user
          var checkFavObj = {
            user_id: this.user_id,
            recipe_id: this.recipe[0].id
          }
          this.checkFav(checkFavObj);
        }
        //for Edit Recipe modal form
        this.noFile = this.recipe[0].image != 'noimage.png' ? true : false //using ternary operator to check if recipe has an uploaded image
        this.editRecipeData.name = this.recipe[0].name
        this.editRecipeData.description = this.recipe[0].description
        this.editRecipeData.category = this.recipe[0].category
        this.editRecipeData.servings = this.recipe[0].servings
        
        var self = this
        this.getStateSteps.map(function(value) { // mapping the steps to local variable
            self.editRecipeData.steps.push(value);
        });
        this.getStateIngredients.map(function(value) {
            self.editRecipeData.ingredients.push(value);
        });

        this.steps = this.getStateSteps;
        this.ingredients = this.getStateIngredients;
        this.rating = this.getStateRating;
      
        this.getReviews({'recipe_id': this.formData.recipe_id, 'user_id': this.user_id});
        this.diaload = false; 
      }
    },
    getRecipeResponse: function() {
      if (this.getRecipeResponse == 'deleted-recipe'){
        this.$router.push({name:'Recipes'})
      }
      else if (this.getRecipeResponse == 'updated-recipe'){
        this.editRecipeData.image = []
        this.editRecipeData.steps = []
        this.editRecipeData.ingredients = []
        this.recipe = []
        this.reviews = []
        this.loading = false
        this.showRecipe();
      }
    },
    getFavStatus: function() {
      this.fav_status = this.getFavStatus
      this.fav_loading = false
    },
    getReviewResponse: function() {
      if (this.getReviewResponse == 'none'){
        this.reviews = []
      }
    },
    getStateReviews: function() {
      //listeing to changes in a vuex state
      if (this.getStateReviews != "" && this.getStateReviews != null) {
        this.reviews = []
        this.isLiked = []
        this.pagination = this.getReviewsPagination
        this.reviews = this.getStateReviews
        this.likes = this.getStateLikes
        if (this.likes != null && this.likes != ''){//this is for changing the like icon when a review is liked or unliked
          var self = this 
            this.likes.map(function (value, key) {
            self.isLiked[value.review_id] = value.user_id // placing all of the likes of current user in an array for reviews
            // this will be used to determine which review has been liked by the current user.
          });
        }
        this.diaload = false
        this.loading = false
        this.likeloading = false
      }
    },
  },
  mounted() {
    this.showRecipe();
    if (sessionStorage.getItem("user-session") != null) {
      this.logged_in = true;
      this.userdata = JSON.parse(
        CryptoJS.AES.decrypt(
          sessionStorage.getItem("user-session"),
          "Gb3jzkjk8ubBtRT7fLR5"
        ).toString(CryptoJS.enc.Utf8)
      );
      this.user_id = this.userdata.user.id;
    }
    else {
      this.fav_loading = false
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   if (sessionStorage.getItem("recipe-session") != null) {
  //     sessionStorage.removeItem("recipe-session");
  //   }
  //   next();
  // },
};
</script>

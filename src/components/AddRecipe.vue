<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet color="white" elevation="2" height="auto" width="auto">
          <v-container class="my-5">
            <v-row>
              <v-col cols="auto">
                <v-btn
                  color="purple"
                  @click="$router.go(-1)"
                  outlined
                  large
                  icon
                  ><v-icon color="purple">mdi-arrow-left</v-icon></v-btn
                >
              </v-col>
              <v-col>
                <h2>
                  Create Recipe
                </h2>
              </v-col>
            </v-row>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-divider class="my-3"></v-divider>
              <div class="mx-15 mt-5">
                <v-file-input
                v-model="formData.image"
                  label="Recipe Image"
                  :rules="compImageRules"
                  accept="image/png, image/jpeg, image/bmp"
                  @change="onFileChange"
                  show-size
                  outlined
                  prepend-icon="mdi-camera"
                ></v-file-input>
                <v-text-field
                  v-model="formData.name"
                  :rules="nameRules"
                  label="Recipe Name"
                  outlined
                ></v-text-field>
                
                <v-select
                v-model="formData.category"
                  :items="categories"
                  :rules="[(v) => !!v || 'Category is required']"
                  label="Category"
                  outlined
                ></v-select>
                <v-textarea
                  outlined
                  v-model="formData.description"
                  :rules="desciptionRules"
                  counter="500"
                  label="Description"
                  rows="2"
                ></v-textarea>
                  <v-text-field
                  v-model="formData.servings"
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
                      v-for="(ingredient, index) in formData.ingredients"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-row>
                          <v-col
                            ><p class="mt-2">{{ ingredient.name }}</p></v-col
                          >
                          <v-col
                            ><p class="mt-2">{{ ingredient.amount }}</p></v-col
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
                      v-for="(step, index) in formData.steps"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-row>
                          <v-col cols="auto"
                            ><p class="mt-2 font-weight-bold">
                              {{ step.number }}
                            </p></v-col
                          >
                          <v-col
                            ><p class="mt-2">{{ step.content }}</p></v-col
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
                  <v-btn color="green darken-2" @click="validate" :loading='loading' dark block
                    ><v-icon>mdi-arrow-right-bold-box-outline</v-icon>
                    Submit</v-btn
                  >
                </div>
              </div>
            </v-form>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
var CryptoJS = require("crypto-js");
export default {
  data: () => ({
    noFile: true,
    loading:false,
    valid: true,
    alert: false,
    ing_name: "",
    ing_amount: "",
    step_number: "",
    step_content: "",
    formData: {
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
  }),
  methods: {
    ...mapActions({
      addRecipe: "addRecipe",
      
    }),
    validate() {
      this.loading = true
      if (this.$refs.form.validate() == true) {
        if (this.formData.steps.length > 0 && this.formData.ingredients.length > 0) {
          this.alert = false;
          console.log(this.formData.image)
          this.addRecipe(this.formData);
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
        this.formData.steps.push({
          number: this.step_number,
          content: this.step_content,
        });
        this.valid = true;
        this.step_number = "";
        this.step_content = "";
      }
    },
    addIngredient() {
      if (this.ing_name != "" && this.ing_amount != "") {
        this.formData.ingredients.push({
          name: this.ing_name,
          amount: this.ing_amount,
        });
        this.valid = true;
        this.ing_name = "";
        this.ing_amount = "";
      }
    },
    removeStep(index) {
      this.formData.steps.splice(index, 1); //Removes the list item
      if (this.formData.steps.length == 0) {
        //if list is empty the form is invalid
        this.valid = false;
      }
    },
    removeIngredient(index) {
      this.formData.ingredients.splice(index, 1); //Removes the list item
      if (this.formData.ingredients.length == 0) {
        //if list is empty the form is invalid
        this.valid = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      getRecipeResponse: "getRecipeResponse",
      getRecipeID: 'getRecipeID'
      
    }),
    compImageRules: function(){ // adds image rules only when there is a file selected
      return this.noFile == false ? this.imageRules : []
    }
  },
  watch: {
    getRecipeResponse: function() {
      //listeing to changes in a vuex state
      if (this.getRecipeResponse == "stored-recipe") {
          var nospaces = this.formData.name.replace(/[\W_]+/g, '-') //replaces all non alphanumeric characters with a dash
          var slug = nospaces+'-'+this.getRecipeID
          if (sessionStorage.getItem("recipe-session") != null) {
              sessionStorage.removeItem("recipe-session");
          }
          let encrypted = CryptoJS.AES.encrypt(JSON.stringify(slug), 'recipe-slug-SCQxTgCEWWhaXiEGmoevb').toString(); //encrypting recipe slug and saving it to session
          sessionStorage.setItem('recipe-session', encrypted)

          if (sessionStorage.getItem("recipe-session") != null) {
            this.$router.push({name:'ShowRecipe', params: {slug: slug}}) //passing slug props to route
          }
      }
    },
  },
};
</script>

import axios from "axios";
var CryptoJS = require("crypto-js");
var userdata = "";
var token = "";

if (sessionStorage.getItem("user-session") != null) {
    userdata = JSON.parse(
        CryptoJS.AES.decrypt(
            sessionStorage.getItem("user-session"),
            "Gb3jzkjk8ubBtRT7fLR5"
        ).toString(CryptoJS.enc.Utf8)
    );
    token = userdata.token
}

const state = {
    recipe_response:'',
    fav_status:'',
    recipes:[],
    filterRecipes:[],
    recipe_id:'',
    selected_recipe:[],
    ingredients:[],
    steps:[],
    rating:'',
    recipe_slug:'',
    recipe_pagination: {
        total:'',
        links:[],
        current:''
    },
};
const getters = {
    getRecipeResponse: state => state.recipe_response,
    getFavStatus: state => state.fav_status,
    getRecipeID: state => state.recipe_id,
    getStateRecipes: state => state.recipes,
    getStateFilterRecipes: state => state.filterRecipes,
    getStateRating: state => state.rating,
    getStateSelectedRecipe: state => state.selected_recipe,
    getStateSteps: state => state.steps,
    getStateIngredients: state => state.ingredients,
    getRecipePagination: state => state.recipe_pagination,
};
const actions = {
    async addRecipe({}, formData){
        this.commit("clearRecipeResponse")
        var data = new FormData() //when upload data with a file, you need to put them inside a FormData variable
        data.append('image', formData.image)
        data.append('name', formData.name)
        data.append('description', formData.description)
        data.append('category', formData.category)
        data.append('servings', formData.servings)
        data.append('steps', JSON.stringify(formData.steps))//objects need to be converted into json string before sending to api
        data.append('ingredients', JSON.stringify(formData.ingredients))
        const response = await axios.post('/recipe/store', data,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != 'error' && response.data.recipe_id != null){
            
            this.commit('setRecipeID', response.data.recipe_id)
            this.commit('setRecipeResponse', response.data.message)
        }
    },
    async getRecipes(){
        const response = await axios.get('/recipe/all', 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit("clearRecipes")
            this.commit('setRecipePagination', response.data)
        }
    },
    async updateRecipe({}, editRecipeData){
        this.commit("clearRecipeResponse")
        var data = new FormData() //when upload data with a file, you need to put them inside a FormData variable
        data.append('_method', 'PUT') // using method spoofing to send formdata to a PUT request in api
        data.append('recipe_id', editRecipeData.recipe_id)
        data.append('image', editRecipeData.image)
        data.append('name', editRecipeData.name)
        data.append('description', editRecipeData.description)
        data.append('category', editRecipeData.category)
        data.append('servings', editRecipeData.servings)
        data.append('steps', JSON.stringify(editRecipeData.steps))//objects need to be converted into json string before sending to api
        data.append('ingredients', JSON.stringify(editRecipeData.ingredients))
        const response = await axios.post('/recipe/update', data,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != 'error'){
            this.commit('setRecipeID', response.data.recipe_id)
          this.commit('setRecipeResponse', response.data.message)
        }
    },
    async destroyRecipe({}, id){
        const response = await axios.delete('/recipe/destroy/'+id, 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit('setRecipeResponse', response.data)
        }
    },
    async getFilterRecipes(){
        const response = await axios.get('/recipe/get-filters', 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit("clearFilterRecipes")
            this.commit("setFilterRecipes", {filterrecipes: response.data})
        }
    },
    async getRecipePage({}, page){
        const response = await axios.get('/recipe/all?page='+page, 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit("clearRecipes")
            this.commit('setRecipePagination', response.data)
            
        }
    },
    async getCategory({}, name){
        const response = await axios.get('/recipe/category/'+name, 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit("clearRecipes")
            this.commit('setRecipePagination', response.data)
        }
    },
    async getCategoryPage({}, {name ,page}){
        const response = await axios.get('/recipe/category/'+name+'?page='+page, 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit("clearRecipes")
            this.commit('setRecipePagination', response.data)
        }
    },
    async getFilter({}, filterobj){
        const response = await axios.post('/recipe/filter',
        {
            searchText: filterobj.searchText,
            rating: filterobj.rating,
            category: filterobj.category
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit("clearRecipes")
            this.commit('setRecipePagination', response.data)
        }
    },
    async getFilterPage({}, filterobj){ //same method as getFilter, just with different url for pagination
        const response = await axios.post('/recipe/filter?page='+filterobj.page, 
        //this is the url for page navigation, this one is set to POST
        {
            searchText: filterobj.searchText,
            rating: filterobj.rating,
            category: filterobj.category
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit("clearRecipes")
            this.commit('setRecipePagination', response.data)
            
        }
    },
    async showRecipe(){
        this.commit('setRecipeSlug')
        const response = await axios.get('/recipe/show/'+state.recipe_slug, 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit('clearSelectedRecipe')
            this.commit('setSelectedRecipe', response.data)
        }
    },
    async addFavorites({}, favData){
        this.commit("clearRecipeResponse")
        const response = await axios.post('/recipe/add-favorite', {
            user_id: favData.user_id,
            recipe_id: favData.recipe_id
        },{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit('setRecipeResponse', response.data)
        }
    },
    async checkFav({}, checkFavObj){
        this.commit("clearFavStatus")
        const response = await axios.post('/recipe/check-fav', {
            user_id: checkFavObj.user_id,
            recipe_id: checkFavObj.recipe_id
        },{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            this.commit('setFavStatus', response.data)
            console.log(response.data)
        }
    },
    async getMyRecipes(){
        this.commit('clearRecipeResponse')
        const response = await axios.get('/recipe/my-recipes', 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            if (response.data != 'none'){
                this.commit("clearRecipes")
                this.commit('setRecipePagination', response.data)
            }
            else {
                this.commit('setRecipeResponse', response.data)
            }
        }
    },
    async getMyRecipePage({}, page){
        this.commit('clearRecipeResponse')
        const response = await axios.get('/recipe/my-recipes?page='+page, 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            if (response.data != 'none'){
                this.commit("clearRecipes")
                this.commit('setRecipePagination', response.data)
            }
            else {
                this.commit('setRecipeResponse', response.data)
            }
        }
    },
//     async uploadImage({}, {file}){
//         var formData = new FormData();
//         formData.append('image_name', file.name);
//         formData.append('image', file);
//         const response = await axios.post('/recipe-image/'+state.user_id, formData, {
//             headers: {
//                 "Content-Type": 'multipart/form-data',
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         if (response.data.result === true){
//             this.commit('setImage', response.data.image)
//         }
        // },
};
const mutations = {
    setRecipeSlug(state){
        if (sessionStorage.getItem("recipe-session") != null) {
            state.recipe_slug = JSON.parse(
              CryptoJS.AES.decrypt(
                sessionStorage.getItem("recipe-session"),
                "recipe-slug-SCQxTgCEWWhaXiEGmoevb"
              ).toString(CryptoJS.enc.Utf8)
            );
        }
    },
    setSelectedRecipe(state, data){
        data.recipe.map(function(value) {
            state.selected_recipe.push(value);
        });
        data.steps.map(function(value) {
            state.steps.push(value);
        });
        data.ingredients.map(function(value) {
            state.ingredients.push(value);
        });
        state.rating = data.rating
    },
    setFilterRecipes(state, data){
        data.filterrecipes.map(function(value) {
            state.filterRecipes.push(value);
        });
    },
    setRecipeID(state, data){
        state.recipe_id = data
    },
    setRecipeResponse(state, data){
        state.recipe_response = data
    },
    setFavStatus(state, data){
        state.fav_status = data
    },
    setRecipePagination(state, data){
        
        data.data.map(function(value, key) {
            state.recipes.push(value);
        });

        state.recipe_pagination.current = data.current_page
        state.recipe_pagination.links = data.links
        state.recipe_pagination.total = data.links.length-2 //I subtracted 2 from length to prevent extra page numbers that are empty

        
    },
    clearFavStatus(state){
        state.fav_status = ''
    },
    clearRecipes(state){
        state.recipes = []
    },
    clearFilterRecipes(state){
        state.filterRecipes = []
    },
    clearSelectedRecipe(state){
        state.selected_recipe = []
        state.steps = []
        state.ingredients = []
    },
    clearRecipeResponse(state){
        state.recipe_response = ''
    },
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
};

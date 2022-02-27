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
    token = userdata.token;
}

const state = {
    review_response:'',
    reviews:[],
    likes:[],
    reviews_pagination: {
        total:'',
        links:[],
        current:''
    },
};
const getters = {
    getReviewResponse: state => state.review_response,
    getStateLikes: state => state.likes,
    getStateReviews: state => state.reviews,
    getReviewsPagination: state => state.reviews_pagination,
};
const actions = {
    async addReview({}, formData){
        this.commit("clearReviewResponse")
        const response = await axios.post('/review/store', {
            content: formData.content,
            rating: formData.rating,
            recipe_id: formData.recipe_id,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
          this.commit('setReviewResponse', response.data)
        }
        else {
            console.log(response.data) // error
        }
    },
    async getReviews({}, {recipe_id, user_id}){
        this.commit("clearReviewResponse")
        this.commit("clearReviews")
        this.commit("clearLikes")
        const response = await axios.post('/reviews/all', {
            recipe_id: recipe_id,
            user_id: user_id
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            if (response.data != 'none'){
                this.commit('setReviewsPagination', {reviews: response.data.reviews})
                this.commit('setLikes', {review_likes: response.data.review_likes}) 
                // this allows the user to see which reviews the current user has liked for the current recipe
            }
            else if (response.data == 'none'){
                this.commit('setReviewResponse', response.data)
            }
        }
        else {
            console.log(response.data)
        }
    },
    async getReviewsPage({}, pageobj){
        this.commit("clearReviewResponse")
        this.commit("clearReviews")
        this.commit("clearLikes")
        const response = await axios.post('/reviews/all?page='+pageobj.page, 
        {
            recipe_id: pageobj.recipe_id,
            user_id: pageobj.user_id
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            if (response.data != 'none'){
                this.commit('setReviewsPagination', {reviews: response.data.reviews})
                this.commit('setLikes', {review_likes: response.data.review_likes}) 
                // this allows the user to see which reviews the current user has liked for the current recipe
            }
            else if (response.data == 'none'){
                this.commit('setReviewResponse', response.data)
            }
        }
        else {
            console.log(response.data)
        }
    },
    async deleteReview({}, id){
        this.commit("clearReviewResponse")
        this.commit("clearReviews")
        const response = await axios.delete('/review/destroy/'+id,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data == 'deleted'){
            this.commit('setReviewResponse', response.data)
        }
        else {
            console.log(response.data) //error
        }
    },
    async updateReview({}, editData){
        this.commit("clearReviewResponse")
        const response = await axios.put('/review/update',
        {
            content: editData.content,
            rating: editData.rating,
            review_id: editData.review_id,
            recipe_id: editData.recipe_id,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data == 'updated'){
            this.commit('setReviewResponse', response.data)
        }
        else {
            console.log(response.data)//error
        }
    },
    async updateLikes({}, likeData){
        this.commit("clearReviewResponse")
        const response = await axios.put('/review/like',{
            review_id: likeData.id,
            recipe_id: likeData.recipe_id
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data == 'review_liked' || response.data == 'review_unliked'){
            this.commit('setReviewResponse', response.data)
        }
        else {
            console.log(response.data)//error
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
    // setRecipeSlug(state, data){
    //     if (sessionStorage.getItem("recipe-session") != null) {
    //         state.recipe_slug = JSON.parse(
    //           CryptoJS.AES.decrypt(
    //             sessionStorage.getItem("recipe-session"),
    //             "recipe-slug-SCQxTgCEWWhaXiEGmoevb"
    //           ).toString(CryptoJS.enc.Utf8)
    //         );
    //     }
    // },
    // setSelectedRecipe(state, data){
    //     data.recipe.map(function(value) {
    //         state.selected_recipe.push(value);
    //     });

    //     data.steps.map(function(value) {
    //         state.steps.push(value);
    //     });
    //     data.ingredients.map(function(value) {
    //         state.ingredients.push(value);
    //     });
    //     state.rating = data.rating
    // },
    // setRecipeID(state, data){
    //     state.recipe_id = data
    // },
    setReviews(state, data){
        data.reviews.map(function(value) {
            state.reviews.push(value);
        });
    },
    setLikes(state, data){
        data.review_likes.map(function(value) {
            state.likes.push(value);
        });
    },
    setReviewResponse(state, data){
        state.review_response = data
    },
    setReviewsPagination(state, data){
        
        data.reviews.data.map(function(value, key) {
            state.reviews.push(value);
        });

        state.reviews_pagination.current = data.reviews.current_page
        state.reviews_pagination.links = data.reviews.links
        state.reviews_pagination.total = data.reviews.links.length-2 //I subtracted 2 from length to prevent extra page numbers that are empty
    },
    clearReviews(state){
        state.reviews = []
    },
    clearLikes(state){
        state.likes = []
    },
    clearReviewResponse(state){
        state.review_response = ''
    },
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
};

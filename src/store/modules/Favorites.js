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
    fav_response:'',
    favs: [],
    favs_pagination: {
        total:'',
        links:[],
        current:''
    },
};
const getters = {
    getFavResponse: state => state.fav_response,
    getStateFavs: state => state.favs,
    getFavPagination: state => state.favs_pagination
};
const actions = {
    async getFavs(){
        this.commit('clearFavResponse')
        const response = await axios.get('/favorites/all', 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            if (response.data != 'none'){
                this.commit("clearFavs")
                this.commit('setFavsPagination', response.data)
            }
            else {
                this.commit('setFavResponse', response.data)
            }
        }
    },
    async getFavPage({}, page){
        this.commit('clearFavResponse')
        const response = await axios.get('/favorites/all?page='+page, 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data != null){
            if (response.data != 'none'){
                this.commit("clearFavs")
                this.commit('setFavsPagination', response.data)
            }
            else {
                this.commit('setFavResponse', response.data)
            }
        }
    },
};
const mutations = {
    setFavsPagination(state, data){
        data.data.map(function(value) {
            state.favs.push(value);
        });
        state.favs_pagination.current = data.current_page
        state.favs_pagination.links = data.links
        state.favs_pagination.total = data.links.length-2 //I subtracted 2 from length to prevent extra page numbers that are empty
    },
    setFavResponse(state, data){
        state.fav_response = data
    },
    clearFavResponse(state){
        state.fav_response = ''
    },
    clearFavs(state){
        state.favs = []
    }
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
};

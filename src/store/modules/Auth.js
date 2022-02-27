import axios from "axios";
var CryptoJS = require("crypto-js");
// var userdata = "";
// var token = "";

// if (sessionStorage.getItem("user-session") != null) {
//     userdata = JSON.parse(
//         CryptoJS.AES.decrypt(
//             sessionStorage.getItem("user-session"),
//             "vJaDBQadMaw108cNVXPl"
//         ).toString(CryptoJS.enc.Utf8)
//     );
//     token = userdata.token;
// }

const state = {
    login_response:''
};
const getters = {
    getLoginResponse: state => state.login_response
};
const actions = {
    async registerUser({}, formData){
        // this.commit("clearReviews")
        const response = await axios.post('/register', {
            username: formData.username,
            firstname: formData.firstname,
            lastname: formData.lastname,
            phone: formData.phone,
            description: formData.address,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        })
        if (response.data != null){
            let encrypted = CryptoJS.AES.encrypt(JSON.stringify(response.data), 'Gb3jzkjk8ubBtRT7fLR5').toString();
            sessionStorage.setItem('user-session', encrypted)
            window.location.replace('/')
        }
    },
    async loginUser({}, formData){
        this.commit("clearLoginResponse")
        const response = await axios.post('/login', {
            username: formData.username,
            password: formData.password
        })
        if (response.data == 'Error'){
            this.commit('setLoginResponse', response.data)
        }
        else {
            let encrypted = CryptoJS.AES.encrypt(JSON.stringify(response.data), 'Gb3jzkjk8ubBtRT7fLR5').toString();
            sessionStorage.setItem('user-session', encrypted)
            window.location.replace('/')
        }
    },
};
const mutations = {
    // setReviews(state, data){
    //     data.reviews.map(function(value) {
    //         state.reviews.push(value);
    //     });
    // },
    setLoginResponse(state, data){
        state.login_response = data
    },
    clearLoginResponse(state, data){
        state.login_response = ''
    },
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
};

<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="#8F2F3C"
      flat
      v-if="
        $route.name != 'Login' &&
          $route.name != 'Register' &&
          $route.name != 'Page404'
      "
    >
      <v-avatar
        :color="$vuetify.breakpoint.smAndDown ? 'transparent' : 'transparent'"
        size="32"
      ></v-avatar>
      <v-tabs dark class="d-flex ml-n9">
        <v-tab
          v-for="(link, index) in links"
          :key="index"
          :to="{ name: link.routename }"
        >
          {{ link.name }}
        </v-tab>
      </v-tabs>
      <v-tooltip bottom v-if="logged_in">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="white--text"
            color="white"
            v-bind="attrs"
            v-on="on"
            :to="{ name: 'AddRecipe' }"
            icon
            ><v-icon color="white">mdi-plus-thick</v-icon></v-btn
          >
        </template>
        <span>Create a Recipe</span>
      </v-tooltip>

      &nbsp;
      <v-menu rounded="lg" v-if="logged_in">
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                color="primary"
                class="mr-5"
                dark
                icon
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
             <v-avatar>
      <img
        src="https://cdn.vuetifyjs.com/images/john.jpg"
        alt="John"
      >
    </v-avatar>
                
              </v-btn>
            </template>
            <span>Account Options</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item color="white">
            <v-list-item-title style="color:black;"
              ><b>{{this.fullname}}</b></v-list-item-title
            >
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item color="white" :to="{ name: 'Favorites' }" link>
            <v-list-item-title style="color:black;"
              >Favorites</v-list-item-title
            >
          </v-list-item>
          <v-list-item color="white" :to="{ name: 'MyRecipes' }" link>
            <v-list-item-title style="color:black;"
              >My Recipes</v-list-item-title
            >
          </v-list-item>

           <v-list-item color="white" link>
            <v-list-item-title style="color:black;"
              >Account Settings</v-list-item-title
            >
          </v-list-item>
          <v-list-item color="white" @click="logout" link>
            <v-list-item-title style="color:black;">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <div v-else>
        <v-btn
          color="white"
          class="mr-5"
          :to="{ name: 'Login' }"
          dark
          text
        >
      <v-icon icon>
        mdi-account
      </v-icon>
          Sign in
        </v-btn>
      </div>
    </v-app-bar>

    <v-main class="bg-main">
      <v-container>
        <router-view></router-view>
      </v-container>
      <v-dialog
        v-model="diaload"
        persistent
        width="300"
        v-if="
          this.$route.fullPath != '/login' &&
            this.$route.fullPath != '/register'
        "
      >
        <v-card color="purple" dark>
          <v-card-text>
            Loggin out, please wait...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
var CryptoJS = require("crypto-js");
export default {
  data: () => ({
    logged_in: false,
    token: "",
    diaload:false,
    fullname:'',
    links: [
      { name: "Recipes", routename: "Recipes" },
      { name: "About Us", routename: "About" },
    ],
  }),
  methods: {
    async validateForm() {
      if (this.$refs.form.validate() === true) {
        const response = await axios.post("/unique", {
          username: this.formData.username,
          type: "register",
        });
        if (response.data === "unique") {
          this.loading = true;
          this.formData.route = this.$route.name;
          this.registerUser(this.formData);
        } else {
          this.username_error = "error";
        }
      }
    },
    async logout() {
      this.diaload = true;
      const response = await axios.post(
        "/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (response.data == "success") {
        this.logged_in = false
        this.diaload = false
        sessionStorage.removeItem("user-session");
        this.$router.replace({ name: "Recipes" });
      }
    },
  },
  mounted() {
    if (sessionStorage.getItem("user-session") != null) {
      this.logged_in = true;

      this.userdata = JSON.parse(
        CryptoJS.AES.decrypt(
          sessionStorage.getItem("user-session"),
          "Gb3jzkjk8ubBtRT7fLR5"
        ).toString(CryptoJS.enc.Utf8)
      );
      this.token = this.userdata.token;
      this.fullname = this.userdata.user.firstname+' '+this.userdata.user.lastname;
      // this.getNotifications();

      // this.role = this.userdata.user.role;
      // this.user_id = this.userdata.user.id;

      // if (this.role === "Administrator") {
      //     window.Echo.channel("NOTIFICATION.EMPb2LGWfXTtNOjTEef3").listen(
      //         ".notification-event",
      //         e => {
      //             if (
      //                 e.response.recentorders != null ||
      //                 (e.response.recentreviews != null &&
      //                     e.response.count != null)
      //             ) {
      //                 this.clearNotifications();
      //                 this.clearNotifVariables();
      //                 this.setNotifications(e);
      //             }
      //         }
      //     );
      // }
      // this.diaload = false;
    }
  },
};
</script>

<style>
.bg-main {
  background-color: white;
}
</style>

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col md="8" align="center">
        <v-sheet color="white" elevation="2" max-height="auto" max-width="400">
          <v-container class="my-5">
            <v-row class="mx-1 my-2">
              <h2 class="purple--text">
                <v-icon color="purple" large>
                  mdi-account
                </v-icon>
                Login
              </h2>
            </v-row>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-divider class="my-3"></v-divider>
              <div class="mt-5">
                <v-text-field v-model="formData.username" :rules="unameRules" label="Username" outlined required></v-text-field>
                <v-text-field v-model="formData.password" :rules="pwordRules" type="password" label="Password" outlined required></v-text-field>
              </div>
                <v-alert
                dense
                outlined
                class="mx-2"
                type="error"
                v-if="this.getLoginResponse === 'Error'"
                ><v-icon large color="white">
                  mdi-warning-circle
                </v-icon>
                <span class="text-center">
                  Username or Password does not exist!
                </span>
              </v-alert>
              <v-divider class="my-3"></v-divider>
              <v-btn
                color="primary"
                class="white--text"
                @click="validateForm"
                :loading="loading == true && this.getLoginResponse != 'Error' ? true : false"
                :disabled="!valid"
                block
              >
                Login
              </v-btn>
            </v-form>
            <div class="text-center mt-2">
              <v-btn style="text-transform: unset !important;" max-height="0" max-width="100" :to="{name: 'Register'}" text>
                No Account? <span class="orange--text">Sign up here.</span>
              </v-btn>
            </div>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    valid:true,
    loading:false,
    formData: {
      username: "",
      password: "",
    },
    unameRules: [
      (v) => !!v || "Username is required"
    ],
    pwordRules: [
      (v) => !!v || "Password is required"
    ]
  }),
  methods: {
    validateForm() {
      if (this.$refs.form.validate() === true) {
        this.loading=true
        this.loginUser(this.formData);
      }
    },
    ...mapActions({
      loginUser: "loginUser",
    }),
  },
  computed:{
    ...mapGetters({
          getLoginResponse: "getLoginResponse",
      }),
  }
};
</script>

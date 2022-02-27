<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col md="8">
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
                <h2 class="purple--text">
                  <v-icon color="purple" large>
                    mdi-account
                  </v-icon>
                  Register
                </h2>
              </v-col>
            </v-row>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-divider class="my-3"></v-divider>
              <div class="mt-5">
                <v-row class="mx-1">
                  <v-text-field
                    class="pr-2"
                    v-model="formData.firstname"
                    :rules="fnameRules"
                    label="First Name"
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="formData.lastname"
                    :rules="lnameRules"
                    label="Last Name"
                    outlined
                    required
                  ></v-text-field>
                </v-row>
                <v-text-field
                  class="mt-2"
                  v-model="formData.username"
                  :rules="unameRules"
                  label="Username"
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  v-model="formData.email"
                  :rules="emailRules"
                  label="Email"
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  v-model="formData.password"
                  type="password"
                  :rules="pwordRules"
                  label="Password"
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  :rules="[
                    (v) => !!v || 'Confirm Password is required',
                    (v) => v === formData.password || 'Passwords must match',
                  ]"
                  type="password"
                  label="Confirm Password"
                  outlined
                  required
                ></v-text-field>
              </div>
              <v-alert
                dense
                outlined
                class="mx-2"
                type="error"
                v-if="username_error === 'error'"
                ><v-icon large color="white">
                  mdi-warning-circle
                </v-icon>
                <span class="text-center">
                  Username already exists!
                </span>
              </v-alert>
              <v-divider class="my-3"></v-divider>
              <v-btn
                color="green"
                class="white--text"
                @click="validateForm"
                :loading="loading == true && username_error != 'error' ? true : false"
                :disabled="!valid"
                block
              >
                Submit
              </v-btn>
            </v-form>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
export default {
  data: () => ({
    valid: true,
    loading: false,
    formData: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    },
    username_error: "",
    fnameRules: [
      (v) => !!v || "First Name is required",
      (v) =>
        (v && v.length <= 100) || "First Name must be less than 100 characters",
    ],
    lnameRules: [
      (v) => !!v || "Last Name is required",
      (v) =>
        (v && v.length <= 100) || "Last Name must be less than 100 characters",
    ],
    unameRules: [
      (v) => !!v || "Username is required",
      (v) =>
        (v && v.length <= 30) || "Username must be less than 30 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    pwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
    ],
  }),
  methods: {
    async validateForm() {
      this.username_error = "";
      if (this.$refs.form.validate() === true) {
        this.loading = true;
        const response = await axios.post("/unique", {
          username: this.formData.username,
          type: "register",
        });
        if (response.data === "unique") {
          this.formData.route = this.$route.name;
          this.registerUser(this.formData);
        } else {
          this.username_error = "error";
        }
      }
    },
    ...mapActions({
      registerUser: "registerUser",
    }),
  }
};
</script>

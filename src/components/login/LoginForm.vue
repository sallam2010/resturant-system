<template>
  <form @click.prevent="">
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
      <h1>Login</h1>
        <input
          type="email"
          class="form-control"
          placeholder="Enter Your Email"
          v-model="email"
        />
        <span class="error-feedback" v-if="v$.email.$error">{{
          v$.email.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="password"
          class="form-control"
          placeholder="Enter Your Password"
          v-model="pass"
        />
        <span class="error-feedback" v-if="v$.pass.$error">{{
          v$.pass.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button @click="userLogin()" type="submit" class="btn btn-primary">
          Login
        </button>
        &nbsp;&nbsp;&nbsp;
        <button
          @click="redirectTo({ val: 'signup' })"
          type="button"
          class="btn btn-link"
        >
          Sign Up
        </button>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <p class="error-feedback">{{ userNotFoundErr }}</p>
    </div>
  </form>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
// import { reactive, computed } from "vue";
export default {
  name: "LoginForm",
  // setup() {
  //   const state = reactive({
  //     email: "",
  //     pass: "",
  //   });
  //   const rules = computed(() => {
  //     return {
  //       email: { required, email },
  //       pass: { required },
  //     };
  //   });
  //   const v$ = useValidate(state, rules);
  //   return {
  //     state,
  //     v$,
  //   };
  // },
  data() {
    return {
      v$: useValidate(),
      email: "",
      pass: "",
      userNotFoundErr: "",
    };
  },
  validations() {
    return {
      pass: { required },
      email: { required, email },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ val: "home" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    // sugnUpPage(){
    //     this.$router.push({name: "signup"})
    // }
    async userLogin() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("sussfal");
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.email}&pass=${this.pass}`
        );
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data[0]))
          this.redirectTo({ val: "home" });
        } else {
          this.userNotFoundErr = "User Not Found";
        }
        // console.log(result);
      } else {
        console.log("failed");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.error-feedback {
  color: red;
  font-size: 0.85em;
}
</style>
<template>
  <form @click.prevent="" action="">
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
      <h1>Sign Up</h1>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Your Name"
          v-model="name"
        />
        <span class="error-feedback" v-if="v$.name.$error">{{
          v$.name.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
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
        <button type="submit" @click="signUpNow()" class="btn btn-primary">
          Sign Up Now</button
        >&nbsp;&nbsp;&nbsp;
        <button
          @click="redirectTo({ val: 'logein' })"
          type="button"
          class="btn btn-link"
        >
          Login
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

export default {
  name: "SignUpFrom",
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      pass: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      pass: { required, minLength: minLength(10) },
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
    // logeinPage(){
    //     this.$router.push({name: "logein"})
    // }""
    async signUpNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("sussfal");
        let result = await axios.post("http://localhost:3000/users", {
          name: this.name,
          email: this.email,
          pass: this.pass,
        });
        if (result.status == 201) {
          console.log("this is sussfal");
          localStorage.setItem("user-info", JSON.stringify(result.data));
          console.log(result.data);
          this.redirectTo({ val: "home" });
        } else {
          console.log("this is not sussfal");
        }
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
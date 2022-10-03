<template>
  <div class="container">
    <NavBar />
    <form @click.prevent="" action="">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1> Your Profile</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            disabled
            placeholder="Enter Your Name"
            v-model="name"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="email"
            class="form-control"
            disabled
            placeholder="Enter Your Email"
            v-model="email"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="password"
            class="form-control"
            disabled
            placeholder="Enter Your Password"
            v-model="pass"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="submit"
            @click="updateProfile()"
            class="btn btn-primary"
          >
            Update Profile Now
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import NavBar from "@/components/Header/NavBar.vue";
import { mapActions } from "vuex";
export default {
  name: "profileFrom",
  components: {
    NavBar,
  },
  data() {
    return {
      name: "",
      email: "",
      pass: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).pass;
    }else{
          this.redirectTo({ val: "signup" });
    }
  },
  methods:{
    ...mapActions(["redirectTo"]),
    updateProfile(){
        this.redirectTo({ val: "UpdateProfile"})
    }
  }
};
</script>

<style>
</style>
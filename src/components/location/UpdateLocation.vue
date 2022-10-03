<template>
  <NavBar />
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Update Restaurant</h1>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Restaurant Name"
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
          type="text"
          class="form-control"
          placeholder="Phone Number"
          v-model="phone"
        />
        <span class="error-feedback" v-if="v$.phone.$error">{{
          v$.phone.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Address"
          v-model="address"
        />
        <span class="error-feedback" v-if="v$.address.$error">{{
          v$.address.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div
        class="col-auto d-block mx-auto alert alert-success"
        v-if="successMessage.length > 0"
      >
        {{ successMessage }}
      </div>
      <div
        class="col-auto d-block mx-auto alert alert-danger"
        v-if="erroMessage.length > 0"
      >
        {{ erroMessage }}
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button @click="Updatelocation()" type="button" class="btn btn-success">
          Update Now
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import NavBar from "@/components/Header/NavBar.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "UpdateLocation",
  components: {
    NavBar,
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      phone: "",
      address: "",
      userId: "",
      successMessage: "",
      erroMessage: "",
      locationId: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      phone: { required, minLength: minLength(10) },
      address: { required, minLength: minLength(10) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.locationId = this.$route.params.locationId
      this.canCurrentUserAcessThisLocation();

    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
        async canCurrentUserAcessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationDate = result.data;
        this.name = this.locationDate[0].name;
        this.address = this.locationDate[0].address;
        this.phone = this.locationDate[0].phone;
      } else {
        this.redirectTo({ val: "home" });
      }
    },
    async Updatelocation() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Sussful");
        let result = await axios.put(`http://localhost:3000/locations/${this.locationId}`, {
          name: this.name,
          phone: this.phone,
          address: this.address,
          userId: this.userId,
        });
        if (result.status == 200) {
          this.erroMessage = "";
          this.successMessage = "Location is Updated ...";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
            // this.erroMessage = "";
            // this.successMessage = "";
            // this.name = "";
            // this.phone = "";
            // this.address = "";
            // this.v$.name.$errors[0].$message = "";
            // this.v$.phone.$errors[0].$message = "";
            // this.v$.address.$errors[0].$message = "";
          }, 1000);
        } else {
          this.successMessage = "";
          this.erroMessage = "Something Went wrong, please try again";
        }
      } else {
        this.successMessage = "";
        this.erroMessage = "you must fill in all required";
      }
    },
  },
};
</script>

<style>
</style>
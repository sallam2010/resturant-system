<template>
  <NavBar />
  <div class="container">
    <router-link
      :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Back ViewCategories</button> </router-link
    >&nbsp;&nbsp;
    <router-link :to="{ name: 'MenuFrom', params: { locationID: locationId } }">
      <button class="btn btn-success">Back Menu</button>
    </router-link>
    <div class="text-center">
      <h1>{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <br />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Update Category</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Add Category Name"
            v-model="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <br />
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
          <button
            @click="updateCategory()"
            type="button"
            class="btn btn-success"
          >
            Update Now
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import NavBar from "@/components/Header/NavBar.vue";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "AddNewCategory",
  components: {
    NavBar,
  },
  data() {
    return {
      v$: useValidate(),
      locationId: this.$route.params.locId,
      catId: this.$route.params.catId,
      userId: "",
      locAddress: "",
      locName: "",
      name: "",
      successMessage: "",
      erroMessage: "",
      listOfUserCategories: [],
      categortNames: [],
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15) },
    };
  },
  created() {
    console.log(this.$route);
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      // console.log(this.userId, this.userName)
      this.canUserAcessThisLocations({
        userIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.canUserAcessThisCategory({
        userIs: this.userId,
        catIdIs: this.catId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.getLocationInfo(this.userId, this.locationId);
      // console.log(this.userId)
      this.displayUserCategories(this.userId, this.locationId);
      this.getCategoryName(this.userId, this.locationId, this.catId);
    }
  },
  methods: {
    ...mapMutations([
      "isloggedInUser",
      "displayAllCategories",
      "canUserAcessThisLocations",
      "canUserAcessThisCategory",
    ]),
    ...mapActions(["redirectTo"]),
    async displayUserCategories(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      // console.log(result)
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
        // console.log(this.listOfUserCategories)
      }
    },
    async getLocationInfo(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${userId}&id=${locId}`
      );
      let locDetails = [];
      if (result.status == 200) {
        locDetails = result.data;
        this.locName = locDetails[0].name;
        this.locAddress = locDetails[0].address;
      }
    },
        async getCategoryName(userId, locId, catId) {
        let result = await axios.get(
            `http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`
        );
        if (result.status == 200) {
            this.categortNames = result.data;
            if (this.categortNames.length > 0) {
                this.name = this.categortNames[0].name
            }
        }
    },
    async updateCategory() {
      this.v$.$validate();
      let filterCategoryName = this.listOfUserCategories.filter(
        (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase()
      );
      console.log("filterCategoryName", filterCategoryName);

      if (!this.v$.$error) {
        if (filterCategoryName.length > 0) {
          this.erroMessage = "Category Name Exist, Try Anther Name";
          this.successMessage = "";
        } else {
          let result = await axios.put(`http://localhost:3000/categories/${this.catId}`, {
            name: this.name,
            userId: this.userId,
            locationId: parseInt(this.locationId),
          });
          if (result.status == 200) {
            this.erroMessage = "";
            this.successMessage = "Update category success";
            setTimeout(() => {
              this.$router.push({
                name: "ViewCategories",
                params: { locationID: this.locationId },
              });
            }, 1000);
          } else {
            this.successMessage = "";
            this.erroMessage = "somthing went ronge try again";
          }
        }
      } else {
        this.successMessage = "";
        this.erroMessage = "you must fill in catergory";
      }
    },
  },
};
</script>

<style>
</style>
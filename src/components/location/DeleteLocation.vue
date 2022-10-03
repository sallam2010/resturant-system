<template>
  <div class="container">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Restaurant # {{ deleteLocation }}</h1>
          <p class="text-danger">Are You sure yoy want delete location?</p>
          {{ name }}
          <br />
          {{ address }}
          <br />
          {{ phone }}
          <br />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button @click="goBack()" class="btn btn-info">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteLocatin()">
            Delete Now
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-warning"
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
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import NavBar from "@/components/Header/NavBar.vue";
import axios from "axios";
export default {
  name: "DeleteLocation",
  components: {
    NavBar,
  },
  data() {
    return {
      name: "",
      address: "",
      phone: "",
      userId: "",
      deleteLocation: "",
      locationDate: [],
      successMessage: "",
      erroMessage: "",
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      console.log(this.$route);
      this.deleteLocation = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAcessThisLocation();
      let result = await axios.get(
        `http://localhost:3000/items?locId=${this.deleteLocation}` //deleteLocation
      );
      // console.log("items", result.data);
      let resultLen = result.data.length;
      for (let v = 0; v < resultLen; v++) {
        this.allItemsIdIs.push(result.data[v].id);
      }
      let resultForCategories = await axios.get(
        `http://localhost:3000/categories?locationId=${this.deleteLocation}` //deleteLocation
      );
      console.log("resultForCategories", resultForCategories);
      let resultCatLen = resultForCategories.data.length;
      for (let e = 0; e < resultCatLen; e++) {
        this.allCatsIdIs.push(resultForCategories.data[e].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ val: "home" });
    },
    async canCurrentUserAcessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}`
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
    async deleteLocatin() {
      let allCatsResrlts = null;
      console.log('this.allCatsIdIs', this.allCatsIdIs)
      for (let c = 0; c < this.allCatsIdIs.length; c++) {
        let result2 = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[c]}`
        );
        console.log('result2', result2)
        if (result2.status === 200) {
          allCatsResrlts = true;
        } else {
          allCatsResrlts = false;
        }
      }
      let allItemsResrlts = null;
      console.log('this.allItemsIdIs', this.allItemsIdIs)
      for (let i = 0; i < this.allItemsIdIs.length; i++) {
        let result1 = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        console.log('result1', result1)
        if (result1.status == 200) {
          allItemsResrlts = true;
        } else {
          allItemsResrlts = false;
        }
      }
      let result = await axios.delete(
        `http://localhost:3000/locations/${this.deleteLocation}`
      );
      if (
          result.status == 200 &&
          allCatsResrlts === true
          && allItemsResrlts === true
          ) {
        this.erroMessage = "";
        this.successMessage = "Location id Delete ...";
        setTimeout(() => {
          this.redirectTo({ val: "home" });
        }, 1000);
      } else {
        this.successMessage = "";
        this.erroMessage = "something ronge Try Again";
      }
    },
  },
};
</script>

<style>
</style>
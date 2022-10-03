<template>
  <div class="container">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1 class="text-center">Delete All Categories</h1>
          <p class="text-danger text-center">
            Are You sure yoy want delete All Category?
          </p>
          <div class="text-center">
            <h1>{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
          </div>
          <p class="text-danger">
            When Deleting all categories thier related menu items will be
            daleted
          </p>
        </div>
      </div>
      <hr />
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button @click="goBack()" class="btn btn-info">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteAllCategories()">
            Delete All
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
  name: "DeleteAllCategories",
  components: {
    NavBar,
  },
  data() {
    return {
      locAddress: "",
      locName: "",
      name: "",
      locationId: this.$route.params.locationId,
      userId: "",
      locationDate: [],
      successMessage: "",
      erroMessage: "",
      categortNames: [],
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      // console.log(this.$route);
      this.deleteLocation = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAcessThisLocation();
      this.getLocationInfo(this.userId, this.locationId);
      let result = await axios.get(
        `http://localhost:3000/items?locId=${this.locationId}` //deleteLocation
      );
      // console.log("items", result.data);
      let resultLen = result.data.length;
      for (let v = 0; v < resultLen; v++) {
        this.allItemsIdIs.push(result.data[v].id);
      }
      let resultForCategories = await axios.get(
        `http://localhost:3000/categories?locationId=${this.locationId}` //deleteLocation
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
      this.$router.push({
        name: "ViewCategories",
        params: { locId: this.locationId },
      });
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
    async deleteAllCategories() {
      let allCatsResrlts = null;
      for (let c = 0; c < this.allCatsIdIs.length; c++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[c]}`
        );
        if (result.status == 200) {
          allCatsResrlts = true;
        } else {
          allCatsResrlts = false;
        }
      }
      let allItemsResrlts = null;
      for (let i = 0; i < this.allItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allItemsResrlts = true;
        } else {
          allItemsResrlts = false;
        }
      }
      if (allItemsResrlts === true && allCatsResrlts === true) {
        this.erroMessage = "";
        this.successMessage = "category id All Delete ...";
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
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
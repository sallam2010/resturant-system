<template>
  <div class="container">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Category #{{ catId }}</h1>
          <h4>Category Name : {{ name }}</h4>
          <p class="text-danger">Are You sure yoy want delete Category?</p>
          <br />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button @click="goBack()" class="btn btn-info">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteCategory()">
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
import { mapMutations, mapActions } from "vuex";
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
      locationId: this.$route.params.locId,
      catId: this.$route.params.catId,
      userId: "",
      locationDate: [],
      successMessage: "",
      erroMessage: "",
      categortNames: [],
      allItemsIdIs: [],
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
      this.canUserAcessThisCategory({
        userIs: this.userId,
        catIdIs: this.catId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.getCategoryName(this.userId, this.locationId, this.catId);
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.catId}`
      );
      console.log('items', result.data);
      let resultLen = result.data.length;
      for (let i = 0; i < resultLen; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
    }
  },
  methods: {
    ...mapMutations(["canUserAcessThisCategory"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationID: this.locationId },
      });
    },
    async getCategoryName(userId, locId, catId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`
      );
      if (result.status == 200) {
        this.categortNames = result.data;
        if (this.categortNames.length > 0) {
          this.name = this.categortNames[0].name;
        }
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
    async deleteCategory() {
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.catId}`
      );
      let allResrlts = null;
      for (let i = 0; i < this.allItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allResrlts = true;
        }
        allResrlts = true;
      }
      if (result.status == 200 && allResrlts === true ) {
        this.erroMessage = "";
        this.successMessage = "category id Delete ...";
        setTimeout(() => {
          this.$router.push({
            name: "ViewCategories",
            params: { locationID: this.locationId },
          });
        }, 1000);
        //  setTimeout(() => {
        //   this.$router.push("ViewCategories");
        // }, 2000);
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
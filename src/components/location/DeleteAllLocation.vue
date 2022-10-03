<template>
  <div class="container">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete All Locations</h1>
          <p class="text-danger">Are You sure yoy want delete all locations?</p>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button @click="goBack()" class="btn btn-info">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteAllLocation()">
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
import NavBar from "../Header/NavBar.vue";
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "DeleteAllLocation",
  components: { NavBar },
  data() {
    return {
      userId: "",
      successMessage: "",
      erroMessage: "",
      allLocationId: [],
      allCatsIdIs: [],
      allItemIdIs: [],
      allItemResrlts: null,
      allResrlts: null,
      allCatResrlts: null,
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      console.log(this.$route);
      this.userId = JSON.parse(user).id;
      // locations
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}`
      );
      console.log(result.data.length);
      let resultLen = result.data.length;
      for (let i = 0; i < resultLen; i++) {
        this.allLocationId.push(result.data[i].id);
      }
      console.table(this.allLocationId);
      // categories
      let resultCat = await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}`
      );
      console.log(result.data.length);
      let resultCatLen = resultCat.data.length;
      for (let i = 0; i < resultCatLen; i++) {
        this.allCatsIdIs.push(resultCat.data[i].id);
      }
      // Itemes
      let resultItem = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}`
      );
      console.log(result.data.length);
      let resultItemLen = resultItem.data.length;
      for (let i = 0; i < resultItemLen; i++) {
        this.allItemIdIs.push(resultItem.data[i].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ val: "home" });
    },
    async deleteAllLocation() {
      for (let i = 0; i < this.allItemIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemIdIs[i]}`
        );
        if (result.status == 200) {
          this.allItemResrlts = true;
        } else {
          this.allItemResrlts = false;
        }
      }
      for (let i = 0; i < this.allCatsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[i]}`
        );
        if (result.status == 200) {
          this.allCatResrlts = true;
        } else {
          this.allCatResrlts = false;
        }
      }

      for (let i = 0; i < this.allLocationId.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/locations/${this.allLocationId[i]}`
        );
        if (result.status == 200) {
          this.allResrlts = true;
        } else {
          this.allResrlts = false;
        }
      }
      if (
        this.allCatResrlts == true &&
        this.allItemResrlts == true &&
        this.allResrlts == true
      ) {
        this.erroMessage = "";
        this.successMessage = "All Location is Delete ...";
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
<template>
  <NavBar />
  <div class="container">
    <router-link
      :to="{ name: 'AddNewCategory', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Add Category</button> </router-link
    >&nbsp;&nbsp;
    <router-link :to="{ name: 'MenuFrom', params: { locationID: locationId } }">
      <button class="btn btn-success">Back Menu</button>
    </router-link>
    <div class="text-center">
      <h1>{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <table class="table caption-top" v-if="numOfCategories > 0">
      <caption>
        <span>List Of Categories ({{ numOfCategories }})</span>
        <span class="float-end">
          <!-- <router-link :to="{ name: 'DeleteAllCategories' }">
          <button class="btn btn-danger">Delete All</button>
        </router-link> -->
        <router-link :to="{ name: 'DeleteAllCategories',
        params: {locationId: locationId} }">
          <button class="btn btn-danger">Delete All</button>
        </router-link>
        </span>
      </caption>
      <thead class="table-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in listOfCategories" :key="i">
          <td>{{ cat.name }}</td>
          <td>
            <router-link
              :to="{
                name: 'UpdateCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-info">Update</button> </router-link
            >&nbsp;
                        <router-link
              :to="{
                name: 'DeleteCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-danger">Delete</button> </router-link
            >

          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="alert alert-warning mt15" role="alert">
      No Categories Added Yet
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/Header/NavBar.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import axios from "axios";

export default {
  name: "ViewCategories",
  components: {
    NavBar,
  },
  data() {
    return {
      locationId: this.$route.params.locId,
      userId: "",
      locAddress: "",
      locName: "",
    };
  },
  created() {
    console.log(this.$route.params.locId);
  },
  computed: {
    ...mapState([
      "isUserLogdesIn",
      "loggedInUerId",
      "numOfCategories",
      "listOfCategories",
    ]),
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.canUserAcessThisLocations({
        userIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.displayAllCategories({
        userIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.getLocationInfo(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isloggedInUser",
      "displayAllCategories",
      "canUserAcessThisLocations",
    ]),
    ...mapActions(["redirectTo"]),
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
  },
};
</script>

<style>
</style>
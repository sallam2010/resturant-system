<template>
  <NavBar />
  <div class="container">
    <div>
      <router-link
        :to="{ name: 'ViewCategories', params: { locId: locationId } }"
      >
        <button class="btn btn-success float-start" type="button">
          View/Add Categores
        </button>
      </router-link>
      <router-link
        :to="{ name: 'AddNewItem', params: { locationId: locationId } }"
      >
        <button
          class="btn btn-success float-end"
          type="button"
          v-if="numOfCategories > 0"
        >
          Add New Items
        </button>
      </router-link>
    </div>
    <div class="clearfix"></div>
    <div class="text-center">
      <h1>{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <!-- is User Logged In? {{ isUserLogdesIn }} <br />
        Num Id Is {{ loggedInUerId }} <br />
        Num Of Catefories? {{ numOfCategories }} <br />
        Catefories Arry? {{ listOfCategories }} -->
    <div class="each-category">
      <div class="" v-for="(cat, i) in listOfUserCategories" :key="i">
        <div class="row">
          <div class="row col-12 catName">
            <h3 class="text-center bg-light p-1">{{ cat.name }}</h3>
          </div>
          <div
            v-for="(item, h) in listOfUserItem"
            :key="h"
            v-show="cat.id == item.catId"
            :class="{ 'col-xs-12 col-sm-4 px-4': cat.id == item.catId }"
          >
            <div :class="{ 'each-item': cat.id == item.catId }">
              <h4 class="item-name float-start">{{ item.name }}</h4>
              <div class="clearfix"></div>
              <p class="item-des text-muted">{{ item.description }}</p>
              <!-- <div> -->
                <div class="available-items float-start text-muted">
                  Availble Qty: {{ item.qty }}
                </div>
                <div class="item-price float-end text-muted">
                  Price: {{ item.price }}
                </div>
              <!-- </div> -->
              <div class="clearfix"></div>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/Header/NavBar.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "MenuFrom",
  components: {
    NavBar,
  },
  data() {
    return {
      userName: "",
      userId: "",
      locationId: this.$route.params.locationID,
      locAddress: "",
      locName: "",
      listOfUserCategories: [],
      listOfUserItem: [],
    };
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
      this.isloggedInUser();
      // this.locationId = this.$route.params.locationId;
      this.displayAllCategories({
        userIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.canUserAcessThisLocations({
        userIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.getCurrenCategories(this.userId, this.locationId);
      this.getCurrenItems(this.userId, this.locationId);
    }
    console.log(this.$route.params);
  },
  methods: {
    ...mapMutations([
      "isloggedInUser",
      "displayAllCategories",
      "canUserAcessThisLocations",
    ]),
    ...mapActions(["redirectTo"]),
    async getCurrenCategories(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
        console.table(this.listOfUserCategories);
      }
    },
    async getCurrenItems(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserItem = result.data;
        console.table(this.listOfUserItem);
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
  },
};
</script>

<style>
</style>
<template>
  <NavBar />
  <div class="container">
    <div class="clearfix"></div>
    <router-link :to="{ name: 'MenuFrom', params: { locationID: locationId } }">
      <button class="btn btn-info float-start" type="button">Back Menu</button>
    </router-link>
    <div class="clearfix"></div>
     <br>
    <div class="text-center">
      <h4>{{ locName }}</h4>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <hr />
          <h1>Add New Item</h1>
        </div>
      </div>
      <div
        class="row g-3 align-items-center"
        :class="{ 'form-group-error': v$.itemName.$error }"
      >
        <div class="col-auto mx-auto d-block">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="w250 form-control"
              id="floatItemName"
              placeholder="Enter Item Name"
              v-model.trim="itemName"
            />
            <label for="floatItemName">Enter Item Name</label>
            <span class="error-feedback" v-if="v$.itemName.$error">{{
              v$.itemName.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div
        class="row g-3 align-items-center"
        :class="{ 'form-group-error': v$.itemPrice.$error }"
      >
        <div class="col-auto mx-auto d-block">
          <div class="form-floating mb-3">
            <input
              type="Number"
              class="w250 form-control"
              id="floatItemPrice"
              placeholder="Enter Item Price"
              v-model.trim="itemPrice"
            />
            <label for="floatItemPrice">Enter Item Price</label>
            <span class="error-feedback" v-if="v$.itemPrice.$error">{{
              v$.itemPrice.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div
        class="row g-3 align-items-center"
        :class="{ 'form-group-error': v$.itemsQty.$error }"
      >
        <div class="col-auto mx-auto d-block">
          <div class="form-floating mb-3">
            <input
              type="number"
              class="w250 form-control"
              id="floatItemQty"
              placeholder="Enter Item Quantities"
              v-model.trim="itemsQty"
            />
            <label for="floatItemQty">Enter Item Quantities</label>
            <span class="error-feedback" v-if="v$.itemsQty.$error">{{
              v$.itemsQty.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.description.$error }"
          >
            <textarea
              class="w250 h200 form-control"
              placeholder="Enter Item Descriptions"
              id="floatItemDescriptions"
              v-model.trim="description"
            ></textarea>

            <label for="floatItemDescriptions">Enter Item Descriptions</label>
            <span class="error-feedback" v-if="v$.description.$error">{{
              v$.description.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.pickedCategory.$error }"
          >
            <select
              class="w250 form-select"
              id="floatItemCategory"
              v-model.trim="pickedCategory"
            >
              <option
                v-for="(cat, i) in listOfCategories"
                :key="i"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <label for="floatItemCategory">Select Category Name</label>
            <span class="error-feedback" v-if="v$.pickedCategory.$error">{{
              v$.pickedCategory.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            @click="addNewItem()"
            type="button"
            class="w250 btn btn-primary"
          >
            Add Now
          </button>
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
    </form>
  </div>
</template>

<script>
import NavBar from "@/components/Header/NavBar.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength, between } from "@vuelidate/validators";
import axios from "axios";
export default {
  name: "AddNewItem",
  components: {
    NavBar,
  },
  data() {
    return {
      v$: useValidate(),
      userName: "",
      userId: "",
      locationId: this.$route.params.locationId,
      locAddress: "",
      locName: "",
      pickedCategory: "",
      successMessage: "",
      erroMessage: "",
      itemName: "",
      itemsQty: 1,
      description: "",
      itemPrice: "",
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
  validations() {
    return {
      itemName: { required, minLength: minLength(6) },
      description: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(120),
      },
      itemsQty: { required, between: between(1, 10000) },
      itemPrice: { required, between: between(0, 10000) },
      pickedCategory: { required },
    };
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
    async addNewItem() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Sussful");
        let result = await axios.post("http://localhost:3000/items", {
          name: this.itemName,
          price: parseFloat(this.itemPrice).toFixed(2),
          description: this.description,
          qty: this.itemsQty,
          userId: this.userId,
          locId: parseInt(this.locationId,10),
          catId: this.pickedCategory,
        });
        if (result.status == 201) {
          this.erroMessage = "";
          this.successMessage = "Added New Item";
          setTimeout(() => {
            this.$router.push({
              name: "MenuFrom",
              params: { locationID: this.locationId },
            });
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
.w250 {
  min-width: 250px;
}
.h200 {
  min-height: 200px !important;
}
.error-feedback {
  color: red;
  text-align: center;
  font-size: 0.85em;
}
.form-group-error {
  color: red;
}
.form-group-error input,
.form-group-error select,
.form-group-error textarea {
  border-color: red;
}
</style>

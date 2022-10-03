<template>
  <div class="container">
    <NavBar />
    <p class="text-end">
      Welcom {{ userName }}
      <router-link :to="{ name: 'profile' }">
        <button class="btn btn-info" type="button">Profile</button>
      </router-link>
    </p>
    <router-link :to="{ name: 'AddNewLocation' }">
          <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Add New Restaurant
    </button>

    </router-link>
    <UserLocation :allLocations="ListOfLocation" />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from "@/components/Header/NavBar.vue";
import UserLocation from "@/components/location/UserLocation.vue";
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "HomeView",
  data() {
    return {
      userName: "",
      userId: "",
      ListOfLocation: [],
    };
  },
  components: {
    NavBar,
    UserLocation,
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );
    if (result.status == 200 && result.data.length > 0) {
      this.ListOfLocation = result.data;
      console.log(result.data)
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
  },
};
</script>

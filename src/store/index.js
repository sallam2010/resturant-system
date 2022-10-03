import { createStore } from 'vuex'
import router from '@/router/index'
import axios from 'axios'
const state = {
    isUserLogdesIn: null,
    loggedInUerId: "",
    numOfCategories: "",
    listOfCategories: [],
    listOfItems: [],
    listOfLocations: [],

}
const getters = {}
const mutations = {
    redirectTo(state, payload) {
        router.push({ name: payload })
    },
    isloggedInUser(state) {
        let user = localStorage.getItem("user-info");
        if (user) {
            state.isUserLogdesIn = true;
            console.log("success")
            state.loggedInUerId = JSON.parse(user).id;
        } else {
            state.isUserLogdesIn = false
            console.log("filed")
        }
    },
    async displayAllCategories(state, payload) {
        let result = await axios.get(
            `http://localhost:3000/categories?userId=${payload.userIs}&locationId=${payload.locationIdIs}`
        );
        console.log(result)
        if (result.status == 200) {
            state.listOfCategories = result.data;
            state.numOfCategories = state.listOfCategories.length;
        }
    },
    async canUserAcessThisLocations(state, payload) {
        let result = await axios.get(
            `http://localhost:3000/locations?userId=${payload.userIs}&id=${payload.locationIdIs}`
        );
        if (result.status == 200) {
            state.listOfLocations = result.data;
            if (state.listOfLocations.length !== 1) {
                this.commit("redirectTo", payload.redirectToPage)
            }
        }
    },
    async canUserAcessThisCategory(state, payload) {
        let result = await axios.get(
            `http://localhost:3000/categories?userId=${payload.userIs}&locationId=${payload.locationIdIs}&id=${payload.catIdIs}`
        );
        if (result.status == 200) {
            state.listOfCategories = result.data;
            if (state.listOfCategories.length !== 1) {
                this.commit("redirectTo", payload.redirectToPage)
            }
        }
    },
    async canUserAcessThisItem(state, payload) {
        let result = await axios.get(
            `http://localhost:3000/items?userId=${payload.userIs}&locationId=${payload.locationIdIs}&id=${payload.itemIdIs}`
        );
        if (result.status == 200) {
            state.listOfItems = result.data;
            if (state.listOfItems.length < 1) {
                this.commit("redirectTo", payload.redirectToPage)
            }
        }
    },

};
const actions = {
    redirectTo({ commit }, payload) {
        commit("redirectTo", payload.val)
    }
}
const modules = {}



export default createStore({
    state,
    getters,
    mutations,
    actions,
    modules,
})
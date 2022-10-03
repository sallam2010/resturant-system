import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../views/SignUP.vue'
import LogeIn from '../views/LogeIn.vue'
import profileView from '../views/profileView.vue'
import ErroPage from '../views/ErroPage.vue'
import UpdateProfile from '@/components/profile/UpdateProfile.vue'
import AddNewLocation from '../components/location/AddNewLocation.vue'
import DeleteLocation from '../components/location/DeleteLocation.vue'
import DeleteAllLocation from '../components/location/DeleteAllLocation.vue'
import UpdateLocation from '../components/location/UpdateLocation.vue'
import MenuFrom from '../components/menu/MenuFrom.vue'
import AddNewCategory from '../components/menu/AddNewCategory.vue'
import ViewCategories from '../components/menu/ViewCategories.vue'
import UpdateCategory from '../components/menu/UpdateCategory.vue'
import DeleteCategory from '../components/menu/DeleteCategory.vue'
import DeleteAllCategories from '../components/menu/DeleteAllCategories.vue'
import AddNewItem from '../components/menu/AddNewItem.vue'
import UpdateItem from '../components/menu/UpdateItem.vue'








const routes = [{
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignUp
    },
    {
        path: '/logein',
        name: 'logein',
        component: LogeIn
    },
    {
        path: '/profile',
        name: 'profile',
        component: profileView
    },
    {
        path: '/updateProfile',
        name: 'UpdateProfile',
        component: UpdateProfile
    },
    {
        path: '/addnewlocation',
        name: 'AddNewLocation',
        component: AddNewLocation
    },
    {
        path: '/deletelocation/:locationId',
        name: 'DeleteLocation',
        component: DeleteLocation
    },
    {
        path: '/deletealllocation',
        name: 'DeleteAllLocation',
        component: DeleteAllLocation
    },
    {
        path: '/updatelocation/:locationId',
        name: 'UpdateLocation',
        component: UpdateLocation
    },
    {
        path: '/menufrom/location/:locationID?',
        // path: '/MenuFrom',
        name: 'MenuFrom',
        component: MenuFrom
    },
    {
        path: '/menufrom/categories/add/:locId',
        // path: '/AddNewCategory',
        name: 'AddNewCategory',
        component: AddNewCategory
    },
    {
        path: '/menufrom/items/add/:locationId',
        name: 'AddNewItem',
        component: AddNewItem
    },
    {
        path: '/menufrom/item/update/:itemId/loc/:locationId',
        name: 'UpdateItem',
        component: UpdateItem
    },
    {
        path: '/menufrom/categories/view/:locId',
        name: 'ViewCategories',
        component: ViewCategories
    },
    {
        path: '/menufrom/categories/update/:locId/:catId',
        name: 'UpdateCategory',
        component: UpdateCategory
    },
    {
        path: '/menufrom/categories/delete/:locId/:catId',
        name: 'DeleteCategory',
        component: DeleteCategory
    },
    {
        path: '/menufrom/categories/delete-all/:locationId',
        name: 'DeleteAllCategories',
        component: DeleteAllCategories
    },
    {
        path: "/:catchAll(.*)",
        name: "ErroPage",
        component: ErroPage,
    },
]

const router = createRouter({
        history: createWebHistory(process.env.BASE_URL),
        routes
    })
    // router.beforeEach((to, from, next) => {
    //     if (to.params.pageTitle !== undefined) {
    //         document.title = `${to.name} | ${to.params.pageTitle} | ${process.env.VUE_APP_TITLE}`
    //     } else {
    //         if (to.name == null) {
    //             document.title = `UnKnow Page | ${process.env.VUE_APP_TITLE}`
    //         } else {
    //             document.title = `${to.name}`
    //         }
    //     }
    //     next()
    // })
router.beforeEach((to, from, next) => {
    // ...
    document.title = `${to.name} | ${process.env.VUE_APP_TITLE} `
    next()
})

export default router
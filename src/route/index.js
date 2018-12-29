import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '../components/MainPage.vue'
import Error from '../components/Error.vue'
import Blank from '../components/Blank.vue'
import About from '../views/About.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: About
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
      path: '/pagecontent/:bookid/:tabid/:pageid',
      name: 'mainpage',
      component : MainPage
    },
    {
      path : '/pageblank',
      name : 'pageblank',
      component : Blank
    },
    {
      path: '*',
      name : 'error',
      component : Error
    }
  ]
});

router.beforeEach((to, from, next) =>{
  console.log("router From:", from.path)
  console.log("router To:", to.path)
  next()
})


export default router

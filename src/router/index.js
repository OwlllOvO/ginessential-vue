import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import Home from '../views/Home.vue';
import userRoutes from './module/user';
import adminRoutes from './module/admin';
import postRoutes from './module/post';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  ...userRoutes,
  ...adminRoutes,
  ...postRoutes,
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.auth) { // check if need login
    // check if user login
    if (store.state.userModule.token) { // user has logined
      // check is token validate, like expired
      // if token expired, request new token
      next();
    } else { // user not login
      // turn to login page
      router.push({ name: 'login' });
    }
  } else {
    next();
  }
});

export default router;

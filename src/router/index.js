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
  if (to.meta.auth) {
    if (store.state.userModule.token) {
      const userInfo = JSON.parse(localStorage.getItem('ginessentialuser_info'));
      const userRole = userInfo ? userInfo.role : null;

      if (to.meta.requiresAdmin && userRole !== 'Admin') {
        next({ name: 'Home' });
      } else {
        next();
      }
    } else {
      next({ name: 'login', query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});

export default router;

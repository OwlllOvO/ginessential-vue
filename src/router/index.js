import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import PostManagement from '@/views/PostManagement.vue';
import PostCreate from '@/views/PostCreate.vue';
import Home from '../views/Home.vue';
import userRoutes from './module/user';

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
  {
    path: '/posts',
    name: 'postManagement',
    component: PostManagement, // 添加PostManagement路由
  },
  {
    path: '/posts/create',
    name: 'PostCreate',
    component: PostCreate, // 添加PostManagement路由
  },
  {
    path: '/posts/edit/:id',
    name: 'PostEdit',
    component: () => import('@/views/PostEdit.vue'), // 确保路径正确
  },
  ...userRoutes,
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

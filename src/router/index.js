import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import userRoutes from './module/user';
import adminRoutes from './module/admin';
import postRoutes from './module/post';
import chatRoutes from './module/chat';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Posts/PostList.vue'),
  },
  ...userRoutes,
  ...adminRoutes,
  ...postRoutes,
  ...chatRoutes,
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
        next({ name: 'postlist' });
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

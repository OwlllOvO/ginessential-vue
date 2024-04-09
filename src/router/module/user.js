const userRoutes = [
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/users/Register.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/users/Login.vue'),
  },
  {
    path: '/user/:id',
    name: 'UserPosts',
    component: () => import('@/views/users/UserPosts.vue'),
  },
];

export default userRoutes;

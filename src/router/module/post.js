const postRoutes = [
  {
    path: '/posts',
    name: 'postlist',
    meta: {
      auth: true,
    },
    component: () => import('@/views/Posts/PostList.vue'),
  },
  {
    path: '/posts/create',
    name: 'postcreate',
    meta: {
      auth: true,
    },
    component: () => import('@/views/Posts/PostCreate.vue'),
  },
  {
    path: '/posts/:id',
    name: 'postdetail',
    meta: {
      auth: true,
    },
    component: () => import('@/views/Posts/PostDetail.vue'),
  },
];

export default postRoutes;

const postRoutes = [
  {
    path: '/posts',
    name: 'postlist',
    meta: {
      auth: true,
      requiresAdmin: false,
    },
    component: () => import('@/views/Posts/PostList.vue'),
  },
  {
    path: '/posts/create',
    name: 'postcreate',
    meta: {
      auth: true,
      requiresAdmin: false,
    },
    component: () => import('@/views/Posts/PostCreate.vue'),
  },
  {
    path: '/posts/rank',
    name: 'postrank',
    meta: {
      auth: true,
      requiresAdmin: false,
    },
    component: () => import('@/views/Posts/PostRank.vue'),
  },
  {
    path: '/posts/:id',
    name: 'postdetail',
    meta: {
      auth: true,
      requiresAdmin: false,
    },
    component: () => import('@/views/Posts/PostDetail.vue'),
  },
];

export default postRoutes;

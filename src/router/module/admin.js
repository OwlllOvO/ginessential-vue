const adminRoutes = [
  {
    path: '/admin/users',
    name: 'adminuserlist',
    meta: {
      auth: true,
      requiresAdmin: true,
    },
    component: () => import('@/views/admin/Users/UserList.vue'),
  },
  {
    path: '/admin/users/add',
    name: 'adminuseradd',
    meta: {
      auth: true,
      requiresAdmin: true,
    },
    component: () => import('@/views/admin/Users/UserAdd.vue'),
  },
  {
    path: '/admin/users/update/:id',
    name: 'adminuserupdate',
    meta: {
      auth: true,
      requiresAdmin: true,
    },
    component: () => import('@/views/admin/Users/UserUpdate.vue'),
  },
  {
    path: '/admin/posts',
    name: 'adminpostlist',
    meta: {
      auth: true,
      requiresAdmin: true,
    },
    component: () => import('@/views/Posts/PostList.vue'),
  },
  {
    path: '/admin/posts/create',
    name: 'adminpostcreate',
    meta: {
      auth: true,
      requiresAdmin: true,
    },
    component: () => import('@/views/Posts/PostCreate.vue'),
  },
  {
    path: '/admin/posts/edit/:id',
    name: 'adminpostedit',
    meta: {
      auth: true,
      requiresAdmin: true,
    },
    component: () => import('@/views/Posts/PostEdit.vue'),
  },
  {
    path: '/admin/posts/:id',
    name: 'adminpostdetail',
    meta: {
      auth: true,
      requiresAdmin: true,
    },
    component: () => import('@/views/Posts/PostDetail.vue'),
  },
];

export default adminRoutes;

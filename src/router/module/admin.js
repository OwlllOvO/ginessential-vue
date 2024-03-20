const adminUserRoutes = [
  {
    path: '/admin/users',
    name: 'userlist',
    meta: {
      auth: true,
    },
    component: () => import('@/views/admin/UserList.vue'),
  },
  {
    path: '/admin/users/add',
    name: 'useradd',
    meta: {
      auth: true,
    },
    component: () => import('@/views/admin/UserAdd.vue'),
  },
  {
    path: '/admin/users/update/:id',
    name: 'userupdate',
    meta: {
      auth: true,
    },
    component: () => import('@/views/admin/UserUpdate.vue'),
  },
];

export default adminUserRoutes;

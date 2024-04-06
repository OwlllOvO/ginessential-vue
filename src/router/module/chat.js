const chatRoutes = [
  {
    path: '/chat/:id', // :id 是动态参数，表示接收者的 ID
    name: 'Chat',
    component: () => import('@/views/Chat/Chat.vue'),
    props: true, // 允许将路由参数作为 props 传递给组件
  },
];

export default chatRoutes;

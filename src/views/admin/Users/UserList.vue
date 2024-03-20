<template>
  <div>
    <h2>用户列表</h2>
    <button @click="goToAddUserPage">添加用户</button>
    <table>
      <tr>
        <th>ID</th>
        <th>名称</th>
        <th>电话</th>
        <th>角色</th>
        <th>操作</th>
      </tr>
      <tr
        v-for="user in users"
        :key="user.ID"
      >
        <td>{{ user.ID }}</td>
        <td>{{ user.Name }}</td>
        <td>{{ user.Telephone }}</td>
        <td>{{ user.Role }}</td>
        <td>
          <button @click="goToUpdateUserPage(user.ID)">修改</button>
          <button @click="deleteUser(user.ID)">删除</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import storageService from '../../../service/storageService'; // 导入 Token 存储服务

export default {
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.get('http://localhost:1016/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        this.users = response.data.data;
      });
    },
    goToAddUserPage() {
      this.$router.push({ path: '/admin/users/add' });
    },
    goToUpdateUserPage(userId) {
      this.$router.push({ path: `/admin/users/update/${userId}` });
    },
    deleteUser(userId) {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.delete(`http://localhost:1016/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        this.fetchUsers(); // 重新获取用户列表
      });
    },
  },
};
</script>

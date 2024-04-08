<template>
  <div class="admin-users">
    <h2>用户列表</h2>
    <button
      class="add-user-btn"
      @click="goToAddUserPage"
    >添加用户</button>
    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>电话</th>
          <th>角色</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.ID"
        >
          <td>{{ user.ID }}</td>
          <td>{{ user.Name }}</td>
          <td>{{ user.Telephone }}</td>
          <td>{{ user.Role }}</td>
          <td>
            <button
              class="edit-btn"
              @click="goToUpdateUserPage(user.ID)"
            >修改</button>
            <button
              class="delete-btn"
              @click="deleteUser(user.ID)"
            >删除</button>
          </td>
        </tr>
      </tbody>
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
        // 假设响应数据是数组形式且每个用户对象都有一个 ID 属性
        this.users = response.data.data.sort((a, b) => a.ID - b.ID);
      }).catch((error) => {
        console.error('Failed to fetch users', error);
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

<style scoped>
.admin-users {
  padding: 20px;
}

.add-user-btn {
  background-color: #4caf50; /* Green */
  color: white;
  padding: 10px 24px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-user-btn:hover {
  background-color: #45a049;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table,
.users-table th,
.users-table td {
  border: 1px solid #ddd;
  text-align: left;
  padding: 8px;
}

.users-table th {
  background-color: #f2f2f2;
}

.users-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.users-table tr:hover {
  background-color: #ddd;
}

.edit-btn,
.delete-btn {
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}

.delete-btn {
  background-color: #f44336; /* Red */
}

.edit-btn:hover {
  background-color: #45a049;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
</style>

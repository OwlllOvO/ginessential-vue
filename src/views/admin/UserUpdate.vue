<template>
  <div>
    <h2>修改用户信息</h2>
    <form @submit.prevent="updateUser">
      <div>
        <label>名称:</label>
        <input
          type="text"
          v-model="user.Name"
          required
        >
      </div>
      <div>
        <label>电话:</label>
        <input
          type="text"
          v-model="user.Telephone"
          required
        >
      </div>
      <div>
        <label>密码:</label>
        <input
          type="password"
          v-model="user.Password"
        >
      </div>
      <div>
        <label>角色:</label>
        <input
          type="text"
          v-model="user.Role"
          required
        >
      </div>
      <button type="submit">更新</button>
    </form>
    <p
      v-if="message"
      :class="{'success-message': isSuccess, 'error-message': !isSuccess}"
    >
      {{ message }}
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import storageService from '../../service/storageService'; // 确保已经创建并导入了这个服务

export default {
  data() {
    return {
      user: {
        Name: '',
        Telephone: '',
        Password: '', // 注意：出于安全考虑，通常不会在前端展示密码
        Role: '',
      },
      message: '', // 用于显示后端返回的提示信息
      isSuccess: true, // 用于标记提示信息是成功还是错误消息
    };
  },
  created() {
    this.loadUser();
  },
  methods: {
    loadUser() {
      const userId = this.$route.params.id;
      const token = storageService.get(storageService.USER_TOKEN);

      axios.get(`http://localhost:1016/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        this.user = response.data.data;
      }).catch((error) => {
        this.message = error.response.data.msg || '加载用户信息失败';
        this.isSuccess = false;
      });
    },
    updateUser() {
      const userId = this.$route.params.id;
      const token = storageService.get(storageService.USER_TOKEN);

      axios.put(`http://localhost:1016/admin/users/${userId}`, this.user, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        this.$router.push({ path: '/admin/users' }); // 更新成功后返回用户列表页面
        this.message = '用户信息更新成功';
        this.isSuccess = true;
      }).catch((error) => {
        this.message = error.response.data.msg || '更新用户信息失败';
        this.isSuccess = false;
      });
    },
  },
};
</script>

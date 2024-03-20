<template>
  <div>
    <h2>添加用户</h2>
    <form @submit.prevent="addUser">
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
          required
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
      <button type="submit">提交</button>
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
import storageService from '../../../service/storageService';

export default {
  data() {
    return {
      user: {
        Name: '',
        Telephone: '',
        Password: '',
        Role: '',
      },
      message: '', // 用于显示后端返回的提示信息
      isSuccess: true, // 用于标记提示信息是成功还是错误消息
    };
  },
  methods: {
    addUser() {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.post('http://localhost:1016/admin/users', this.user, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        // 操作成功，显示成功信息
        this.message = response.data.msg || '用户添加成功！';
        this.isSuccess = true;
        // 可能还需要根据实际需求重置表单或跳转到其他页面
      }).catch((error) => {
        // 操作失败，显示错误信息
        this.message = error.response.data.msg || '添加用户失败！';
        this.isSuccess = false;
      });
    },
  },
};
</script>

<style>
.success-message {
  color: green;
}
.error-message {
  color: red;
}
</style>

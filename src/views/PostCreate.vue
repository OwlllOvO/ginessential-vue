<template>
  <div class="post-create">
    <b-card title="Create Post">
      <b-form @submit.prevent="createPost">
        <b-form-group label="Category ID">
          <b-form-input
            v-model="currentPost.category_id"
            type="number"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Title">
          <b-form-input
            v-model="currentPost.title"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Head Image">
          <b-form-input
            v-model="currentPost.head_img"
            type="text"
            placeholder="Image path"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Content">
          <b-form-textarea
            v-model="currentPost.content"
            rows="3"
            required
          ></b-form-textarea>
        </b-form-group>
        <b-button
          type="submit"
          variant="primary"
        >Create</b-button>
        <b-button
          @click="cancelForm"
          variant="secondary"
        >Cancel</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios';
import storageService from '../service/storageService'; // 确保路径正确

export default {
  data() {
    return {
      currentPost: {
        category_id: null,
        title: '',
        head_img: '',
        content: '',
      },
    };
  },
  methods: {
    createPost() {
      const postData = {
        ...this.currentPost,
        category_id: Number(this.currentPost.category_id), // 显式转换为数字
      };

      const token = storageService.get(storageService.USER_TOKEN);
      axios.post('http://localhost:1016/posts', postData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          this.$bvToast.toast('Article created successfully', {
            title: 'Success',
            variant: 'success',
            solid: true,
          });
          this.$router.push({ name: 'postManagement' }); // 确保路由名称正确
        })
        .catch((error) => {
          console.error('There was an error creating the post:', error);
          this.$bvToast.toast('Error creating article', {
            title: 'Error',
            variant: 'danger',
            solid: true,
          });
        });
    },
    cancelForm() {
      // 取消表单逻辑，例如重置表单或返回列表页面
      this.$router.push({ name: 'postManagement' }); // 确保路由名称正确
    },
  },
};
</script>

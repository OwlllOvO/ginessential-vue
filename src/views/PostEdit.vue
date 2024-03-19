<template>
  <div class="post-edit">
    <b-card title="Edit Post">
      <b-form @submit.prevent="updatePost">
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
        >Update</b-button>
        <b-button
          @click="cancelEdit"
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
        id: null,
        category_id: null,
        title: '',
        head_img: '',
        content: '',
      },
    };
  },
  created() {
    this.loadPostData();
  },
  methods: {
    loadPostData() {
      const postId = this.$route.params.id;
      const token = storageService.get(storageService.USER_TOKEN);
      axios.get(`http://localhost:1016/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        // 确保response.data中包含了您需要的数据结构
        this.currentPost = { id: postId, ...response.data };
        console.log('Loaded post:', this.currentPost); // 再次打印检查
      }).catch((error) => {
        console.error('There was an error loading the post data:', error);
      });
    },

    updatePost() {
      const postData = {
        category_id: Number(this.currentPost.category_id),
        title: this.currentPost.title,
        head_img: this.currentPost.head_img,
        content: this.currentPost.content,
      };
      console.log(postData);
      const token = storageService.get(storageService.USER_TOKEN);
      axios.put(`http://localhost:1016/posts/${this.currentPost.id}`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          this.$router.push({ name: 'postManagement' }); // 确保路由名称正确
        })
        .catch((error) => {
          console.error('There was an error updating the post:', error);
        });
    },

    cancelEdit() {
      this.$router.push({ name: 'postManagement' }); // 确保路由名称正确
    },
  },
};
</script>

<template>
  <div class="post-edit">
    <b-card title="Edit Post">
      <b-form @submit.prevent="updatePost">
        <b-form-group label="Category">
          <b-form-select
            v-model="currentPost.category_name"
            :options="categoryOptions"
            required
          ></b-form-select>
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
import storageService from '../../../service/storageService';

export default {
  data() {
    return {
      categories: [],
      currentPost: {
        id: null,
        category_name: '',
        title: '',
        head_img: '',
        content: '',
      },
    };
  },
  created() {
    this.loadPostData();
    this.fetchCategories();
  },
  computed: {
    categoryOptions() {
      return this.categories.map((category) => ({ value: category.name, text: category.name }));
    },
  },
  methods: {
    fetchCategories() {
      axios.get('http://localhost:1016/categories', {
        headers: { Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}` },
      })
        .then((response) => {
          this.categories = response.data.data.categories;
        })
        .catch((error) => {
          console.error('There was an error fetching the categories:', error);
        });
    },
    loadPostData() {
      const postId = this.$route.params.id;
      const token = storageService.get(storageService.USER_TOKEN);
      axios.get(`http://localhost:1016/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          // eslint-disable-next-line max-len
          this.currentPost = { ...response.data.data.post, category_name: response.data.data.post.Category.name };
        })
        .catch((error) => {
          console.error('There was an error loading the post data:', error);
        });
    },
    updatePost() {
      const postData = {
        ...this.currentPost,
      };
      const token = storageService.get(storageService.USER_TOKEN);
      axios.put(`http://localhost:1016/posts/${this.currentPost.id}`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          this.$router.push({ name: 'adminpostlist' });
        })
        .catch((error) => {
          console.error('There was an error updating the post:', error);
        });
    },
    cancelEdit() {
      this.$router.push({ name: 'adminpostlist' });
    },
  },
};
</script>

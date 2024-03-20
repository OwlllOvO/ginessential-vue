<template>
  <div class="post-create">
    <b-card title="Create Post">
      <b-form @submit.prevent="createPost">
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
import storageService from '../service/storageService';

export default {
  data() {
    return {
      categories: [],
      currentPost: {
        category_name: '',
        title: '',
        head_img: '',
        content: '',
      },
    };
  },
  created() {
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
    createPost() {
      const postData = {
        ...this.currentPost,
      };

      axios.post('http://localhost:1016/posts', postData, {
        headers: { Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}` },
      })
        .then(() => {
          this.$bvToast.toast('Article created successfully', {
            title: 'Success',
            variant: 'success',
            solid: true,
          });
          this.$router.push({ name: 'postManagement' }); // Redirect to post management page
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
      this.$router.push({ name: 'postManagement' }); // Redirect to post management page
    },
  },
};
</script>

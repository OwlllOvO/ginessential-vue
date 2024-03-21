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
          <input
            type="file"
            @change="handleFileChange"
          />
          <b-img
            v-if="imageUrl"
            :src="imageUrl"
            alt="Uploaded Image"
            fluid
          ></b-img>
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
import storageService from '../../service/storageService';

export default {
  data() {
    return {
      categories: [],
      selectedFile: null,
      imageUrl: null,
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
      }).then((response) => {
        this.categories = response.data.data.categories;
      }).catch((error) => {
        console.error('There was an error fetching the categories:', error);
      });
    },
    handleFileChange(event) {
      [this.selectedFile] = event.target.files;
      if (this.selectedFile) {
        // Generate a local URL to preview the selected file
        this.imageUrl = URL.createObjectURL(this.selectedFile);
        this.uploadImage(); // Upload the file when it's selected
      } else {
        console.error('No file selected');
      }
    },
    uploadImage() {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      axios.post('http://localhost:1016/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}`,
        },
      }).then((response) => {
        this.currentPost.head_img = response.data.filename;
        this.imageUrl = this.getImageUrl(response.data.filename);
      }).catch((error) => {
        console.error('There was an error uploading the image:', error);
      });
    },
    createPost() {
      if (!this.currentPost.head_img) {
        // 如果没有文件名，提示用户需要选择图片
        this.$bvToast.toast('Please upload an image for the post.', {
          title: 'Missing Image',
          variant: 'warning',
          solid: true,
        });
        return; // 终止创建文章
      }
      const postData = {
        ...this.currentPost,
      };

      axios.post('http://localhost:1016/posts', postData, {
        headers: { Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}` },
      }).then(() => {
        this.$bvToast.toast('Article created successfully', {
          title: 'Success',
          variant: 'success',
          solid: true,
        });
        this.$router.push({ name: 'adminpostlist' }); // Redirect to post management page
      }).catch((error) => {
        console.error('There was an error creating the post:', error);
        this.$bvToast.toast('Error creating article', {
          title: 'Error',
          variant: 'danger',
          solid: true,
        });
      });
    },
    cancelForm() {
      this.$router.push({ name: 'adminpostlist' }); // Redirect to post management page
    },
  },
};
</script>

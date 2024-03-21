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
          <input
            type="file"
            @change="handleFileChange"
          />
          <!-- 显示已上传的图片名称 -->
          <div
            v-if="currentPost.head_img"
            class="mt-2"
          >
            Current image: {{ currentPost.head_img }}
          </div>

          <!-- 显示图片预览 -->
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
          :disabled="!currentPost.head_img"
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
      selectedFile: null,
      imageUrl: null, // 用于显示图片预览
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
    handleFileChange(event) {
      [this.selectedFile] = event.target.files;
      if (this.selectedFile) {
        this.uploadImage(); // 上传新选择的图片
        this.imageUrl = URL.createObjectURL(this.selectedFile); // 生成并显示图片预览
      } else {
        console.error('No file selected');
      }
    },
    uploadImage() {
      if (!this.selectedFile) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      axios.post('http://localhost:1016/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}`,
        },
      })
        .then((response) => {
          this.currentPost.head_img = response.data.filename; // 保存上传成功的文件名
        })
        .catch((error) => {
          console.error('There was an error uploading the image:', error);
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
          this.imageUrl = this.getImageUrl(this.currentPost.head_img); // 如果文章已有图片，则显示图片预览
        })
        .catch((error) => {
          console.error('There was an error loading the post data:', error);
        });
    },
    updatePost() {
      // 确保在更新文章时，如果没有选择新图片，则使用现有图片
      if (!this.selectedFile && !this.currentPost.head_img) {
        // eslint-disable-next-line no-alert
        alert('Please upload an image for the post.');
        return;
      }

      const postData = {
        ...this.currentPost,
        category_name: this.currentPost.category_name,
        title: this.currentPost.title,
        head_img: this.currentPost.head_img,
        content: this.currentPost.content,
      };
      const token = storageService.get(storageService.USER_TOKEN);
      axios.put(`http://localhost:1016/posts/${this.currentPost.id}`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          this.$router.push({ name: 'adminpostlist' }); // Redirect to post management page after successful update
          this.$bvToast.toast('Article updated successfully', {
            title: 'Success',
            variant: 'success',
            solid: true,
          });
        })
        .catch((error) => {
          console.error('There was an error updating the post:', error);
          this.$bvToast.toast('Error updating article', {
            title: 'Error',
            variant: 'danger',
            solid: true,
          });
        });
    },
    cancelEdit() {
      this.$router.push({ name: 'adminpostlist' });
    },
    getImageUrl(fileName) {
      return `http://localhost:1016/images/${fileName}`;
    },
  },
};
</script>

<style>
.post-cover-image {
  max-width: 200px; /* Adjust the size as needed */
  height: auto;
  margin-top: 20px; /* Add some space above the image */
}
</style>

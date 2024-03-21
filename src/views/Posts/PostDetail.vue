<template>
  <div class="post-detail">
    <h1>{{ post.title }}</h1>
    <h2> Drawing </h2>
    <img
      :src="getImageUrl(post.head_img)"
      alt="Post Cover Image"
      class="post-cover-image"
    /> <!-- 添加这行 -->
    <h2> Description </h2>
    <p>{{ post.content }}</p>
    <div class="comments-section">
      <h3>Comments</h3>
      <div
        v-for="comment in post.comments"
        :key="comment.id"
        class="comment"
      >
        <!-- eslint-disable-next-line max-len -->
        <p>
          <strong>{{ comment.User.Name }} ({{ comment.User.Role }}):</strong>
          {{ comment.content }} <br />
          <small>{{ formatDate(comment.created_at) }}</small>
        </p>
      </div>
      <textarea
        v-model="newComment"
        placeholder="Write a comment..."
      ></textarea>
      <button @click="addComment">Submit Comment</button>
    </div>
    <button
      @click="goBack"
      class="back-button"
    >Go Back</button>
  </div>
</template>

<script>
import axios from 'axios';
import storageService from '../../service/storageService'; // 引入storageService

export default {
  data() {
    return {
      post: {
        title: '',
        content: '',
        comments: [],
      },
      newComment: '',
    };
  },
  created() {
    this.fetchPost();
  },
  methods: {
    getImageUrl(relativePath) {
      return `http://localhost:1016/images/${relativePath}`;
    },
    fetchPost() {
      const postId = this.$route.params.id;
      const token = storageService.get(storageService.USER_TOKEN); // 获取Token

      axios.get(`http://localhost:1016/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 设置Authorization头部
        },
      })
        .then((response) => {
          this.post = response.data.data.post;
          this.post.comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        })
        .catch((error) => {
          console.error('There was an error fetching the post:', error);
        });
    },
    addComment() {
      const postId = this.$route.params.id;
      const token = storageService.get(storageService.USER_TOKEN); // 获取Token

      axios.post(`http://localhost:1016/posts/${postId}/comments`, { content: this.newComment }, {
        headers: {
          Authorization: `Bearer ${token}`, // 设置Authorization头部
        },
      })
        .then(() => {
          this.fetchPost(); // Re-fetch post to update comments
          this.newComment = ''; // Clear the textarea
        })
        .catch((error) => {
          console.error('There was an error submitting the comment:', error);
        });
    },
    goBack() {
      this.$router.push({ name: 'postlist' });
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style>
.comments-section {
  margin-top: 20px;
}

.comment {
  margin-bottom: 10px;
}

textarea {
  display: block;
  width: 100%;
  margin-top: 10px;
}
.post-cover-image {
  max-width: 100%; /* 控制图片宽度不超过容器宽度 */
  height: auto; /* 保持图片原始宽高比 */
  margin: 20px 0; /* 添加一些外边距 */
}
</style>

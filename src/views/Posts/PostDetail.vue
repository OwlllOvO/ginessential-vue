<template>
  <div class="post-detail">
    <h1>{{ post.title }}</h1>
    <h2> Drawing </h2>
    <img
      :src="getImageUrl(post.head_img)"
      alt="Post Cover Image"
      class="post-cover-image"
    />
    <h2> Description </h2>
    <p>{{ post.content }}</p>
    <div class="comments-section">
      <h3>Comments</h3>
      <div
        v-for="comment in post.comments"
        :key="comment.id"
        class="comment"
      >
        <small>{{ formatDate(comment.created_at) }}</small>
        <!-- eslint-disable-next-line max-len -->
        <p><strong>{{ comment.User.Name }} ({{ comment.User.Role }}):</strong> {{ comment.content }}</p>
      </div>
      <div>Like Count: {{ likeCount }}</div>
      <div>
        <button
          @click="likePost(post.id)"
          class="mr-2"
        >Like</button>
        <button
          @click="unlikePost(post.id)"
          class="mr-2"
        >Unlike</button>
      </div>

      <textarea
        v-model="newComment"
        placeholder="Write a comment..."
      ></textarea>
      <button @click="addComment">Submit Comment</button>
    </div>
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
      likeCount: 0,
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
          this.likeCount = response.data.data.likeCount;
        })
        .catch((error) => {
          console.error('There was an error fetching the post:', error);
        });
    },
    addComment() {
      const postId = this.$route.params.id;
      const token = storageService.get(storageService.USER_TOKEN); // 获取Token
      if (this.newComment.trim() === '') {
        // 如果评论内容为空（只包含空格也算空），提示用户并返回
        this.$bvToast.toast('Comment content cannot be empty.', {
          title: 'Error',
          variant: 'warning',
          solid: true,
        });
        return; // 终止函数执行
      }
      axios.post(`http://localhost:1016/posts/${postId}/comments`, { content: this.newComment }, {
        headers: {
          Authorization: `Bearer ${token}`, // 设置Authorization头部
        },
      })
        .then(() => {
          this.fetchPost(); // Re-fetch post to update comments
          this.newComment = ''; // Clear the textarea
          this.$bvToast.toast('Comment sent successfully', {
            title: 'Success',
            variant: 'success',
            solid: true,
          });
        })
        .catch((error) => {
          console.error('There was an error submitting the comment:', error);
        });
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    likePost(postId) {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.post(`http://localhost:1016/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        // 使用BootstrapVue Toast显示后端返回的成功信息
        this.$bvToast.toast(response.data.msg, {
          title: 'Notice',
          variant: 'success',
          solid: true,
        });
        this.fetchPost();
      })
        .catch((error) => {
          // 使用BootstrapVue Toast显示后端返回的错误信息
          this.$bvToast.toast(error.response.data.msg, {
            title: 'Error',
            variant: 'danger',
            solid: true,
          });
        });
    },
    unlikePost(postId) {
      const token = storageService.get(storageService.USER_TOKEN); // 假设这是获取用户 token 的方法
      axios.post(`http://localhost:1016/posts/${postId}/unlike`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        // 使用BootstrapVue Toast显示后端返回的成功信息
        this.$bvToast.toast(response.data.msg, {
          title: 'Notice',
          variant: 'success',
          solid: true,
        });
        this.fetchPost();
      })
        .catch((error) => {
          // 使用BootstrapVue Toast显示后端返回的错误信息
          this.$bvToast.toast(error.response.data.msg, {
            title: 'Error',
            variant: 'danger',
            solid: true,
          });
        });
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

.mr-2 {
  margin-right: 0.5rem; /* 或者根据你的设计需求调整间距大小 */
}
</style>

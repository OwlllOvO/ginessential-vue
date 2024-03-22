<template>
  <div class="post-list">
    <!-- 创建新文章按钮 -->
    <div class="create-post-button">
      <router-link
        :to="isAdmin ? `/admin/posts/create` : `/posts/create`"
        class="btn btn-primary"
      >Create New Post</router-link>
    </div>

    <!-- 文章列表 -->
    <div class="posts-container">
      <b-card
        v-for="post in posts"
        :key="post.id"
        class="post-card mb-4"
        no-body
      >
        <template #header>
          <b-card-img
            :src="getImageUrl(post.head_img)"
            alt="Post Cover Image"
            top
          ></b-card-img>
        </template>

        <b-card-body>
          <b-card-title>
            <router-link :to="isAdmin ? `/admin/posts/${post.id}` : `/posts/${post.id}`">
              {{ post.title }}
            </router-link>
          </b-card-title>
          <b-card-text>
            Category: {{ post.Category.name }}<br>
            Author: {{ post.User.Name }}
          </b-card-text>
        </b-card-body>

        <b-card-footer
          v-if="isAdmin"
          class="text-muted"
        >
          <b-button
            size="sm"
            @click="showEditForm(post)"
            variant="outline-primary"
          >Edit</b-button>
          <b-button
            size="sm"
            @click="deletePost(post.id)"
            variant="outline-danger"
          >Delete</b-button>
        </b-card-footer>
      </b-card>
    </div>

    <!-- 分页组件 -->
    <b-pagination
      v-model="currentPage"
      :total-rows="totalPosts"
      :per-page="pageSize"
      aria-controls="posts-container"
      align="center"
      class="mt-4"
    ></b-pagination>
  </div>
</template>

<script>
import axios from 'axios';
import storageService from '../../service/storageService';

export default {
  data() {
    return {
      posts: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的文章数
      totalPosts: 0, // 文章总数
    };
  },
  created() {
    this.fetchPosts();
    this.checkAdmin();
  },
  computed: {
    isAdmin() {
    // 从localStorage获取用户信息
      const userInfo = localStorage.getItem('ginessentialuser_info');
      // 检查用户信息是否存在并且用户角色是否是'Admin'
      if (userInfo) {
        const { role } = JSON.parse(userInfo);
        return role === 'Admin';
      }
      return false; // 如果没有用户信息或者角色不是'Admin'，返回false
    },
  },

  methods: {
    getImageUrl(relativePath) {
      return `http://localhost:1016/images/${relativePath}`;
    },
    fetchPosts() {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.post('http://localhost:1016/posts/page/list', {}, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: this.currentPage, pageSize: this.pageSize },
      }).then((response) => {
        this.posts = response.data.data.data;
        this.totalPosts = response.data.data.total; // 更新总文章数
      }).catch((error) => {
        console.error('There was an error fetching the posts:', error);
      });
    },
    showEditForm(post) {
      this.$router.push({ name: 'adminpostedit', params: { id: post.id } });
    },
    deletePost(postId) {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.delete(`http://localhost:1016/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        this.fetchPosts();
      }).catch((error) => {
        console.error('There was an error deleting the post:', error);
      });
    },
  },
  watch: {
    currentPage() {
      this.fetchPosts(this.currentPage);
    },
  },

};
</script>

<style scoped>
.post-list .b-card-img {
  height: 200px;
  object-fit: cover;
}

.posts-container {
  column-count: 3;
  column-gap: 1rem;
}

.post-card {
  display: inline-block; /* Important for column layout */
  width: 100%;
  break-inside: avoid; /* Avoid breaking inside the card */
}

@media (max-width: 768px) {
  .posts-container {
    column-count: 2;
  }
}

@media (max-width: 576px) {
  .posts-container {
    column-count: 1;
  }
}

.b-card-img {
  height: 200px; /* Set a fixed height for images */
  object-fit: cover; /* Cover the entire area without stretching the image */
}
</style>

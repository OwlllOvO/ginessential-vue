<template>
  <div class="user-posts">
    <h1> {{ userName }}</h1>
    <!-- 作品列表 -->
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
            <router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link>
          </b-card-title>
          <b-card-text>
            Category: {{ post.Category.name }}<br>
            Author: {{ post.User.Name }}
          </b-card-text>
        </b-card-body>
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

export default {
  data() {
    return {
      posts: [],
      currentPage: 1,
      pageSize: 10,
      totalPosts: 0,
      userName: '',
    };
  },
  created() {
    this.fetchUserPosts();
  },
  methods: {
    getImageUrl(relativePath) {
      return `http://localhost:1016/images/${relativePath}`;
    },
    fetchUserPosts() {
      const userId = this.$route.params.id;
      axios.get(`http://localhost:1016/user/${userId}`, {
        params: { pageNum: this.currentPage, pageSize: this.pageSize },
      }).then((response) => {
        this.userName = response.data.data.userName;
        this.posts = response.data.data.posts;
        this.totalPosts = response.data.data.posts.length; // 假设后端返回了总作品数
      }).catch((error) => {
        console.error('There was an error fetching the user\'s posts:', error);
      });
    },
  },
  watch: {
    currentPage() {
      this.fetchUserPosts();
    },
  },
};
</script>

<style scoped>
.posts-container {
  column-count: 3;
  column-gap: 1rem;
  max-width: 100%;
  break-inside: avoid;
}

.post-card {
  break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: 1rem;
}

/* 为了响应式布局，根据屏幕尺寸调整列数 */
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
  height: auto;
  max-height: 200px;
  object-fit: cover;
}
</style>

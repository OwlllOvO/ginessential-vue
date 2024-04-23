<template>
  <div class="post-list">
    <!-- 作品排行榜 -->
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
          <div class="post-header">
            <b-card-title>
              <router-link :to="isAdmin ? `/admin/posts/${post.id}` : `/posts/${post.id}`">
                {{ post.title }}
              </router-link>
            </b-card-title>
            <span :class="['rank-badge', getRankClass(post.rank)]">No. {{ post.rank }}</span>
          </div>
          <b-card-text>
            Category: {{ post.Category.name }}<br>
            Author: {{ post.User.Name }}<br>
            Likes: {{ post.like_count }}
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
import storageService from '../../service/storageService';

export default {
  data() {
    return {
      posts: [],
      currentPage: 1,
      pageSize: 10,
      totalPosts: 0,
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
    getRankClass(rank) {
      switch (rank) {
        case 1: return 'gold';
        case 2: return 'silver';
        case 3: return 'bronze';
        default: return 'gray';
      }
    },
    getImageUrl(relativePath) {
      return `http://localhost:1016/images/${relativePath}`;
    },
    fetchPosts() {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.get('http://localhost:1016/posts/rank', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: this.currentPage, pageSize: this.pageSize },
      }).then((response) => {
        this.posts = this.isAdmin ? response.data.data.data : response.data.data.data.filter((post) => post.status === 'Approved');
        this.totalPosts = response.data.data.total;
      }).catch((error) => {
        console.error('There was an error fetching the posts:', error);
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
.rank-badge {
  padding: 4px 10px;
  border-radius: 15px;
  color: #fff;
  font-size: 0.75rem;
  margin-left: 8px;
}

.gold {
  background-color: #ffd700; /* 金色 */
}

.silver {
  background-color: #c0c0c0; /* 银色 */
}

.bronze {
  background-color: #cd7f32; /* 铜色 */
}

.gray {
  background-color: #808080; /* 灰色 */
}

.create-post-button {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  margin-top: 20px; /* 与上部分的距离 */
  margin-bottom: 20px; /* 与下部分的距离，根据需要调整 */
}

.post-list .b-card-img {
  height: 200px;
  object-fit: cover;
}

.posts-container {
  column-count: 3;
  column-gap: 1rem;
  margin-top: 20px;
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

.post-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 15px;
  color: white;
  font-size: 0.75rem;
  text-transform: capitalize;
  margin-top: -0.5rem; /* Adjust the vertical position of the badge relative to the title */
}
.status-pending {
  background-color: #ffc107; /* Amber */
}

.status-approved {
  background-color: #28a745; /* Green */
}

.status-rejected {
  background-color: #dc3545; /* Red */
}

.mr-2 {
  margin-right: 0.5rem; /* 或者根据你的设计需求调整间距大小 */
}
</style>

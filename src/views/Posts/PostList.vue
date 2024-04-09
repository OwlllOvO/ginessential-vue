<template>
  <div class="post-list">
    <!-- 创建新作品按钮 -->
    <div class="create-post-button">
      <router-link
        :to="isAdmin ? `/admin/posts/create` : `/posts/create`"
        class="btn btn-primary"
      >Create New Post</router-link>
    </div>

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
          <div class="post-header">
            <b-card-title>
              <router-link :to="isAdmin ? `/admin/posts/${post.id}` : `/posts/${post.id}`">
                {{ post.title }}
              </router-link>
            </b-card-title>

            <span
              v-if="isAdmin"
              class="status-badge"
              :class="`status-${post.status.toLowerCase()}`"
            >{{ post.status }}</span>

          </div>
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
            class="mr-2"
          >Edit</b-button>
          <b-button
            size="sm"
            @click="deletePost(post.id)"
            variant="outline-danger"
            class="mr-2"
          >Delete</b-button>
          <b-button
            v-if="post.status === 'Pending'"
            size="sm"
            @click="approvePost(post.id)"
            variant="outline-success"
            class="mr-2"
          >Approve</b-button>
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
      pageSize: 1000, // 每页显示的作品数
      totalPosts: 0, // 作品总数
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
        // 过滤作品，如果不是Admin，则仅显示状态为"Approved"的作品
        this.posts = this.isAdmin ? response.data.data.data : response.data.data.data.filter((post) => post.status === 'Approved');
        this.totalPosts = response.data.data.total; // 更新总作品数
      }).catch((error) => {
        console.error('There was an error fetching the posts:', error);
      });
    },
    showEditForm(post) {
      this.$router.push({ name: 'adminpostedit', params: { id: post.id } });
    },
    approvePost(postId) {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.post(`http://localhost:1016/admin/posts/${postId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        this.$bvToast.toast('Post approved successfully', {
          title: 'Success',
          variant: 'success',
          solid: true,
        });
        this.fetchPosts();
      }).catch((error) => {
        const message = error.response && error.response.data && error.response.data.data && error.response.data.data.error ? error.response.data.data.error : 'There was an error approving the post.';
        console.error(message);
        this.$bvToast.toast(message, {
          title: 'Error',
          variant: 'danger',
          solid: true,
        });
      });
    },
    deletePost(postId) {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.delete(`http://localhost:1016/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        this.$bvToast.toast('Post deleted successfully', {
          title: 'Success',
          variant: 'success',
          solid: true,
        });
        this.fetchPosts();
      }).catch((error) => {
        // 如果后端返回了错误信息，则显示后端的错误信息，否则显示默认的错误信息
        const message = error.response && error.response.data && error.response.data.data && error.response.data.data.error ? error.response.data.data.error : 'There was an error deleting the post.';
        console.error(message);
        this.$bvToast.toast(message, {
          title: 'Error',
          variant: 'danger',
          solid: true,
        });
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

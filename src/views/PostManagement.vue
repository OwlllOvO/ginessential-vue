<template>
  <div class="post-management">
    <!-- 文章列表视图 -->
    <div v-if="viewMode === 'list'">
      <router-link to="/posts/create">Create New Post</router-link>

      <b-table
        striped
        hover
        :items="posts"
        :fields="fields"
      >
        <template #cell(actions)="data">
          <b-button
            size="sm"
            @click="showEditForm(data.item)"
            variant="primary"
          >Edit</b-button>
          <b-button
            size="sm"
            @click="deletePost(data.item.id)"
            variant="danger"
          >Delete</b-button>
        </template>
      </b-table>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
// eslint-disable-next-line import/extensions
import storageService from '../service/storageService'; // 确保路径正确

export default {
  data() {
    return {
      posts: [],
      viewMode: 'list', // 'list' 或 'form'
      formMode: 'create', // 'create' 或 'edit'
      currentPost: {
        category_id: null,
        title: '',
        head_img: '',
        content: '',
      },
      fields: [
        { key: 'title', sortable: true },
        { key: 'category_id', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
    };
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    fetchPosts() {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.post('http://localhost:1016/posts/page/list', {}, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 10 }, // 根据需要调整分页参数
      }).then((response) => {
        this.posts = response.data.data.data; // 从响应中获取文章列表
        this.totalRows = response.data.data.total; // 假设后端返回了总条数，如果没有，请相应调整
      }).catch((error) => {
        console.error('There was an error fetching the posts:', error);
      });
    },

    showCreateForm() {
      this.currentPost = {
        category_id: null, title: '', head_img: '', content: '',
      };
      this.viewMode = 'form';
      this.formMode = 'create';
    },
    showEditForm(post) {
      this.currentPost = { ...post };
      this.viewMode = 'form';
      this.formMode = 'edit';
    },

    updatePost(postId) {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.put(`http://localhost:1016/posts/${postId}`, this.currentPost, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        this.fetchPosts();
        this.viewMode = 'list';
      }).catch((error) => {
        console.error('There was an error updating the post:', error);
      });
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
    cancelForm() {
      this.viewMode = 'list';
    },
  },
};
</script>

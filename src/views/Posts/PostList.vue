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
        <!-- 文章标题 -->
        <template #cell(title)="data">
          <router-link :to="`/posts/${data.item.id}`">{{ data.item.title }}</router-link>
        </template>

        <!-- 封面图片 -->
        <template #cell(head_img)="data">
          <img
            :src="getImageUrl(data.item.head_img)"
            alt="Post Cover Image"
            class="post-cover-image"
          />
        </template>

        <!-- 分类名称 -->
        <template #cell(category)="data">
          {{ data.item.Category.name }}
        </template>
        <template #cell(author)="data">
          {{ data.item.User.Name }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import storageService from '../../service/storageService';

export default {
  data() {
    return {
      posts: [],
      viewMode: 'list',
      fields: [
        { key: 'title', sortable: true },
        { key: 'head_img', label: 'Cover Image' },
        { key: 'Category.name', label: 'Category' }, // 修改这里来显示分类名称
        { key: 'User.Name', label: 'Author' },
      ],
    };
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    getImageUrl(relativePath) {
      return `http://localhost:1016/images/${relativePath}`;
    },
    fetchPosts() {
      const token = storageService.get(storageService.USER_TOKEN);
      axios.post('http://localhost:1016/posts/page/list', {}, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 10 },
      }).then((response) => {
        this.posts = response.data.data.data;
      }).catch((error) => {
        console.error('There was an error fetching the posts:', error);
      });
    },
    showEditForm(post) {
      this.$router.push({ name: 'postedit', params: { id: post.id } });
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
};
</script>

<style>
.post-cover-image {
  max-width: 200px; /* 最大宽度 */
  max-height: 200px; /* 最大高度 */
  width: auto; /* 自动调整宽度以保持图像的宽高比 */
  height: auto; /* 自动调整高度以保持图像的宽高比 */
}
</style>

<!-- eslint-disable max-len -->
<template>
  <div class="post-detail">
    <h1>{{ post.title }}</h1>
    <h2>Drawing</h2>
    <img
      :src="getImageUrl(post.head_img)"
      alt="Post Cover Image"
      class="post-cover-image"
    />
    <h2>Description</h2>
    <p>{{ post.content }}</p>
    <p>Created by
      <router-link
        :to="`/user/${post.User.ID}`"
        class="comment-author"
      >{{ post.User.Name }}
      </router-link>
      on {{ formatDate(post.created_at) }}
    </p>
    <div
      v-if="isPostLiked"
      @click="handleLikeOrUnlike(post.id)"
      class="like-icon"
    >
      <svg
        viewBox="0 0 1024 1024"
        class="icon liked"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- 实心图标路径 -->
        <path
          d="M860.032 341.12h-182.08c7.488-17.408 14.72-38.528 18.048-60.544 5.952-39.872 4.992-87.36-18.368-129.088-21.76-38.848-50.304-60.928-83.52-61.376-30.72-0.384-53.888 18.176-65.728 33.408a199.296 199.296 0 0 0-32.064 59.264l-1.92 5.184c-5.44 14.976-10.88 29.952-23.04 51.456-19.712 34.816-48.832 56.128-77.696 74.368a391.936 391.936 0 0 1-30.976 17.92v552.448a4621.952 4621.952 0 0 0 351.872-5.312c51.264-2.752 100.672-28.544 127.488-76.032 24.32-43.136 55.168-108.16 74.368-187.264 20.416-84.16 24.64-152.704 24.576-195.968-0.128-46.336-38.72-78.4-80.96-78.4z m-561.344 541.312V341.12H215.808c-59.712 0-113.408 42.048-120.896 104.32a1376 1376 0 0 0 0.64 330.368c7.36 58.688 56.128 100.032 113.024 102.848 25.024 1.28 55.552 2.56 90.112 3.712z"
          p-id="4448"
          fill="#FF6699"
        ></path>
      </svg>
      <span>{{ likeCount }}</span>
    </div>

    <!-- 如果未点赞，显示空心图标 -->
    <div
      v-else
      @click="handleLikeOrUnlike(post.id)"
      class="like-icon"
    >
      <svg
        viewBox="0 0 1024 1024"
        class="icon unliked"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- 空心图标路径 -->
        <path
          d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z"
          p-id="3324"
          fill="#9499a0"
        ></path>
      </svg>
      <span>{{ likeCount }}</span>
    </div>

    <textarea
      v-model="newComment"
      placeholder="Write a comment..."
    ></textarea>
    <button
      @click="addComment"
      class="submit-comment"
    >Submit Comment</button>
    <button
      @click="startChat"
      class="start-chat-btn"
    >Start Chat</button>

    <h2>Comments</h2>
    <div>
      <div
        v-for="comment in post.comments"
        :key="comment.id"
        class="comment card"
      >
        <div class="card-body">
          <p class="card-title">
            <router-link
              :to="`/user/${comment.User.ID}`"
              class="comment-author"
            >
              <strong>
                {{ comment.User.Name }} ({{ comment.User.Role }})
              </strong>
            </router-link>
            <small>
              {{ formatDate(comment.created_at) }}
            </small>
          </p>
          <p class="card-text">{{ comment.content }}</p>

          <button
            @click="startChatWithCommentAuthor(comment.User.ID, post.id)"
            class="start-comment-chat-btn"
          >
            Start Chat
          </button>
        </div>
      </div>
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
      isPostLiked: false,
    };
  },
  created() {
    this.fetchPost();
    this.isLiked();
  },
  methods: {
    startChatWithCommentAuthor(commentAuthorId, postId) {
      this.$router.push({ path: `/chat/${commentAuthorId}/${postId}` });
    },
    startChat() {
      // 使用 Vue Router 的编程式导航来跳转到聊天页面
      // 'authorId' 和 'id' 是从 post 对象中获取的，分别代表作者的 ID 和作品的 ID
      this.$router.push({ path: `/chat/${this.post.user_id}/${this.post.id}` });
    },
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
    isLiked() {
      const postId = this.$route.params.id;
      const token = storageService.get(storageService.USER_TOKEN);
      axios.get(`http://localhost:1016/posts/${postId}/isliked`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        this.isPostLiked = response.data.data.isLiked; // 根据后端返回更新点赞状态
      }).catch((error) => {
        console.error('There was an error checking like status:', error);
      });
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
        this.isLiked();
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
        this.isLiked();
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
    handleLikeOrUnlike(postId) {
      if (this.isPostLiked) {
        this.unlikePost(postId); // 如果已点赞，则调用 unlikePost
      } else {
        this.likePost(postId); // 如果未点赞，则调用 likePost
      }
    },
  },
};
</script>

<style>
.comment.card {
  background-color: #fff; /* 卡片背景色 */
  border: 1px solid #ddd; /* 卡片边框 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
  margin-bottom: 20px; /* 卡片间距 */
  border-radius: 5px; /* 卡片圆角 */
}

.card-body {
  padding: 20px; /* 卡片内边距 */
}

.card-title {
  margin-bottom: 15px; /* 标题与内容间距 */
  font-size: 16px; /* 标题字体大小 */
}

.card-text {
  font-size: 14px; /* 内容字体大小 */
}

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

.submit-comment {
  margin-top: 0.5rem;
}

.icon {
  width: 20px; /* 图标大小 */
  height: 20px;
  margin-right: 5px; /* 图标和点赞数之间的距离 */
}

.submit-comment,
.start-chat-btn {
  padding: 10px 20px; /* 增加内边距，使按钮更大更易点击 */
  border-radius: 5px; /* 圆角边框 */
  border: 1px solid transparent; /* 透明边框，可根据需要调整 */
  cursor: pointer; /* 鼠标悬停时变成手指图标，表示可点击 */
  transition: background-color 0.3s, color 0.3s, border-color 0.3s; /* 平滑过渡效果 */
  margin-right: 10px;
}

.start-comment-chat-btn {
  border-radius: 5px; /* 圆角边框 */
  border: 1px solid transparent; /* 透明边框，可根据需要调整 */
  cursor: pointer; /* 鼠标悬停时变成手指图标，表示可点击 */
  transition: background-color 0.3s, color 0.3s, border-color 0.3s; /* 平滑过渡效果 */
  margin-right: 10px;
  background-color: #007bff; /* 开始聊天按钮的背景颜色 */
  color: white; /* 开始聊天按钮的文本颜色 */
}

.submit-comment {
  background-color: #4caf50; /* 提交按钮的背景颜色 */
  color: white; /* 提交按钮的文本颜色 */
}

.start-chat-btn {
  background-color: #007bff; /* 开始聊天按钮的背景颜色 */
  color: white; /* 开始聊天按钮的文本颜色 */
}

.submit-comment:hover,
.start-chat-btn:hover {
  background-color: #45a049; /* 提交按钮的鼠标悬停背景颜色 */
  color: #ffffff; /* 提交按钮的鼠标悬停文本颜色 */
  border-color: #3e8e41; /* 提交按钮的鼠标悬停边框颜色 */
}

.start-chat-btn:hover {
  background-color: #0056b3; /* 开始聊天按钮的鼠标悬停背景颜色 */
  color: #ffffff; /* 开始聊天按钮的鼠标悬停文本颜色 */
  border-color: #004085; /* 开始聊天按钮的鼠标悬停边框颜色 */
}
</style>

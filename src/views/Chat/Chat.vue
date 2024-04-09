<template>
  <div class="chat-page-container">
    <div class="post-content">
      <!-- 作品内容显示区域 -->
      <h1>{{ post.title }}</h1>
      <img
        :src="getImageUrl(post.head_img)"
        alt="Post Cover"
        class="post-cover-image"
      >
      <h2>Description</h2>
      <p>{{ post.content }}</p>
      <h2>Author</h2>
      <p>{{ post.User.Name }}</p>
    </div>
    <div class="chat-container">
      <div
        class="messages"
        ref="messagesContainer"
      >
        <div
          v-for="message in messages"
          :key="message.ID"
          :class="{'mine': message.sender_id == userId, 'theirs': message.sender_id != userId}"
        >
          <div class="message-content">{{ message.content }}</div>
          <div class="message-date">{{ formatDate(message.created_at) }}</div>
        </div>
      </div>
      <div class="send-message">
        <textarea
          v-model="newMessage"
          placeholder="Type a message..."
        ></textarea>
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import storageService from '../../service/storageService'; // Adjust the import path based on your project structure

export default {
  data() {
    return {
      post: {
        title: '',
        content: '',
        comments: [],
      },
      messages: [],
      newMessage: '',
      userId: null,
      receiverId: this.$route.params.id,
      postid: this.$route.params.postid,
      pollingInterval: null,
    };
  },
  created() {
    this.userId = storageService.get(storageService.USER_ID);
    this.receiverId = this.$route.params.id;
    this.postid = this.$route.params.postid;
    this.fetchPost();
    this.fetchMessages();
    this.startPolling();
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  },
  methods: {
    getImageUrl(relativePath) {
      return `http://localhost:1016/images/${relativePath}`;
    },
    fetchPost() {
      const token = storageService.get(storageService.USER_TOKEN); // 获取Token
      axios.get(`http://localhost:1016/posts/${this.postid}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 设置Authorization头部
        },
      })
        .then((response) => {
          this.post = response.data.data.post;
        })
        .catch((error) => {
          console.error('There was an error fetching the post:', error);
        });
    },
    getUserInfo() {
      return JSON.parse(storageService.get(storageService.USER_INFO));
    },
    fetchMessages() {
      axios.get(`http://localhost:1016/messages?receiver_id=${this.receiverId}&post_id=${this.postid}`, {
        headers: { Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}` },
      }).then((response) => {
        this.messages = response.data.data.messages;
        // 如果用户已经在底部，获取新消息后自动滚动到底部
        this.$nextTick(() => {
          const { messagesContainer } = this.$refs;
          // 滚动到消息容器的底部
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
      }).catch((error) => {
        console.error('Failed to fetch messages', error);
      });
    },

    sendMessage() {
      if (!this.newMessage.trim()) return;

      const payload = {
        receiver_id: Number(this.receiverId),
        content: this.newMessage,
        post_id: this.postid,
      };

      axios.post('http://localhost:1016/message', payload, {
        headers: { Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}` },
      }).then(() => {
        this.newMessage = '';
        this.fetchMessages();
      }).catch((error) => {
        console.error('Failed to send message', error);
      });
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.fetchMessages();
      }, 5000);
    },
  },
};
</script>

<style scoped>
.chat-page-container {
  display: flex;
}

.post-content {
  /* 作品内容区域的整体样式，包括背景色、边距、内边距等 */
  background-color: #fff; /* 白色背景 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 阴影效果 */
  padding: 20px; /* 内边距 */
  margin: 20px; /* 外边距，与其他元素保持一定距离 */
  max-width: 300px; /* 最大宽度，保持内容不会过宽 */
}

.chat-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 80vh;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column-reverse;
}

.mine,
.theirs {
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 5px 10px;
}

.mine {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.theirs {
  align-self: flex-start;
  background-color: #e9e9eb;
}

.message-content {
  margin: 0;
}

.message-date {
  font-size: 0.75rem;
  text-align: left;
  color: #888;
}

.send-message {
  display: flex;
  padding: 10px;
}

.send-message textarea {
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.send-message button {
  padding: 10px 15px;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.send-message button:hover {
  background-color: #0056b3;
}

.post-cover-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}
</style>

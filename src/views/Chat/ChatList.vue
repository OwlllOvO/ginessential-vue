<!-- eslint-disable max-len -->
<template>
  <div class="chat-list-container">
    <h2>Messages</h2>
    <div class="chat-list">
      <div
        v-for="conversation in conversations"
        :key="conversation.post_id"
        @click="goToChat(conversation.sender_id, conversation.post_id)"
        class="chat-item"
      >
        <div class="text-content">
          <h3>{{ conversation.sender_name }}</h3>
          <p>Post: {{ conversation.post_title }}</p>
          <p>Last Message: "{{ conversation.last_message_content }}"</p>
          <p>at {{ formatDate(conversation.last_message_time) }}</p>
        </div>
        <img
          :src="getImageUrl(conversation.post_head_img)"
          alt="Post Cover Image"
          class="post-cover-image"
        />
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
      conversations: [],
    };
  },
  created() {
    this.fetchConversations();
  },
  methods: {
    getImageUrl(relativePath) {
      return `http://localhost:1016/images/${relativePath}`;
    },
    fetchConversations() {
      axios.get('http://localhost:1016/chatlist', {
        headers: { Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}` },
      }).then((response) => {
        this.conversations = response.data.data.conversations;
      }).catch((error) => {
        console.error('Failed to fetch conversations', error);
      });
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    goToChat(senderId, postId) {
      this.$router.push({ name: 'Chat', params: { id: senderId, postid: postId } });
    },
  },
};
</script>

<style scoped>
.chat-list-container {
  padding: 20px;
}

.chat-list {
  margin-top: 20px;
}

.chat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.chat-item:hover {
  background-color: #f0f0f0;
}

.text-content {
  flex: 1; /* Allow text content to grow */
}

h3 {
  margin: 0;
  padding: 0;
  font-size: 1.2em;
}

p {
  margin: 5px 0;
  font-size: 0.9em;
}

.post-cover-image {
  width: auto; /* Keep image aspect ratio */
  height: 100%; /* Make image height match its container */
  max-height: 100px; /* Limit image height */
  margin-left: 20px; /* Space between text and image */
}
</style>

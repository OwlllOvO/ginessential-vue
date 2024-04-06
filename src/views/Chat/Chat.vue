<template>
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
</template>

<script>
import axios from 'axios';
import storageService from '../../service/storageService'; // Adjust the import path based on your project structure

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
      userId: null,
      receiverId: this.$route.params.id,
    };
  },
  created() {
    this.userId = storageService.get(storageService.USER_ID);
    console.log(this.userId);
    this.fetchMessages();
    this.startPolling();
  },
  methods: {
    getUserInfo() {
      return JSON.parse(storageService.get(storageService.USER_INFO));
    },
    fetchMessages() {
      axios.get(`http://localhost:1016/messages?receiver_id=${this.receiverId}`, {
        headers: { Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}` },
      }).then((response) => {
        const { messagesContainer } = this.$refs; // 确保你的聊天记录容器有ref="messagesContainer"
        // 检查是否已经滚动到底部
        // eslint-disable-next-line max-len
        const isScrolledToBottom = messagesContainer.scrollHeight - messagesContainer.clientHeight <= messagesContainer.scrollTop + 1;

        this.messages = response.data.data.messages;
        this.messages.reverse();
        // 如果用户已经在底部，获取新消息后自动滚动到底部
        if (isScrolledToBottom) {
          this.$nextTick(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          });
        }
      }).catch((error) => {
        console.error('Failed to fetch messages', error);
      });
    },

    sendMessage() {
      if (!this.newMessage.trim()) return;

      const payload = {
        receiver_id: Number(this.receiverId),
        content: this.newMessage,
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
      setInterval(() => {
        this.fetchMessages();
      }, 5000);
    },
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.messages {
  flex-grow: 1;
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: 80vh; /* Limit the maximum height to 80% of the viewport height */
  margin-bottom: 10px; /* Space between messages and send-message box */
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.mine {
  align-self: flex-end;
  background-color: #dcf8c6;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 5px 10px;
}

.theirs {
  align-self: flex-start;
  background-color: #e9e9eb;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 5px 10px;
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
</style>

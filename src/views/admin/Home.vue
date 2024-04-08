<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <button @click="goToPosts">Posts</button>
    <button @click="goToUsers">Users</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToPosts() {
      this.$router.push({ name: 'adminpostlist' });
    },
    goToUsers() {
      this.$router.push({ name: 'adminuserlist' });
    },
  },
};
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px;
}
</style>

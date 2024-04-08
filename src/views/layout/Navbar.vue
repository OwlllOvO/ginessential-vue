<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="info"
    >
      <b-container>
        <b-navbar-brand @click="$router.push({name: 'postlist'})">Home</b-navbar-brand>
        <b-navbar-brand @click="$router.push({name: 'postrank'})">Rank</b-navbar-brand>
        <b-navbar-brand @click="$router.push({name: 'ChatList'})">Messages</b-navbar-brand>
        <b-navbar-brand
          v-if="isAdmin"
          @click="goToAdminHome"
        >Admin</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse
          id="nav-collapse"
          is-nav
        >
          <!-- Bootstrap 自带导航栏内容
      <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav> -->

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <!-- 搜索
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form> -->

            <!-- 语言
        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->

            <!-- 用户 -->
            <b-nav-item-dropdown
              right
              v-if="userInfo"
            >
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>{{userInfo.name}}</em>
              </template>
              <!-- eslint-disable-next-line max-len -->
              <b-dropdown-item @click="goToUserProfile">Personal Page</b-dropdown-item>
              <b-dropdown-item @click="logout">Log Out</b-dropdown-item>
            </b-nav-item-dropdown>
            <div v-if="!userInfo">
              <b-nav-item
                v-if="$route.name != 'login'"
                @click="$router.replace({name: 'login'})"
              >Login</b-nav-item>
              <b-nav-item
                v-if="$route.name != 'register'"
                @click="$router.replace({name: 'register'})"
              >Register</b-nav-item>
            </div>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import storageService from '../../service/storageService'; // 引入storageService

export default {
  computed: mapState({
    userInfo: (state) => state.userModule.userInfo,
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
  }),

  methods: {
    ...mapActions('userModule', ['logout']),
    goToUserProfile() {
    // 从localStorage中获取userid
      const userid = storageService.get(storageService.USER_ID);
      // 如果userid存在，则跳转到用户主页
      if (userid) {
        this.$router.push({ name: 'UserPosts', params: { id: userid } });
      } else {
      // 如果没有找到userid，可能需要处理用户未登录的情况
        console.log('User ID not found. User might not be logged in.');
      }
    },
    goToAdminHome() {
      this.$router.push({ name: 'adminhome' });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

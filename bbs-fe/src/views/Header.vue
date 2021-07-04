<template>
  <div class="container-fluid">
    <router-link to="/" class="bbs">
      <strong> BBS </strong>
    </router-link>
    <div class="status">
      <span v-if="user.current">
        <span >hi {{ user.current.email }}</span> <span class="logout" @click="logout">登出</span>
      </span>
      <span v-else>
        <router-link to="/login">登录</router-link> <router-link to="/register">注册</router-link>
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  inject: ['user'],
  methods: {
    async logout() {
      await axios.get('/api/logout')
      this.user.current = null
    }
  }
}
</script>

<style scoped>
  /* .status {
    float: right;
  } */
  .container-fluid {
    display: flex;
    flex-wrap: inherit;
    align-items: center;
    justify-content: space-between;
    padding: .75rem;
    background-color: #f8f9fa!important;
  }
  .bbs {
    text-decoration: none;
  }
  .logout {
    cursor: pointer;
  }
</style>
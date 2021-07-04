<template>
  <div id="app">
    <Header />
    <div id="nav">
      <router-link to="/">首页</router-link> |
      <router-link to="/add-post">发帖</router-link> |
      <router-link to="/me">我的</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Header from './views/Header'
import axios from 'axios'

export default {
  data() {
    return {
      user: {
        current: null
      },
    }
  },
  provide() {
    return {
      user: this.user
    }
  },
  methods: {
    async getUserInfo() {
      let res = await axios.get('/api/userinfo')
      this.user.current = res.data.user
    }
  },
  mounted() {
    this.getUserInfo()
  },
  components: {
    Header,
  }
}
</script>

<style>
body {
  margin: 0;
  padding-right: .75rem;
  padding-left: .75rem;
  margin-right: auto;
  margin-left: auto;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

#nav {
  padding: 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

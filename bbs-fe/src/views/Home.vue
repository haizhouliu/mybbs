<template>
  <div class="home">
    <ul>
      <li v-for="post of posts" :key="post.id">
        <router-link :to="'/post/' + post.id">
          {{ post.title }}
        </router-link>
      </li>
    </ul>

    <el-pagination
      layout="prev, pager, next"
      :page-size="4"
      :current-page.sync="currPage"
      :total="totlePostCount">
    </el-pagination>
  </div>
</template>

<script>
// import api from '../api'
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      currPage: Number(this.$route.query.p ?? 1),
      posts: [],
      totlePostCount: 0,
    }
  },
  watch: {
    async currPage(page) {
      this.$router.push({path: '/', query: { p: page }})
      this.getPosts(page)
    }
  },
  methods: {
    async getPosts(page) {
      var res = await axios.get('/api/posts?p=' + page)
      var data = res.data
      this.posts = data.posts
      this.totlePostCount = data.postCount
    }
  },
  async mounted() {
    this.getPosts(this.currPage)
  }
}
</script>

<style scoped>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .home {
    text-align: center;
  }
</style>

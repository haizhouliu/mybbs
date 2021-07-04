<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p>{{ post.detail }}</p>
    <ul>
      <li v-for="comment of comments" :key="comment.id">
        <router-link :to="'/user/' + comment.userId">
          <el-avatar size="small" shape="square" :src="'/upload/' + comment.avatar"></el-avatar>
        </router-link>
        {{ comment.detail }} 
        <span class="comment-time">
          ({{ new Date(comment.commetTime).toLocaleString() }})
        </span>
      </li>
    </ul>

    <el-form v-if="user.current" ref="form">
      <el-form-item label="评论">
        <el-input type="textarea" v-model.trim="comment"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="submit-comment" type="primary" @click="addComment">提交评论</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
  span {
    color: grey;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  /* .comment-time {
     line-height: ;
  } */
  .comment-time, .submit-comment {
    float: right;
  }
</style>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      post: {},
      comments: [],
      comment: '',
    }
  },
  inject: ['user'],
  methods: {
    async addComment() { 
      if (this.comment) {
        try {
          await axios.post('/api/comment', {
            detail: this.comment,
            postId: this.$route.params.id,
          })
          this.comments.push({
            detail: this.comment,
            commetTime: new Date().toISOString(),
            userId: this.user.current.id,
            avatar: this.user.current.avatar,
          })
          this.comment = ''
        } catch(e) {
          if (e.isAxiosError) {
            this.$alert(e.response.data.msg)
          } else {
            throw e
          }
        }
      }
    }
  },
  async mounted() {
    var res = await axios.get('/api/post/' + this.$route.params.id)
    this.post = res.data.post
    this.comments = res.data.comments
  }
}
</script>
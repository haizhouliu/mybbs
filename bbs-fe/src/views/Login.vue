<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model.trim="email"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model.trim="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-dialog
      title="登录错误"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>登录失败</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
      dialogVisible: false,
    }
  },
  inject: ['user'],
  methods: {
    async login() {
      try{
        var res = await axios.post('/api/login', {
          email: this.email,
          password: this.password
        })
        var userInfo = res.data.user
        this.user.current = userInfo
        this.$router.go(-1)
      } catch(e) {
        // let err = e
        if (e.isAxiosError) {
          this.$alert(e.response.data.msg)
          // this.$confirm(e.response.data.msg)
        } else {
          throw e
        }
      }
    }
  }
}
</script>
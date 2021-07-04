const express = require('express')
const md5 = require('md5')

const router = express.Router()

const dbPromise = require('./db')

let db
dbPromise.then(result => {
  db = result
})

// 获取帖子列表
router.get('/posts', async (req, res, next) => {
  let page = Number(req.query.p ?? '1')
  let size = 4
  let posts = await db.all(`
    SELECT posts.rowid AS id, posts.*, users.email, users.avatar
      FROM posts JOIN users ON posts.userId = users.rowid
      ORDER BY createAT DESC
      LIMIT ?,?
  `, (page - 1) * size, size)
  let postCount = (await db.get('SELECT COUNT(*) AS count FROM posts')).count
  res.json({
    code: 0,
    posts: posts,
    postCount: postCount
  })
})

// 获取某条帖子的详情
router.get('/post/:id', async (req, res, next) => {
  var post = await db.get(`
    SELECT rowid AS id, * 
      FROM posts 
      WHERE id = ?
  `, req.params.id)
  if (post) {
    var comments = await db.all(`
      SELECT comments.rowid AS id, comments.createAt as commetTime, * 
        FROM comments JOIN users ON userId = users.rowid 
        WHERE postId = ?
    `, req.params.id)
    res.json({
      code: 0,
      post,
      comments
    })
  } else {
    res.status(404).json({
      code: -1,
      msg: '没有这个帖子'
    })
  }
})

// 获取已登陆用户的信息
router.get('/userinfo', async (req, res, next) => {
  if (req.signedCookies.loginUser) {
    res.json({
      code: 0,
      user: req.user// 前面中间件写在req对象上的字段，为当前登录用户
    })
  } else {
    res.status(401).json({
      code: -1,
      msg: '未登录'
    })
  }
})

// 发表评论
router.post('/comment', async (req, res, next) => {
  if (req.user) {// 有用户登陆
    var comment = req.body
    await db.run(
      'INSERT INTO comments VALUES (?,?,?,?)',
      comment.detail, req.user.id, comment.postId, new Date().toISOString()
    )
    res.end()
  } else {
    res.status(401).json({
      code: -1,
      msg: '未登录'
    })
  }
})

// 登录
router.post('/login', async (req, res, next) => {
  let loginInfo = req.body
  let user = await db.get(
    'SELECT * FROM users WHERE email = ?',
    loginInfo.email
  )
  if (user) {
    if (user.password != md5(md5(loginInfo.password) + md5(user.salt))) {
      res.status(401).json({
        code: -1,
        msg: '用户名或密码错误'
      })
      return
    }
    res.cookie('loginUser', user.email, {
      maxAge: 3 * 60 * 60 * 1000,
      signed: true
    })
    // res.end()
    delete user.password
    res.json({
      code: 0,
      user,
    })
  } else {
    // 401 un authorized
    res.status(401).json({
      code: -1,
      msg: '用户名或密码错误'
    })
  }
})

// 登出
router.get('/logout', async (req, res, next) => {
  res.clearCookie('loginUser')
  res.end()
})

// 发帖
router.post('/post', async (req, res, next) => {
  var info = req.body
  if (req.user) {
    let stmt = await db.run(
      'INSERT INTO posts VALUES (?,?,?,?)',
      info.title, info.detail, req.user.id, new Date().toISOString()
    )
    res.json({
      code: 0,
      postId: stmt.lastID
    })//刚刚插入的一行的id
  } else {
    res.json({
      code: -1,
      msg: 'user not login!'
    })
  }
})

module.exports = router

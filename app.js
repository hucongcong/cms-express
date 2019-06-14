const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const app = express()
app.listen(9999, () => {
  console.log('服务器启动成功了')
})

// 静态资源
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 处理路由
app.get('/login', (req, res) => {
  res.render('login')
})

// 处理登录功能
app.post('/login', (req, res) => {
  const { username, password } = req.body
  // 查询数据
  db.findUser(username, password, data => {
    // console.log(data)
    if (data) {
      res.redirect('/')
      // 登录成功
    } else {
      // 登录失败
      res.send('<script>alert("登录失败"); location.href="/login";</script>')
    }
  })
})

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/add', (req, res) => {
  res.render('add')
})

app.get('/edit', (req, res) => {
  res.render('edit')
})

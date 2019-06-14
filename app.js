const express = require('express')
const app = express()
app.listen(9999, () => {
  console.log('服务器启动成功了')
})

// 静态资源
app.engine('html', require('express-art-template'))
app.use(express.static('public'))

// 处理路由
app.get('/login', (req, res) => {
  res.render('login.html')
})

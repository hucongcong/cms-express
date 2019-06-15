const express = require('express')
const upload = require('./utils/upload')
const session = require('express-session')
const db = require('./db')
const md5 = require('md5')
const app = express()
app.listen(9999, () => {
  console.log('服务器启动成功了')
})
// 默认空对象
app.locals.user = {}
// 静态资源
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
    rolling: true
  })
)

// 登录中间件的拦截
app.use((req, res, next) => {
  if (req.url === '/login' || req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
})
// 处理路由
app.get('/login', (req, res) => {
  res.render('login')
})

// 处理登录功能
app.post('/login', upload.none(), (req, res) => {
  const { username, password } = req.body
  // 查询数据
  db.findUser(username, md5(password), data => {
    // console.log(data)
    if (data) {
      // 保存用户信息
      req.session.user = data
      // 保存到全局中
      app.locals.user = data
      res.redirect('/')
      // 登录成功
    } else {
      // 登录失败
      res.send('<script>alert("登录失败"); location.href="/login";</script>')
    }
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  app.locals.user = {}
  res.redirect('/login')
})

app.get('/', (req, res) => {
  // 获取到所有的产品数据
  db.findAllProducts(data => {
    res.render('index', { list: data })
  })
})

app.get('/delete', (req, res) => {
  const id = req.query.id
  db.deleteProduct(id, () => {
    res.redirect('/')
  })
})

app.get('/add', (req, res) => {
  res.render('add')
})

app.post('/add', upload.single('pic'), (req, res) => {
  db.insertProduct(
    {
      ...req.body,
      pic: req.file.path
    },
    () => {
      res.redirect('/')
    }
  )
})

app.get('/edit', (req, res) => {
  const id = req.query.id
  db.findProduct(id, product => {
    res.render('edit', { product: product })
  })
})

app.post('/edit', upload.single('pic'), (req, res) => {
  const { id, title, price, free, description } = req.body
  const data = {
    title,
    price,
    free,
    description
  }
  if (req.file) {
    data.pic = req.file.path
  }
  console.log(id, data)
  db.updateProduct(id, data, () => {
    res.redirect('/')
  })
})

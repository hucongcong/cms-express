var multer = require('multer')
const path = require('path')
var storage = multer.diskStorage({
  // 设置上传后文件路径，uploads文件夹会自动创建。
  destination: function(req, file, cb) {
    cb(null, './uploads')
  },
  // 给上传文件重命名，获取添加后缀名
  filename: function(req, file, cb) {
    const extname = path.extname(file.originalname)
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        '-' +
        (1000 + parseInt(Math.random() * 9000)) +
        extname
    )
  }
})
// 添加配置文件到muler对象。
var upload = multer({
  storage: storage
})

// 导出对象
module.exports = upload

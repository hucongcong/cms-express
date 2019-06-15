const { MongoClient, ObjectID } = require('mongodb')
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'cms'

async function __connect(callback) {
  const client = new MongoClient(url, { useNewUrlParser: true })
  await client.connect()
  const db = client.db(dbName)
  callback && callback(db)
  client.close()
}

function findUser(username, password, callback) {
  __connect(async db => {
    const result = await db.collection('user').findOne({ username, password })
    callback && callback(result)
  })
}

function findAllProducts(callback) {
  __connect(async db => {
    const result = await db
      .collection('product')
      .find()
      .toArray()
    callback && callback(result)
  })
}

function insertProduct(product, callback) {
  __connect(async db => {
    await db.collection('product').insertOne(product)
    callback()
  })
}

function updateProduct(id, product, callback) {
  const _id = new ObjectID(id)
  __connect(async db => {
    await db.collection('product').updateOne({ _id }, { $set: product })
    callback()
  })
}

function deleteProduct(id, callback) {
  const _id = new ObjectID(id)
  __connect(async db => {
    await db.collection('product').deleteOne({ _id })
    callback()
  })
}

function findProduct(id, callback) {
  const _id = new ObjectID(id)
  __connect(async db => {
    const product = await db.collection('product').findOne({ _id })
    callback(product)
  })
}

module.exports = {
  findUser,
  findAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
  findProduct
}

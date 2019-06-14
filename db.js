const { MongoClient } = require('mongodb')
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'cms'

async function findUser(username, password, callback) {
  const client = new MongoClient(url, { useNewUrlParser: true })
  await client.connect()
  const db = client.db(dbName)
  const result = await db.collection('user').findOne({ username, password })
  callback && callback(result)
  client.close()
}

module.exports = {
  findUser
}

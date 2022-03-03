const mongoose = require('mongoose')
const config = require('./config')
const MONGO_URI=config.SQL.url

const DBconnection = async () => {
  const conn = await mongoose
    .connect(MONGO_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
    })
    .catch(err => {
      console.log(`For some reasons we couldn't connect to the DB`.red, err)
    })

  console.log(`MongoDB Connected: ${conn.connection.host}`)
}

module.exports = DBconnection


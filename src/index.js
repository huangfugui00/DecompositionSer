
require('module-alias/register')
const express = require('express')
const morgan = require('morgan') 
var fs = require('fs')
var path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')

const app = express();
app.use(compression())
app.get('env')
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors())
// app.use(express.static('./src/static'))
app.use(express.json())
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

const cdfRouter= require('./route/cdf');
const decompositeRouter= require('./route/decomposite');
const nistRouter= require('./route/nist');
const versionOne = (routeName) => `/${routeName}`
app.use(versionOne('api/cdf'), cdfRouter)
app.use(versionOne('api/decomposite'), decompositeRouter)
app.use(versionOne('api/nist'), nistRouter)

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV!=='production') {
  console.log('production')
  app.use(express.static(path.join(__dirname, 'out')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'out/index.html'));
  });
}

global.rootPath = process.cwd()
console.log(global.rootPath)

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send({statusText:err.message})
})


const port = process.env.PORT || 3001;

app.listen(port,'0.0.0.0',()=>console.log(port))
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
})

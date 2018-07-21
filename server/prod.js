import api from './routes/api'
import connectHAF from 'connect-history-api-fallback'
import express from 'express'
import fs from 'fs'
import logger from 'morgan'
import path from 'path'
import util from 'util'

// modify logging options
util.inspect.defaultOptions.depth = 2
util.inspect.defaultOptions.colors = true

process.on('unhandledRejection', function (err, promise) {
  // you should probably add better error handling here
  throw err
})

// default port where server listens for incoming traffic
const port = process.env.PORT

const app = express()

// handle fallback for HTML5 history API
app.use(connectHAF())

// serve pure static assets
const staticPath = path.posix.join('/', '')
const staticAssets = express.static('./dist')
app.use(staticPath, function (req, res, next) {
  if (req.url === '/index.html') return next()
  else return staticAssets(req, res, next)
})

// set up logger
app.use(logger(':date[web] - [:method] - :url - :status'))

// disable cache for XHR requests
app.use(function (req, res, next) {
  if (req.xhr) res.set('Expires', '-1')
  next()
})

// set up api
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    req.session.destroy()
  }
  next()
})

app.use('/api', api)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  fs.readFile(path.join(__dirname, '../dist/index.html'), 'utf-8', function (err, data) {
    if (err) console.log(err)
    let homePage = data
    res.set('Content-Type', 'text/html')
    res.send(homePage)
    res.end()
  })
})

const server = require('http').createServer(app)
server.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
})

module.exports = {
  close: () => {
    server.close()
  }
}

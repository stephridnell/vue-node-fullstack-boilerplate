
import connectHAF from 'connect-history-api-fallback'
import express from 'express'
import hotReload from 'webpack-hot-middleware'
import logger from 'morgan'
import path from 'path'
import proxyMiddleware from 'http-proxy-middleware'
import webpack from 'webpack'
import webpackDM from 'webpack-dev-middleware'
import opn from 'opn'

import config from '../config'
import api from './routes/api'

import util from 'util'

// modify logging options
util.inspect.defaultOptions.depth = 2
util.inspect.defaultOptions.colors = true

process.on('unhandledRejection', function (err, promise) {
  throw err
})

const autoOpenBrowser = !!config.dev.autoOpenBrowser
const env = process.env.NODE_ENV || 'development'

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port

const webpackConfig = env === 'testing' || env === 'production'
  ? require('../build/webpack.prod.conf')
  : require('../build/webpack.dev.conf')

const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = webpackDM(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
  stats: {
    colors: true,
    chunks: false
  }
})

const hotMiddleware = hotReload(compiler, {
  log: () => {},
  heartbeat: 2000
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// handle fallback for HTML5 history API
app.use(connectHAF())

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

// set up logger
app.use(logger(':date[web] - [:method] - :url - :status'))

// disable cache for XHR requests
app.use(function (req, res, next) {
  if (req.xhr) res.set('Expires', '-1')
  next()
})

app.use('/api', api)

app.get('*', function (req, res, next) {
  let filename = path.join(compiler.outputPath, 'index.html')
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) return next(err)
    let homePage = result.toString('utf-8')
    res.set('Content-Type', 'text/html')
    res.send(homePage)
    res.end()
  })
})

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

const server = require('http').createServer(app)
server.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}

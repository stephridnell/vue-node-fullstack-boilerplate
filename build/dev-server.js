require('babel-register')
require('./check-versions')()
module.exports = require('../server/dev')

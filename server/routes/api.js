import express from 'express'
const router = express.Router()
import PublicApi from './public'

router.use('/public', PublicApi)

module.exports = router

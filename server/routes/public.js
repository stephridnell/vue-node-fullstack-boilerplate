import express from 'express'
let router = express.Router()

router.route('/getSample')
.get(function (req, res) {
  res.json({ message: 'Hooray! You got data from your API.' })
})

module.exports = router

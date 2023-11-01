const express = require('express')
const router = express.Router()

// const cramSchool = require('./cramSchool')

// router.use('/cramSchool', cramSchool)

router.get('/', (req, res) => {
  res.render('main')
})

module.exports = router
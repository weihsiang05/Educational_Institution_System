const express = require('express')
const router = express.Router()

const cramSchool = require('./cramSchool')

router.use('/cramSchool', cramSchool)

router.get('/', (req, res) => {

})

module.exports = router
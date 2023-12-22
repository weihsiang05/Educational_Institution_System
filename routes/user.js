const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../models')
const Users = db.user

router.post('/', async (req, res, next) => {
  const email = req.body.email
  const name = req.body.name
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  if (email.trim().length === 0 || password.trim().length === 0) {
    req.flash('error', 'Email or password field can not be blank!')
    res.redirect('/register')
  }
  else if (password.trim() !== confirmPassword.trim()) {
    req.flash('error', 'Confirm password is not match with the password!')
    res.redirect('/register')
  } else {
    const findEmail = await Users.findOne({
      where: {
        email: email
      }
    })
      .catch((error) => {
        error.errorMessage = 'Fail to create an account!'
        next(error)
      })

    console.log(findEmail)

    if (findEmail) {
      req.flash('error', 'The email has already been registed!')
      res.redirect('/register')
    } else {
      const newPassword = await bcrypt.hash(password, 10)
      const creatAccount = Users.create({
        name: name,
        email: email,
        password: newPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      })
        .catch((error) => {
          error.errorMessage = 'Fail to create an account!'
          next(error)
        })

      if (creatAccount) {
        req.flash('success', 'Success to creat an account!')
        res.redirect('/login')
      }
    }


  }
})

module.exports = router

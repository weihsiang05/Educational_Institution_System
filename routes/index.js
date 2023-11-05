const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const Users = db.user

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return Users.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user || user.password != password) {
        return done(null, false, { type: 'error', message: 'Wrong email or password! Please try again!' })
      }
      return done(null, user)
    })
    .catch((error) => {
      done(error)
    })

}))

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  done(null, { id: user.id })
})

const cramSchool = require('./cramSchool')
const user = require('./user')
const authHandler = require('../middlewares/auth-handler')

router.use('/cramSchool', authHandler, cramSchool)
router.use('/users', user)

router.get('/', (req, res) => {

})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/cramSchool',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }

    return res.redirect('/login')
  })
})

module.exports = router
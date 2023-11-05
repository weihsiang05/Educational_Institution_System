const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}


const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const router = require('./routes')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

console.log('en', process.env.NODE_ENV)
console.log(process.env.SESSION_SECRET)


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(messageHandler)

app.use(router)

app.use(errorHandler)

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

const db = require('./models')
const Users = db.user

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/users', async (req, res, next) => {
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
      const creatAccount = Users.create({
        name: name,
        email: email,
        password: password,
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

app.post('/login', (req, res) => {

})

app.post('/logout', (req, res) => {

})

app.listen(port, () => {
  console.log(`express server is running on the http://localhost:${port}`)
})
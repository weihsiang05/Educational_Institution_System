const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const router = require('./routes')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

app.use(session({
  secret: 'ThisIsSecret',
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

app.listen(port, () => {
  console.log(`express server is running on the http://localhost:${port}`)
})
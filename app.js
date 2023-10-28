const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.redirect('/cramSchool')
})

app.get('/cramSchool', (req, res) => {
  res.send('Hello!')
})

app.listen(port, () => {
  console.log(`express server is running on the http://localhost:${port}`)
})
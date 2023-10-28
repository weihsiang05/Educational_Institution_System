const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.redirect('/cramSchool')
})

app.get('/cramSchool', (req, res) => {
  res.send('Hello!')
})

//Render new student page
app.get('/crameSchool/new/student', (req, res) => {

})

//Create new student
app.post('/crameSchool/new/student', (req, res) => {

})

//render new subject page
app.get('/crameSchool/new/subject', (req, res) => {

})

//Create new subject
app.post('/crameSchool/new/subject', (req, res) => {

})

app.get('/crameSchool/:studentID/edit/homework', (req, res) => {

})

app.post('/crameSchool/:studentID/edit/homework/add', (req, res) => {

})

app.put('/crameSchool/:studentID', (req, res) => {

})

app.delete('/crameSchool/:studentID', (req, res) => {

})

app.listen(port, () => {
  console.log(`express server is running on the http://localhost:${port}`)
})
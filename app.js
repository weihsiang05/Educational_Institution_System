const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const db = require('./models')
const Student = db.student
const Subject = db.subject
const StudentHomework = db.studentHomework

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const router = require('./routes')

app.use(router)

app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.redirect('/cramSchool')
})

app.get('/cramSchool', (req, res) => {
  try {
    return Student.findAll({
      attributes: ['id', 'FiristName', 'LastName'],
      raw: true
    })
      .then((student) => {
        res.render('index', { student, message: req.flash('success'), error: req.flash('error') })
      })
      .catch((error) => {
        console.error(error)
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    return res.redirect('back')
  }
})

//Render new student page
app.get('/cramSchool/new/student', (req, res) => {
  try {
    res.render('newStudent', { error: req.flash('error') })
  } catch (error) {
    console.error(error)
  }
})

//Create new student
app.post('/cramSchool/new/student', (req, res) => {
  try {
    const student = req.body

    return Student.create({
      id: student.studentID,
      FiristName: student.firstName,
      LastName: student.lastName,
      createdAt: new Date(),
      updatedAt: new Date()
    })
      .then(() => {
        req.flash('success', 'Success to CREATE a student!')
        res.redirect('/cramSchool')
      })
      .catch((error) => {
        console.log(error)
        req.flash('error', 'Fail to CREATE a student!')
        return res.redirect('back')
      })
  } catch (error) {
    console.log(error)
    req.flash('error', 'Fail to CREATE a student!')
    return res.redirect('back')
  }
})

//render new subject page
app.get('/cramSchool/new/subject', (req, res) => {
  try {
    res.render('newSubject', { error: req.flash('error') })
  } catch (error) {
    console.log(error)
  }
})

//Create new subject
app.post('/cramSchool/new/subject', (req, res) => {
  try {
    const subject = req.body

    return Subject.create({
      subjectName: subject.subject,
      createdAt: new Date(),
      updatedAt: new Date()
    })
      .then(() => {
        res.redirect('/cramSchool')
      })
      .catch((error) => {
        console.log(error)
        req.flash('error', 'Fail to CREATE a subject!')
        return res.redirect('back')
      })
  } catch (error) {
    console.log(error)
    req.flash('error', 'Fail to CREATE a subject!')
    return res.redirect('back')
  }
})

app.get('/cramSchool/:studentID/edit/homework', async (req, res) => {
  const studentId = req.params.studentID

  try {
    const student = await Student.findOne({
      where: {
        id: studentId
      },
      raw: true
    })

    const subject = await Subject.findAll({
      attributes: ['id', 'subjectName'],
      raw: true
    })

    const todayHomework = await StudentHomework.findAll({
      where: {
        studentid: studentId
      },
      raw: true,
      include: {
        model: Subject,
        required: true
      }
    })

    console.log(todayHomework)
    res.render('todayHomework', { student, subject, todayHomework, message: req.flash('success') })
  } catch (err) {
    console.log(err)
  }
})

app.post('/cramSchool/:studentID/edit/homework/add', (req, res) => {
  try {
    const theHomework = req.body
    const studentID = req.params.studentID

    return StudentHomework.create({
      createdAt: new Date(),
      updatedAt: new Date(),
      studentId: studentID,
      subjectId: theHomework.subjectName
    })
      .then(() => {
        req.flash('success', 'Success to add a subject!')
        res.redirect(`/cramSchool/${studentID}/edit/homework`)
      })
      .catch((error) => {
        console.log(error)
        return res.redirect('back')
      })
  } catch (error) {
    console.log(error)
    return res.redirect('back')
  }
})

app.get('/cramSchool/:studentID/editInfo', (req, res) => {
  const studentId = req.params.studentID
  return Student.findByPk(studentId, {
    attributes: ['id', 'FiristName', 'LastName'],
    raw: true
  })
    .then((student) => {
      res.render('editStudentInfo', { student, error: req.flash('error') });
    })
})

app.put('/cramSchool/:studentID', (req, res) => {
  try {
    const studentId = req.params.studentID
    const body = req.body

    return Student.update({ id: body.studentID, FiristName: body.firstName, LastName: body.lastName }, {
      where: {
        id: studentId
      }
    })
      .then(() => {
        req.flash('success', 'Success to UPDATE student information!')
        res.redirect('/cramSchool')
      })
      .catch((error) => {
        console.log(error)
        req.flash('error', 'Fail to UPDATE student information!')
        return res.redirect('back')
      })
  } catch (error) {
    console.log(error)
    req.flash('error', 'Fail to UPDATE student information!')
    return res.redirect('back')
  }
})

app.delete('/cramSchool/:studentID', (req, res) => {

  try {
    const studentId = req.params.studentID

    return Student.destroy({
      where: {
        id: studentId
      }
    })
      .then(() => {
        req.flash('success', 'Success to DELETE a student!')
        res.redirect('/cramSchool')
      })
      .catch((error) => {
        console.log(error)
        req.flash('error', 'Fail to DELETE student!')
        return res.redirect('back')
      })
  } catch (error) {
    console.log(error)
    req.flash('error', 'Fail to DELETE student!')
    return res.redirect('back')
  }
})

app.listen(port, () => {
  console.log(`express server is running on the http://localhost:${port}`)
})
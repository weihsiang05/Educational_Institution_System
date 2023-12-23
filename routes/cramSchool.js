const express = require('express')
const router = express.Router()

const db = require('../models')
const Student = db.student
const Subject = db.subject
const StudentHomework = db.studentHomework

router.get('/', (req, res) => {
  console.log('session', req.session)
  console.log(req.user)
  try {
    //Get from passport expanded req.user
    const userID = req.user.id

    return Student.findAll({
      attributes: ['id', 'FiristName', 'LastName'],
      where: {
        userId: userID
      },
      raw: true
    })
      .then((student) => {
        res.render('index', { student })
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
router.get('/new/student', (req, res) => {
  try {
    res.render('newStudent')
  } catch (error) {
    console.error(error)
  }
})

//Create new student
router.post('/new/student', (req, res, next) => {

  const student = req.body
  //Get from passport expanded req.user
  const userID = req.user.id

  return Student.create({
    id: student.studentID,
    FiristName: student.firstName,
    LastName: student.lastName,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: userID
  })
    .then(() => {
      req.flash('success', 'Success to CREATE a student!')
      res.redirect('/cramSchool')
    })
    .catch((error) => {
      error.errorMessage = 'Fail to CREATE a student!'
      next(error)
    })

})

//render new subject page
router.get('/new/subject', (req, res) => {
  try {
    res.render('newSubject')
  } catch (error) {
    console.log(error)
  }
})

//Create new subject
router.post('/new/subject', (req, res, next) => {
  const subject = req.body

  return Subject.create({
    subjectName: subject.subject,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(() => {
      req.flash('success', 'Success to CREATE a subject!')
      res.redirect('/cramSchool')
    })
    .catch((error) => {
      error.errorMessage = 'Fail to CREATE a subject!'
      next(error)
    })

})

router.get('/:studentID/edit/homework', async (req, res) => {
  const studentId = req.params.studentID
  //Get from passport expanded req.user
  const userID = req.user.id

  try {
    const student = await Student.findOne({
      where: {
        id: studentId
      },
      raw: true
    })

    if (student) {
      if (student.userId !== userID) {
        req.flash('error', 'Insufficient permissions!')
        return res.redirect('/cramSchool')
      }
    } else {
      req.flash('error', 'Do not have this student in the class!')
      return res.redirect('/cramSchool')
    }

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
    res.render('todayHomework', { student, subject, todayHomework })
  } catch (err) {
    console.log(err)
  }
})

router.post('/:studentID/edit/homework/add', (req, res) => {
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

router.post('/:studentID/edit/homework/store', (req, res) => {
  // try {
  //   const theHomework = req.body
  //   const studentID = req.params.studentID

  //   return StudentHomework.create({
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     studentId: studentID,
  //     subjectId: theHomework.subjectName
  //   })
  //     .then(() => {
  //       req.flash('success', 'Success to add a subject!')
  //       res.redirect(`/cramSchool/${studentID}/edit/homework`)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //       return res.redirect('back')
  //     })
  // } catch (error) {
  //   console.log(error)
  //   return res.redirect('back')
  // }
})

router.get('/:studentID/editInfo', (req, res) => {
  const studentId = req.params.studentID
  //Get from passport expanded req.user
  const userID = req.user.id

  return Student.findByPk(studentId, {
    attributes: ['id', 'FiristName', 'LastName'],
    raw: true
  })
    .then((student) => {
      res.render('editStudentInfo', { student })
    })
})

router.put('/:studentID', (req, res, next) => {

  const studentId = req.params.studentID
  const body = req.body
  //Get from passport expanded req.user
  const userID = req.user.id

  return Student.findOne({
    where: {
      id: studentId
    }
  })
    .then((student) => {
      if (!student) {
        req.flash('error', 'Do not have this student in the class!')
        return res.redirect('/cramSchool')
      }

      if (student.userId !== userID) {
        req.flash('error', 'Insufficient permissions!')
        return res.redirect('/cramSchool')
      }

      return student.update({ id: body.studentID, FiristName: body.firstName, LastName: body.lastName })
        .then(() => {
          req.flash('success', 'Success to UPDATE student information!')
          res.redirect('/cramSchool')
        })
    })
    .catch((error) => {
      error.errorMessage = 'Fail to UPDATE student information!'
      next(error)
    })

})

router.delete('/:studentID', (req, res) => {

  const studentId = req.params.studentID
  //Get from passport expanded req.user
  const userID = req.user.id

  return Student.findOne({
    where: {
      id: studentId
    }
  })
    .then((student) => {
      if (!student) {
        req.flash('error', 'Do not have this student in the class!')
        return res.redirect('/cramSchool')
      }

      if (student.userId !== userID) {
        req.flash('error', 'Insufficient permissions!')
        return res.redirect('/cramSchool')
      }

      return student.destroy()
        .then(() => {
          req.flash('success', 'Success to DELETE a student!')
          res.redirect('/cramSchool')
        })
    })
    .catch((error) => {
      error.errorMessage = 'Fail to DELETE student!'
    })

})

module.exports = router


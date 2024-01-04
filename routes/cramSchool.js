const express = require('express')
const router = express.Router()

const db = require('../models')
const Student = db.student
const Subject = db.subject
const StudentHomework = db.studentHomework
const Parent = db.Parents
const studentParent = db.studentParent

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

router.put('/:studentID/edit/homework/store', async (req, res, next) => {
  try {
    const selectedStatusArray = req.body.status
    const studentId = req.params.studentID
    const subjectIdArray = req.body.subjectId

    console.log(subjectIdArray)
    //console.log(student)
    console.log('Selected Status:', selectedStatusArray);
    console.log(typeof (selectedStatusArray))

    const student = await StudentHomework.findOne({
      where: {
        studentId: studentId
      }
    })

    if (!student) {
      req.flash('error', 'Student not found!');
      //return res.redirect('/cramSchool');
    }

    for (let i = 0; i < subjectIdArray.length; i++) {
      const subjectId = subjectIdArray[i];
      const selectedStatus = selectedStatusArray[i];
      //console.log(subjectId)
      //console.log(selectedStatus)
      //console.log(typeof (selectedStatus))
      const homework = await StudentHomework.findOne({
        where: {
          studentId: studentId,
          subjectId: subjectId,
        },
      });

      // if (!homework) {
      //   req.flash('error', `Homework not found for student ${studentId} and subject ${subjectId}!`);
      //   //return res.redirect('/cramSchool');
      // }

      //console.log(homework)

      // Update the status of the homework
      await homework.update({
        status: selectedStatus
      });

      req.flash('success', 'Success to UPDATE student homework status!');
      //res.redirect('/cramSchool')
    }
  } catch (error) {
    console.error(error);
    error.errorMessage = 'Fail to UPDATE';
  }

})

router.delete('/:studentID/edit/homework/:homeworkId/delete', async (req, res) => {
  const studentId = req.params.studentID
  const todayHomeworkId = req.params.homeworkId

  console.log(todayHomeworkId)
  console.log(studentId)

  return StudentHomework.findOne({
    where: {
      id: todayHomeworkId
    }
  })
    .then((studentHomework) => {
      console.log(studentHomework)
      return studentHomework.destroy()
        .then(() => {
          req.flash('success', 'Success to DELETE the subject!')
          res.redirect(`/cramSchool/${studentId}/edit/homework`)
        })
    })
    .catch((error) => {
      error.errorMessage = 'Fail to DELETE student!'
    })

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

router.get('/:studentID/edit/studentParent', async (req, res) => {
  const studentId = req.params.studentID
  //const studentparent = req.body

  const parent = await Parent.findAll({
    attributes: ['id', 'name'],
    raw: true
  })

  const student = await Student.findByPk(studentId, {
    attributes: ['id', 'FiristName', 'LastName'],
    raw: true
  })

  const findStudentParent = await studentParent.findAll({
    where: {
      studentId: studentId
    },
    raw: true,
    include: {
      model: Parent,
      required: true
    }
  })

  console.log(findStudentParent)

  res.render('studentParents', { parent, student, findStudentParent })
  //res.redirect('/cramSchool')
  //console.log(req.body)

})

router.post('/:studentID/edit/studentParent/add', async (req, res) => {
  const studentId = req.params.studentID
  const studentparentId = req.body.parentName

  const checkParent = await studentParent.findOne({
    where: {
      studentId: studentId,
      parentId: studentparentId
    }
  })

  if (checkParent) {
    req.flash('error', 'Parent name already exists for this student.');

    return res.redirect(`/cramSchool/${studentId}/edit/studentParent`);
  }

  const addstudentParents = await studentParent.create({
    createdAt: new Date(),
    updatedAt: new Date(),
    studentId: studentId,
    parentId: studentparentId
  })

  req.flash('success', 'Successfully added parent');
  return res.redirect(`/cramSchool/${studentId}/edit/studentParent`)

})

router.delete('/:studentID/edit/studentParent/:parentId/delete', async (req, res) => {
  const studentId = req.params.studentID
  const studentparentId = req.params.parentId

  //console.log(studentparentId)

  try {
    const deleteRelationship = await studentParent.findOne({
      where: {
        id: studentparentId
      }
    })

    if (deleteRelationship) {
      deleteRelationship.destroy()
      req.flash('success', 'Success to DELETE the parent!')
      res.redirect(`/cramSchool/${studentId}/edit/studentParent`)
    } else {
      error.errorMessage = 'Fail to delete the student Parent!'
    }
  } catch (error) {
    error.errorMessage = 'Fail to delete the student Parent!'
  }
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


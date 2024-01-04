const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const linebot = require('linebot')
const app = express()
const port = 3000
const db = require('/Users/ivan/Dev/cramSchool/models')
const Subject = db.subject
const Student = db.student
const StudentHomework = db.studentHomework
const Parent = db.Parents
const studentParent = db.studentParent

const passport = require('passport')

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
const bot = linebot({
  channelId: '2002401941',
  channelSecret: 'c5bc3f5dea5ef175ffc8f24b644313aa',
  channelAccessToken: '8EydrIdF0cuSvRrFw0edPMphirbuGt2i0EBXAeKPrztlqPTdnbinoQKmCW424CIIWKa10BhRNo7exx+PRIdyqbSuDsAg/q31e1ogFonu8fsE/Kwpomu6LGIg/22zsB3YwG/OdbztFNvlxVMX24g96AdB04t89/1O/w1cDnyilFU='
})

bot.on('message', async function (event) {
  try {
    const userSendingMsg = event.message.text.trim();

    console.log(userSendingMsg);
    //console.log(bot)

    const userId = event.source.userId;
    const profile = await bot.getUserProfile(userId);
    const userName = profile.displayName;

    const checkUserId = await Parent.findOne({
      where: {
        id: userId
      }
    })

    if (checkUserId === null && userSendingMsg === "Register") {
      await Parent.create({
        id: userId,
        name: userName,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      event.reply("Successfully register!").then(function (data) {
        console.log(data);
      }).catch(function (error) {
        console.log(error);
      });
    } else if (checkUserId !== null && userSendingMsg === "Register") {
      event.reply("You have already registered!").then(function (data) {
        console.log(data);
      }).catch(function (error) {
        console.log(error);
      });
    } else if (checkUserId !== null && userSendingMsg === "Check student status") {
      const parent = await studentParent.findAll({
        where: {
          parentId: userId
        }
      })

      if (parent.length > 0) {
        const parentStudents = [];

        // Get the studentId from the return parent array
        parent.forEach(parent => {
          parentStudents.push(parent.studentId)
        })

        // Initialize an empty string to combine messages
        let combinedMessage = '';

        for (const studentId of parentStudents) {
          const student = await StudentHomework.findAll({
            where: {
              studentId: studentId
            },
            raw: true,
            include: [
              {
                model: Subject,
                required: true
              },
              {
                model: Student,
                required: true
              }
            ]
          });

          //console.log(student)

          if (student.length === 0) {
            event.reply("Can't find the student! Please try again!").then(function (data) {
              console.log(data);
            }).catch(function (error) {
              console.log(error);
            });
          } else {
            //const replayMsg = 'Hello' + userName

            console.log(student);
            const subjectNameString = [];
            const studentNameString = [];
            console.log(student.status);

            student.forEach((subjectName) => {
              subjectNameString.push("\t" + subjectName['subject.subjectName'] + "\t" + "(" + subjectName['status'] + ")");
            });

            //Get each student name
            student.forEach((studentName) => {
              if (studentNameString.length < 2) {
                studentNameString.push(studentName['student.FiristName']);
                studentNameString.push(studentName['student.LastName'] + '’s');
              }
            });



            const studentMessage = "\n" + studentNameString.join('') + " " + "Today Homeworks:" + "\n" + subjectNameString.join('\n')

            combinedMessage += studentMessage + "\n"

            /*event.reply(replayMsg + " " + studentNameString.join('') + " " + "parent" + "\n\n" + studentNameString.join('') + " " + "Today Homeworks:" + "\n" + subjectNameString.join('\n')).then(function (data) {
              console.log(data);
            }).catch(function (error) {
              console.log(error);
            });*/
          }
        }
        const replayMsg = "Hello" + " " + "parent" + "\n"
        // Send the combined message
        event.reply(replayMsg + combinedMessage).then(function (data) {
          console.log(data);
        }).catch(function (error) {
          console.log(error);
        });
      } else {
        event.reply("Please ask for employee's help to add you in the system!").then(function (data) {
          console.log(data);
        }).catch(function (error) {
          console.log(error);
        });
      }
    } else if (checkUserId === null && userSendingMsg === "Check student status") {
      // await Parent.create({
      //   id: userId,
      //   name: userName,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // })
      event.reply("Please register first!").then(function (data) {
        console.log(data);
      }).catch(function (error) {
        console.log(error);
      });
    }
    else {
      event.reply("If you need other help, please get in touch with us by calling: (226) 000 000").then(function (data) {
        console.log(data);
      }).catch(function (error) {
        console.log(error);
      });
    }

  } catch (error) {
    console.error(error)
  }

})

console.log('en', process.env.NODE_ENV)
console.log(process.env.SESSION_SECRET)


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(messageHandler)

app.use(router)

app.use(errorHandler)

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

bot.listen('/linewebhook', 80);

app.listen(port, () => {
  console.log(`express server is running on the http://localhost:${port}`)
})
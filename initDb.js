/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.
 */

const sequelize = require('./lib/sequelize')
const { Course, CourseClientFields } = require('./models/course')
const { User, UserClientFields } = require('./models/user')
const { Assignment, AssignmentClientFields } = require('./models/assignment')
const { Submission, SubmissionClientFields } = require('./models/submission')

const courseData = require('./data/courses.json')
const userData = require('./data/users.json')


sequelize.sync().then(async function () {
  await User.bulkCreate(userData, { fields: UserClientFields })
  
  await Course.bulkCreate(courseData, { fields: CourseClientFields })
})

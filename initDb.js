/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.
 */

const sequelize = require('./lib/sequelize')
const { Course, CourseClientFields } = require('./models/course')
const { Submission, SubmissionClientFields } = require('./models/submission')
const { User, UserClientFields } = require('./models/user')

const courseData = require('./data/courses.json')
const userData = require('./data/users.json')

sequelize.sync().then(async function () {
  await Course.bulkCreate(courseData, { fields: CourseClientFields })
  await User.bulkCreate(userData, { fields: UserClientFields })
})

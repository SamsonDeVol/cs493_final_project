/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.
 */

const sequelize = require('./lib/sequelize')
const { Course, CourseClientFields } = require('./models/course')
const { Submission, SubmissionClientFields } = require('./models/submissions')

const courseData = require('./data/courses.json')

sequelize.sync().then(async function () {
  await Course.bulkCreate(courseData, { fields: CourseClientFields })
})

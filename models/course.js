const sequelize = require('../lib/sequelize')

const { DataTypes } = require('sequelize')
const { User } = require('./user')
const { Assignment } = require('./assignment')

const Course = sequelize.define('course', {
  id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  subject: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  term: { type: DataTypes.STRING, allowNull: false },
  instructorId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 2 }
})
exports.Course = Course

/*
* Set up one-to-many relationship between Course and Assignment.
*/
Course.hasMany(Assignment, { foreignKey: 'courseId' })
Assignment.belongsTo(Course)

/*
* Set up many-to-many relationship between Course and User for the Students.
*/
Course.belongsToMany(User, { through: 'courseUsers' })
User.belongsToMany(Course, { through: 'courseUsers' })

/*
* Set up a one-to-many relationship between Course and User for the Instructor.
*/
User.hasMany(Course, { foreignKey: 'instructorId' })
Course.belongsTo(User)


/*
 * Export an array containing the names of fields the client is allowed to set
 * on courses.
 */
exports.CourseClientFields = [
  'id',
  'subject',
  'number',
  'title',
  'term',
  'instructorId'
]

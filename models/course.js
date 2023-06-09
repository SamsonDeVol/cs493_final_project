const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const { User } = require('./user')

const Course = sequelize.define('course', {
  id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  subject_code: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  term: { type: DataTypes.STRING, allowNull: false },
  instructor_id: { type: DataTypes.INTEGER, allowNull: false }
})

/*
* Set up one-to-many relationship between Course and User.
*/
// Course.hasMany(User, { foreignKey: { allowNull: false } })
// User.belongsTo(Course)

/*
 * Export an array containing the names of fields the client is allowed to set
 * on courses.
 */
exports.CourseClientFields = [
  'id',
  'subject_code',
  'number',
  'title',
  'term',
  'instructor_id'
]

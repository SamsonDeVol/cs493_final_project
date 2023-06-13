const sequelize = require('../lib/sequelize')

const { DataTypes } = require('sequelize')
const { Submission } = require('./submission')

const Assignment = sequelize.define('assignment', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false },
    due: { type: DataTypes.DATE, allowNull: false }
}) 
exports.Assignment = Assignment

/*
* Set up one-to-many relationship between Assignemnt and Submission
*/
Assignment.hasMany(Submission, { foreignKey: 'assignmentId' })
Submission.belongsTo(Assignment)

/*
 * Export an array containing the names of fields the client is allowed to set for a Assignments.
 */
exports.AssignmentClientFields = [
    'id',
    'courseId',
    'title',
    'points',
    'due'
]

const sequelize = require('../lib/sequelize')

const { DataTypes } = require('sequelize')
const { Submission } = require('./submission')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, enum: ['admin', 'instructor', 'student'], defaultValue: 'student' }
})
exports.User = User

/*
* Set up one-to-many relationship between User and Submission.
*/
User.hasMany(Submission, { foreignKey: 'studentId' })
Submission.belongsTo(User)

/*
 * Export an array containing the names of fields the client is allowed to set for a User.
 */
exports.UserClientFields = [
    'id',
    'name',
    'email',
    'password',
    'role'
]

const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, enum: ['admin', 'instructor', 'student'], defaultValue: 'student' }
})

/*
* Set up one-to-many relationship between Course and User.
*/
// Course.hasMany(User, { foreignKey: { allowNull: false } })
// User.belongsTo(Course)

exports.User = User

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

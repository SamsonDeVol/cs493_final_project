const sequelize = require('../lib/sequelize')

const { DataTypes } = require('sequelize')

const Submission = sequelize.define('submissions', {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    assignmentId: {type: DataTypes.INTEGER, allowNull: false},
    studentId: {type: DataTypes.INTEGER, allowNull: false},
    grade: { type: DataTypes.FLOAT, allowNull: true },
    filePath: { type: DataTypes.STRING, allowNull: false },
    fileType: { type: DataTypes.STRING, allowNull: false }
})
exports.Submission = Submission

exports.SubmissionClientFields = [
    'assignmentId',
    'studentId',
    'grade',
    'filePath',
    'fileType'
]

exports.fileTypes = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "text/csv": "csv",
    "application/pdf": "pdf",
    "application/zip": "zip"
}

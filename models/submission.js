const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const { User } = require('./user')
const { Assignment } = require('./assignment')

const Submission = sequelize.define('submissions', {
    assignmentId: {type: DataTypes.INTEGER, allowNull: false},
    studentId: {type: DataTypes.INTEGER, allowNull: false},
    timestamp: {type: DataTypes.DATE, allowNull: false},
    grade: { type: DataTypes.FLOAT, allowNull: true },
    file: { type: DataTypes.STRING, allowNull: false }
})

Submission.belongsTo(User, { foreignKey: { allowNull: false } })
Submission.belongsTo(Assignment, { foreignKey: { allowNull: false } })
User.hasMany(Submission, { foreignKey: { allowNull: false } })
Assignment.hasMany(Submission, { foreignKey: { allowNull: false } })

exports.Submission = Submission

exports.SubmissionClientFields = [
    'assignmentId',
    'studentId',
    'timestamp',
    'grade',
    'file'
]

// async function getSubmissionsCount() {
//     const [ count ] = await mysqlPool.query(
//         "SELECT COUNT(*) AS count FROM submissions"
//     )
//     return count
// }

// async function getSubmissionsPage(page) {
//     const count = await getSubmissionsCount()
//     const [ submissionPage ] = await mysqlPool.query(
//         "SELECT * FROM submissions"
//     )
//     const numPerPage = 1
//     const lastPage = Math.ceil(submissionPage.length / numPerPage)
//     page = page > lastPage ? lastPage : page
//     page = page < 1 ? 1 : page

//     const start = (page - 1) * numPerPage
//     const end = start + numPerPage
//     const pageSubmissions = submissionPage.slice(start, end)

//     const links = {}
//     if (page < lastPage) {
//         links.nextPage = `/submissions?page=${page + 1}`
//         links.lastPage = `/submissions?page=${lastPage}`
//     }
//     if (page > 1) {
//         links.prevPage = `/submissions?page=${page - 1}`
//         links.firstPage = '/submissions?page=1'
//     }

//     return {
//         submissions: pageSubmissions,
//         pageNumber: page,
//         totalPages: lastPage,
//         pageSize: numPerPage,
//         totalCount: count,
//         links: links
//     }
// }

// async function getSubmissonByStudentId(studentId) {
//     const query = `SELECT * FROM submissions WHERE studentId=${studentId}`
//     const [ submission ] = await mysqlPool.query(query)
//     return submission
// }


// exports.submissionSchema = submissionSchema
// exports.createSubmissionsTable = createSubmissionsTable
// exports.getSubmissionCount = getSubmissionsCount
// exports.getSubmissionPage = getSubmissionsPage
// exports.getsubmissionByStudentId = getsubmissionByStudentId
const mysqlPool = require('../lib/mysqlPool')
const { extractValidFields } = require('../lib/validation')

const submissionSchema = {
    assignmentId: { required: true },
    studentId: { required: true },
    timestamp: { required: true },
    grade: { required: false },
    file: { required: true }
}

async function createSubmissionsTable() {
    await mysqlPool.query(`
        CREATE TABLE submissions(
        assignmentId MEDIUMINT NOT NULL,
        studentId MEDIUMINT NOT NULL,
        timestamp TIMESTAMPT NOT NULL,
        grade: { required: false },
        file: { required: true }
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (assignmentId),
        INDEX idx_studentId (studentId)
        )`
    )
}

async function getSubmissionsCount() {
    const [ count ] = await mysqlPool.query(
        "SELECT COUNT(*) AS count FROM submissions"
    )
    return count
}

async function getSubmissionsPage(page) {
    const count = await getSubmissionsCount()
    const [ submissionPage ] = await mysqlPool.query(
        "SELECT * FROM submissions"
    )
    const numPerPage = 1
    const lastPage = Math.ceil(submissionPage.length / numPerPage)
    page = page > lastPage ? lastPage : page
    page = page < 1 ? 1 : page

    const start = (page - 1) * numPerPage
    const end = start + numPerPage
    const pageSubmissions = submissionPage.slice(start, end)

    const links = {}
    if (page < lastPage) {
        links.nextPage = `/submissions?page=${page + 1}`
        links.lastPage = `/submissions?page=${lastPage}`
    }
    if (page > 1) {
        links.prevPage = `/submissions?page=${page - 1}`
        links.firstPage = '/submissions?page=1'
    }

    return {
        submissions: pageSubmissions,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: count,
        links: links
    }
}

async function getSubmissonByStudentId(studentId) {
    const query = `SELECT * FROM submissions WHERE studentId=${studentId}`
    const [ submission ] = await mysqlPool.query(query)
    return submission
}


exports.submissionSchema = submissionSchema
exports.createSubmissionsTable = createSubmissionsTable
exports.getSubmissionCount = getSubmissionsCount
exports.getSubmissionPage = getSubmissionsPage
exports.getsubmissionByStudentId = getsubmissionByStudentId

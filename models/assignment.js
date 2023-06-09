const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')

const Assignment = sequelize.define('assignment', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false },
    due: { type: DataTypes.DATE, allowNull: false }
})

/*
* Set up one-to-many relationship between Course and User.
*/
// Course.hasMany(User, { foreignKey: { allowNull: false } })
// User.belongsTo(Course)

/*
 * Export an array containing the names of fields the client is allowed to set for a User.
 */
exports.UserClientFields = [
    'id',
    'name',
    'email',
    'role'
]

// const mysqlPool = require('../lib/mysqlPool')
// const { extractValidFields } = require('../lib/validation')

// const businessSchema = {
//     ownerid: { required: true },
//     name: { required: true },
//     address: { required: true },
//     city: { required: true },
//     state: { required: true },
//     zip: { required: true },
//     phone: { required: true },
//     category: { required: true },
//     subcategory: { required: true },
//     website: { required: false },
//     email: { required: false }
// }

// async function createBusinessesTable() {
//     await mysqlPool.query(`
//         CREATE TABLE businesses(
//         ownerid MEDIUMINT NOT NULL,
//         name VARCHAR(255) NOT NULL,
//         address VARCHAR(255) NOT NULL,
//         city VARCHAR(255) NOT NULL,
//         state VARCHAR(255) NOT NULL,
//         zip VARCHAR(255) NOT NULL,
//         phone VARCHAR(255) NOT NULL,
//         category VARCHAR(255) NOT NULL,
//         subcategory VARCHAR(255) NOT NULL,
//         website VARCHAR(255),
//         email VARCHAR(255),
//         id MEDIUMINT NOT NULL AUTO_INCREMENT,
//         PRIMARY KEY (id),
//         INDEX idx_ownerid (ownerid)
//         )`
//     )
// }

// async function getBusinessCount() {
//     const [ count ] = await mysqlPool.query(
//         "SELECT COUNT(*) AS count FROM businesses"
//     )
//     return count
// }

// async function getBusinessPage(page) {
//     const count = await getBusinessCount()
//     const [ businessPage ] = await mysqlPool.query(
//         "SELECT * FROM businesses"
//     )
//     const numPerPage = 1
//     const lastPage = Math.ceil(businessPage.length / numPerPage)
//     page = page > lastPage ? lastPage : page
//     page = page < 1 ? 1 : page

//     const start = (page - 1) * numPerPage
//     const end = start + numPerPage
//     const pageBusinesses = businessPage.slice(start, end)

//     const links = {}
//     if (page < lastPage) {
//         links.nextPage = `/businesses?page=${page + 1}`
//         links.lastPage = `/businesses?page=${lastPage}`
//     }
//     if (page > 1) {
//         links.prevPage = `/businesses?page=${page - 1}`
//         links.firstPage = '/businesses?page=1'
//     }

//     return {
//         businesses: pageBusinesses,
//         pageNumber: page,
//         totalPages: lastPage,
//         pageSize: numPerPage,
//         totalCount: count,
//         links: links
//     }
// }

// async function getBusinessById(id) {
//     const query = `SELECT * FROM businesses WHERE id=${id}`
//     const [ business ] = await mysqlPool.query(query)
//     return business
// }

// async function insertNewBusiness(business) {
//     const validatedBusiness = extractValidFields(
//         business,
//         businessSchema
//     )
//     const [ result ] = await mysqlPool.query(
//         'INSERT INTO businesses SET ?',
//         validatedBusiness
//     )
//     return result.insertId
// }

// async function updateBusinessById(businessId, business) {
//     const validatedBusiness = extractValidFields(
//         business,
//         businessSchema
//     )
//     const [ result ] = await mysqlPool.query(
//         'UPDATE businesses SET ? WHERE id = ?',
//         [ validatedBusiness, businessId ]
//     )
//     return result.affectedRows > 0
// }

// async function deleteBusinessById(businessId) {
//     const [ result ] = await mysqlPool.query(
//         'DELETE FROM businesses WHERE id = ?',
//         [ businessId ]
//     )
//     return result.affectedRows > 0
// }

// exports.businessSchema = businessSchema
// exports.createBusinessesTable = createBusinessesTable
// exports.getBusinessCount = getBusinessCount
// exports.getBusinessPage = getBusinessPage
// exports.getBusinessById = getBusinessById
// exports. insertNewBusiness = insertNewBusiness
// exports. updateBusinessById = updateBusinessById
// exports.deleteBusinessById = deleteBusinessById
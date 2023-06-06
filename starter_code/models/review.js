const mysqlPool = require('../lib/mysqlPool')
const { extractValidFields } = require('../lib/validation')

const reviewSchema = {
    userid: { required: true },
    businessid: { required: true },
    dollars: { required: true },
    stars: { required: true },
    review: { required: false }
}

async function createReviewsTable() { 
    await mysqlPool.query(`
      CREATE TABLE reviews(
        userid MEDIUMINT NOT NULL,
        businessid MEDIUMINT NOT NULL,
        dollars MEDIUMINT NOT NULL,
        stars MEDIUMINT NOT NULL,
        review VARCHAR(255),
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id),
        INDEX idx_businessid (businessid)
      )`
    )
}
  
async function getReviewById(id) {
    const query = `SELECT * FROM reviews WHERE id=${id}`
    const [ review ] = await mysqlPool.query(query)
    return review
}
  
async function checkUserPreviousReview(review) {
    const validatedReview = extractValidFields(
      review,
      reviewSchema
    )
    const [ result ] = await mysqlPool.query(
      `SELECT COUNT(*) AS count FROM reviews WHERE userid = ? AND businessid = ?`,
      [ validatedReview.userid, validatedReview.businessid ]
    )
    return result[0].count
}
  
async function insertNewReview(review) {
    const validatedReview = extractValidFields(
      review,
      reviewSchema
    )
    const [ result ] = await mysqlPool.query(
      'INSERT INTO reviews SET ?',
      validatedReview
    )
    return result.insertId
}
  
async function updateReviewById(id, review) {
    const validatedReview = extractValidFields(
      review,
      reviewSchema
    )
    const [ result ] = await mysqlPool.query(
      'UPDATE reviews SET ? WHERE id = ?',
      [ validatedReview, id ]
    )
    return result.affectedRows > 0
}
  
async function deleteReviewById(id) {
    const [ result ] = await mysqlPool.query(
      'DELETE FROM reviews WHERE id = ?',
      [ id ]
    )
    return result.affectedRows > 0
}
  
exports.reviewSchema = reviewSchema
exports.createReviewsTable = createReviewsTable
exports.getReviewById = getReviewById
exports.checkUserPreviousReview = checkUserPreviousReview
exports.insertNewReview = insertNewReview
exports.updateReviewById = updateReviewById
exports.deleteReviewById = deleteReviewById

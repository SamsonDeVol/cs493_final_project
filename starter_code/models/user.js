const mysqlPool = require('../lib/mysqlPool')
const bcrypt = require("bcryptjs")
const { extractValidFields } = require('../lib/validation')

const userSchema = {
    name: { required: true },
    email: { require: true },
    password: {required: true },
    admin: { required: false }
  }
  
  async function createUsersTable() {
    console.log("creating users table")
    const [result] = await mysqlPool.query(`
      CREATE TABLE users(
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        admin BOOLEAN NOT NULL DEFAULT (false),
        PRIMARY KEY (id)
      )`
    )
  }
  
  async function checkEmailExists(userEmail) {
    const [ results ] = await mysqlPool.query(
      `SELECT * FROM users WHERE email="${userEmail}"`
    )
    console.log("eex", results)
    return results.length > 0 ? true : false
  }
  
  async function insertNewUser(user) {
    const validatedUser = extractValidFields(
      user,
      userSchema
    )
    
    // hash/salt password
    const hash = await bcrypt.hash(validatedUser.password, 8)
    validatedUser.password = hash
  
    const [ result ] = await mysqlPool.query(
      'INSERT INTO users SET ?',
      validatedUser
    )
    return result.insertId
  }
  
  async function getUserById(userID, includePassword) {
    const [ result ] = await mysqlPool.query(
      `SELECT * FROM users WHERE id=${userID}`
    )
    // protect password
    if (!includePassword){
      result[0].password = 0
    }
    return result
  }
  
  async function getUserIdByEmail(userEmail) {
    console.log("body email", userEmail)
    const [ results ] = await mysqlPool.query(
      `SELECT id FROM users WHERE email="${userEmail}"`
    )
  console.log("id", results[0].id)
    return results[0].id
  }
  
  async function getUserBusinessesById(userID) {
    const [ result ] = await mysqlPool.query(
      `SELECT * FROM businesses WHERE ownerid=${userID}`
    )
    return result
  }
  
  async function getUserReviewsById(userID) {
    const [ result ] = await mysqlPool.query(
      `SELECT * FROM reviews WHERE userid=${userID}`
    )
    return result
  }
  async function getUserPhotosById(userID) {
    const [ result ] = await mysqlPool.query(
      `SELECT * FROM photos WHERE userid=${userID}`
    )
    return result
  }
  
  async function validateUser(userID, password){
    const [ user ] = await getUserById(userID, true)
    const authenticated = user && await bcrypt.compare(password, user.password)
    return authenticated
  }
  
exports.userSchema = userSchema
exports.createUsersTable = createUsersTable
exports.checkEmailExists = checkEmailExists
exports.insertNewUser = insertNewUser
exports.getUserById = getUserById
exports.getUserIdByEmail = getUserIdByEmail
exports.getUserBusinessesById = getUserBusinessesById
exports.getUserReviewsById = getUserReviewsById
exports.getUserPhotosById = getUserPhotosById
exports.validateUser = validateUser
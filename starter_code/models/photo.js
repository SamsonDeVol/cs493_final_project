const mysqlPool = require('../lib/mysqlPool')
const { extractValidFields } = require('../lib/validation')

const photoSchema = {
    userid: { required: true },
    businessid: { required: true },
    caption: { required: false }
}
  
async function createPhotosTable() {
    await mysqlPool.query(
      `CREATE TABLE photos(
        userid MEDIUMINT NOT NULL, 
        businessid MEDIUMINT NOT NULL,
        caption VARCHAR(255),
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id),
        INDEX idx_userid (userid),
        INDEX idx_businessid (businessid)
      )`
    )
}
  
async function insertNewPhoto(photo) {
    const validatedPhoto = extractValidFields(
      photo,
      photoSchema
    )
    const [ result ] = await mysqlPool.query(
      'INSERT INTO photos SET ?', 
      validatedPhoto
    )
    return result.insertId
}
  
async function getPhotoById(id) {
    const query = `SELECT * FROM photos WHERE id=${id}`
    const [ photo ] = await mysqlPool.query(query)
    return photo
}
  
async function updatePhotoById(id, photo) {
    const validatedPhoto = extractValidFields(
      photo,
      photoSchema
    )
    const [ result ] = await mysqlPool.query(
      'UPDATE photos SET ? WHERE id = ?',
      [ validatedPhoto, id ]
    )
    return result.affectedRows > 0
}
  
async function deletePhotoById(id) {
    const [ result ] = await mysqlPool.query(
      'DELETE FROM photos WHERE id = ?',
      [ id ]
    )
    return result.affectedRows > 0
}

exports.photoSchema = photoSchema
exports.createPhotosTable = createPhotosTable
exports.insertNewPhoto = insertNewPhoto
exports.getPhotoById = getPhotoById
exports.updatePhotoById = updatePhotoById
exports.deletePhotoById = deletePhotoById
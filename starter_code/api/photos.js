const router = require('express').Router()
const { validateAgainstSchema, extractValidFields } = require('../lib/validation')
const { photoSchema, createPhotosTable, insertNewPhoto, getPhotoById, updatePhotoById, deletePhotoById } = require('../models/photo')
const photos = require('../data/photos')

exports.router = router
exports.photos = photos

// Route to create photos table
router.post('/createPhotosTable', async (req, res) => {
  try {
    await createPhotosTable()
    res.status(200).send({})
  } catch (err) {
    res.status(500).json({
      error: "Error creating photos table"
    })
  }
})

// Route to create a new photo.
router.post('/', async function (req, res, next) {
  if (validateAgainstSchema(req.body, photoSchema)) {
    const photo = extractValidFields(req.body, photoSchema)
    try {
      const id = await insertNewPhoto(photo)
      res.status(201).json({
        id: id,
        links: {
          photo: `/photos/${id}`,
          business: `/businesses/${photo.businessid}`
        }
      })
    } catch (err) {
      res.status(500).json({
        error: "Error inserting photo into database"
      })
    }
  } else {
    res.status(400).json({
      error: "Request body is not a valid photo object"
    })
  }
})

// Route to fetch info about a specific photo.
router.get('/:photoID', async function (req, res, next) {
  try {
    const photo = await getPhotoById(req.params.photoID)
    res.status(200).json(photo)
  } catch {
    next()
  }
})

// Route to update a photo.
router.put('/:photoID', async function (req, res, next) {
  const photoID = parseInt(req.params.photoID)
  try {
    if (validateAgainstSchema(req.body, photoSchema)) {
      try {
        const updateSuccesful = await updatePhotoById(photoID, req.body)
        if (updateSuccesful) {
          res.status(200).send({
            id: photoID,
            links: {
              photo: `/photos/${photoID}`
            }
          })
        } else {
          next()
        }
      } catch (err) {
        res.status(500).json({
          error: "Unable to update photo"
        })
      }
    }
  } catch {
    next()
  }
})

// Route to delete a photo.
router.delete('/:photoID', async function (req, res, next) {
  try {
    const deleteSuccessful = await deletePhotoById(req.params.photoID)
    if (deleteSuccessful) {
      res.status(204).end()
    } else {
      next()
    }
  } catch (err) {
    res.status(500).send({
      error: "Unable to delete photo"
    })
  }
})

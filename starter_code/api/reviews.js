const router = require('express').Router()
const { validateAgainstSchema, extractValidFields } = require('../lib/validation')
const { reviewSchema, createReviewsTable, getReviewById, checkUserPreviousReview, insertNewReview, updateReviewById, deleteReviewById } = require('../models/review')
const reviews = require('../data/reviews')

exports.router = router
exports.reviews = reviews

router.post('/createReviewsTable', async (req, res) => {
  try {
    await createReviewsTable()
    res.status(200).send({})
  } catch (err) {
    res.status(500).json({
      error: "Error creating reviews table"
    })
  }
})


/*
 * Route to create a new review.
 */
router.post('/', async function (req, res, next) {
  if (validateAgainstSchema(req.body, reviewSchema)) {

    const review = extractValidFields(req.body, reviewSchema)
    try {
      const userReviewedThisBusinessAlready = await checkUserPreviousReview(req.body)
      if (userReviewedThisBusinessAlready > 0) {
        res.status(403).json({
          error: "User has already posted a review of this business"
        })
      } else {
        try {
          const id = await insertNewReview(review)
          res.status(201).json({
            id: id,
            links: {
              review: `/reviews/${id}`,
              business: `/businesses/${review.businessid}`
            }
          })
        } catch (err) {
          res.status(500).json({
            error: "Error inserting review into database"
          })
        }
      }
    } catch (err) {
        res.status(500).json({
          error: "Error validating user review history"
        })
    }
  } else {
    res.status(400).json({
      error: "Request body is not a valid review object"
    })
  }
})

/*
 * Route to fetch info about a specific review.
 */
router.get('/:reviewID', async function (req, res, next) {
  try {
    const review = await getReviewById(req.params.reviewID)
    res.status(200).json(review)
  } catch {
    next()
  }
})

/*
 * Route to update a review.
 */
router.put('/:reviewID', async function (req, res, next) {
  const reviewID = parseInt(req.params.reviewID)
  try {
    if (validateAgainstSchema(req.body, reviewSchema)) {
      try {
        const updateSuccesful = await updateReviewById(reviewID, req.body)
        if (updateSuccesful) {
          res.status(200).send({
            id: reviewID,
            links: {
              review: `/reviews/${reviewID}`
            }
          })
        } else {
          next()
        }
      } catch (err) {
        res.status(500).json({
          error: "Unable to update review"
        })
      }
    } else {
      res.status(400).json({
        error: "Request body is not a valid review object"
      })
    }
  } catch {
    next()
  }
})

/*
 * Route to delete a review.
 */
router.delete('/:reviewID', async function (req, res, next) {
  try {
    const deleteSuccessful = await deleteReviewById(req.params.reviewID)
    if (deleteSuccessful) {
      res.status(204).end()
    } else { 
      next()
    }
  } catch (err) {
    res.status(500).send({
      error: "Unable to delete review"
    })
  }
})

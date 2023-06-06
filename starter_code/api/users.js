const router = require('express').Router()
const { validateAgainstSchema } = require('../lib/validation')
const { userSchema, createUsersTable, checkEmailExists, insertNewUser, getUserById, getUserIdByEmail, getUserBusinessesById, getUserReviewsById, getUserPhotosById, validateUser } = require('../models/user')
const { requireAuthentication, generateAuthToken } = require('../lib/auth')

exports.router = router

router.post('/createUsersTable', async (req, res) => {
  try {
    await createUsersTable()
    res.status(200).send({})
  } catch (err) {
    res.status(500).json({
      error: "Error creating users table"
    })
  }
})

router.post('/', async (req,res) => {
  console.log("email ", req.body.email)
  if (!validateAgainstSchema(req.body, userSchema)) {
    res.status(400).json({
      error: "Request body is not a valid user object"
    })
  } else if ( await checkEmailExists(req.body.email)){
      res.status(400).json({
        error: "Email is already associated with an account"
      })
  } else {
      try {
        const id = await insertNewUser(req.body)
        res.status(201).json({
          id: id
        })
      } catch (err) {
        console.log("err", err)
        res.status(500).json({
          error: `Error inserting user into database ${err}`
        })
      }
  }
})

router.get('/:userid', requireAuthentication, async (req, res) => {
  const userid = parseInt(req.params.userid)
  const result = await getUserById(userid, false)
  if (req.user != req.params.userid) {
    res.status(403).json({
      error: "Unauthorized to access the specified resource"
    })
  } else {
    res.status(200).json({
      result
    })
  }
})

router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const userid = await getUserIdByEmail(req.body.email)
      const authenticated = await validateUser(userid, req.body.password)
      if (authenticated) {
        const token = generateAuthToken(req.body.id)
        res.status(200).send({ token: token })
      } else {
        res.status(401).send({
          error: "Invalid authentication credentials"
        })
      }
    } catch (err) {
      res.status(500).send({
        error: "Error logging in.  Try again later."
      })
    }
  } else {
    res.status(400).json({
      error: "Request body needs user id and password."
    })
  }
})
/*
 * Route to list all of a user's businesses.
 */
router.get('/:userid/businesses', requireAuthentication, async (req, res) => {
  const userid = parseInt(req.params.userid)
  const userBusinesses = await getUserBusinessesById(userid)
  if (req.user != req.params.userid) {
    res.status(403).json({
      error: "Unauthorized to access the specified resource"
    })
  } else {
    res.status(200).json({
      userBusinesses
    })
  }
})

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userid/reviews', requireAuthentication, async (req, res) => {
  const userid = parseInt(req.params.userid)
  const userReviews = await getUserReviewsById(userid)
  if (req.user != req.params.userid) {
    res.status(403).json({
      error: "Unauthorized to access the specified resource"
    })
  } else {
    res.status(200).json({
      userReviews
    })
  }
})

/*
 * Route to list all of a user's photos.
 */
router.get('/:userid/photos', requireAuthentication, async (req, res) => {
  const userid = parseInt(req.params.userid)
  const userPhotos = await getUserPhotosById(userid)
  if (req.user != req.params.userid) {
    res.status(403).json({
      error: "Unauthorized to access the specified resource"
    })
  } else {
    res.status(200).json({
      userPhotos
    })
  }
})

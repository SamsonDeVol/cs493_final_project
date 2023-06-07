var express = require('express');
var router = express.Router();

const { ValidationError } = require('sequelize');
const { validateAgainstSchema } = require('../lib/validation');
const { Course, CourseClientFields } = require('../models/course');
const { User } = require('../models/user');

/* 
 * Route to return a list of all Courses.
 * This list should be paginated. The Courses returned 
 * should not contain the list of students in the Course or the 
 * list of Assignments for the Course.
 */ 
router.get('/', async function(req, res) {
  let page = parseInt(req.query.page) || 1
  page = page < 1 ? 1 : page
  const numPerPage = 10
  const offset = (page - 1) * numPerPage

  const result = await Course.findAndCountAll({
    limit: numPerPage,
    offset: offset
  })

  /*
   * Generate HATEOAS links for surrounding pages.
   */
  const lastPage = Math.ceil(result.count / numPerPage)
  const links = {}
  if (page < lastPage) {
    links.nextPage = `/courses?page=${page + 1}`
    links.lastPage = `/courses?page=${lastPage}`
  }
  if (page > 1) {
    links.prevPage = `/courses?page=${page - 1}`
    links.firstPage = '/courses?page=1'
  }

  /*
   * Construct and send response.
   */
  res.status(200).json({
    courses: result.rows,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: result.count,
    links: links
  })
});

/*
 * Route to create a new Course.
 * Creates a new Course with specified data and adds it to the
 * application's database. Only an authenticated User with 'admin'
 * role can create a new Course.
 */
router.post('/', requireAuthentication, async function (req, res) {
  try {
    const course = await Course.create(req.body, CourseClientFields)
    res.status(201).send({ id: id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
});

// // Route to create a new course.
// router.post('/', async (req, res) => {
//   if (validateAgainstSchema(req.body, courseSchema)) {
//     try {
//       const id = await insertNewCourse(req.body)
//       res.status(201).json({
//         id: id,
//         links: {
//           course: `/courses/${id}`
//         }
//       })
//     } catch (err) {
//       console.log("err", err)
//       res.status(500).json({
//         error: `Error inserting course into database ${err}`
//       })
//     }
//   } else {
//     res.status(400).json({
//       error: "Request body is not a valid course object"
//     })
//   }
// })

module.exports = router;


// // Route to create business table. 
// router.post('/createBusinessesTable', async (req, res) => {
//   try {
//     await createBusinessesTable()
//     res.status(200).send({})
//   } catch (err) {
//     res.status(500).json({
//       error: "Error creating businesses table (may already exist)"
//     })
//   }
// })

// // Route to fetch info about a specific business. 
// router.get('/:businessid', async (req, res, next) => {
//   try {
//     const business = await getBusinessById(req.params.businessid)
//     res.status(200).json(business)
//   } catch {
//     next()
//   }
// })

// // Route to replace data for a business.
// router.put('/:businessid', async function (req, res, next) {
//   if (validateAgainstSchema(req.body, businessSchema)) {
//     try {
//       const updateSucessful = await updateBusinessById(req.params.businessid, req.body)
//       if (updateSucessful) {
//         res.status(200).send({
//           id: req.params.businessid,
//           links: {
//             business: `/businesses/${req.params.businessid}`
//           }})
//       } else {
//         next()
//       }
//     } catch (err) {
//       res.status(500).json({
//         error: "Unable to update business"
//       })
//     }
//   } else {
//     res.status(400).json({
//       error: "Request body is not a valid business object"
//     })
//   }
  
// })

// // Route to delete a business.
// router.delete('/:businessid', async function (req, res, next) {
//   try {
//     const deleteSuccessful = await deleteBusinessById(req.params.businessid)

//     if (deleteSuccessful) {
//             res.status(204).end()
//     } else {
//         next()
//     }
// } catch (err) {
//     res.status(500).send({
//         error: "Unable to delete business."
//     })
// }
// })

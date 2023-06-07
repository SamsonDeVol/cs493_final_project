var express = require('express');
var router = express.Router();

const { ValidationError } = require('sequelize');
const { validateAgainstSchema } = require('../lib/validation');
const { Course, CourseClientFields } = require('../models/course');
const { User } = require('../models/user');



module.exports = router;





// exports.router = router
// exports.businesses = businesses

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

// // Route to return a list of businesses.
// router.get('/', async (req, res) => {
// try {
//   const businessesPage = await getBusinessPage(parseInt(req.query.page) || 1)
//   res.status(200).send(businessesPage)
// } catch (err) {
//   res.status(500).json({
//     error: "Error fetching businesses list"
//   })
// }
// })

// // Route to create a new business.
// router.post('/', async (req, res) => {
//   if (validateAgainstSchema(req.body, businessSchema)) {
//     try {
//       const id = await insertNewBusiness(req.body)
//       res.status(201).json({
//         id: id,
//         links: {
//           business: `/businesses/${id}`
//         }
//       })
//     } catch (err) {
//       console.log("err", err)
//       res.status(500).json({
//         error: `Error inserting business into database ${err}`
//       })
//     }
//   } else {
//     res.status(400).json({
//       error: "Request body is not a valid business object"
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

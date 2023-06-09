const router = require('express').Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('accessing the /users route');
});


const { ValidationError } = require('sequelize');
const { validateAgainstSchema } = require('../lib/validation');
const { Course, CourseClientFields } = require('../models/course');
const { User, UserClientFields } = require('../models/user');

/* 
 * Route to return a list of all Courses.
 * This list should be paginated. The Courses returned 
 * should not contain the list of students in the Course or the 
 * list of Assignments for the Course.
 */ 


/* POST - create a new user */

router.post('/', async function (req, res) {
  try {
    const user = await User.create(req.body, UserClientFields)
    res.status(201).send({ id: user.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
});


/* POST - login a user */
router.post('/login', async function(req, res) {
  res.status(200).send('welcome to login')
})

/* GET - get a user by id */ 

router.get('/:id', async function(req, res) {
  console.log("id", req.params.id)
  res.status(200).send(`looking for user with id ${req.params.id}`)
});
module.exports = router;

const router = require('express').Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('accessing the /users route');
});

const { generateAuthToken } = require('../lib/auth')
const { ValidationError } = require('sequelize');
const { User, UserClientFields, validateUser, hashAndSaltPassword } = require('../models/user');

/* 
 * Route to return a list of all Courses.
 * This list should be paginated. The Courses returned 
 * should not contain the list of students in the Course or the 
 * list of Assignments for the Course.
 */ 


/* POST - create a new user */
router.post('/', async function (req, res) {
  try {
    const securePassword = await hashAndSaltPassword(req.body.password)
    req.body.password = securePassword
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
  if (req.body && req.body.email && req.body.password) {
    try {
      const user = await User.findOne({ where: { email: `${req.body.email}` } });
      const authenticated = await validateUser(user, req.body.password);
      if (authenticated) {
        const token = generateAuthToken(req.body.userId);
        res.status(200).send({
          token: token
        });
      } else {
        res.status(401).send({
          error: "Invalid authentication credentials."
        });
      }
    } catch (err) {
      res.status(500).send({
        error: "Error logging in. Try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body was invalid."
    });
  }
});

/* GET - get a user by id */ 
router.get('/:id', async function(req, res) {
  const id = req.params.id
  const user = await User.findByPk(id)
  if (user) {
    res.status(200).json({
      "name": user.name,
      "email": user.email,
      "role": user.role
    })
  } else {
    res.status(400).send(`user with id: ${id} not found`)
  }
});

module.exports = router;

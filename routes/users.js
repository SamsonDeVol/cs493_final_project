const router = require('express').Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('accessing the /users route');
});

const { generateAuthToken, validateUser, hashAndSaltPassword, requireAuthentication } = require('../lib/auth')
const { User, UserClientFields } = require('../models/user');
const { Course, CourseUsers, CourseClientFields } = require('../models/course');


/* POST - create a new user */
router.post('/', requireAuthentication, async function (req, res) {
  const { email, password, role } = req.body;

  // Only an authenticated User with 'admin' role can create users with the 'admin' or 'instructor' roles.
  if (role === 'admin' || role === 'instructor') {

    try {
      const user = await User.findOne({ where: { email: email } });
      const authenticatedUser = await validateUser(user, password);

      if (authenticatedUser && user.role === 'admin') {
        const securePassword = await hashAndSaltPassword(req.body.password)
        req.body.password = securePassword
        const user = await User.create(req.body, UserClientFields)
        res.status(201).send({ id: user.id });
      } else {
        res.status(403).send({
          error: `You are not authorized to create a user with the role '${role}'.`
        });
      }
    } catch (err) {
      res.status(400).send(err);
    }

  } else {

    // Any authenticated User can create a user with the 'student' role.
    try {
      const securePassword = await hashAndSaltPassword(req.body.password)
      req.body.password = securePassword
      const user = await User.create(req.body, UserClientFields)
      res.status(201).send({ id: user.id })
    } catch (err) {
      res.status(400).send(err)
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
        const token = generateAuthToken(user.id, user.role);
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
router.get('/:id', requireAuthentication, async function(req, res) {
  const id = req.params.id
  const user = await User.findByPk(id)

  if (!user) {
    res.status(400).send(`user with id: ${id} not found`)
  } 

  try {
    // Users can only access their own information.
    // Admins can access any user's information.
    if (req.user === id || req.role === 'admin') {

      // If the User has the 'instructor' role, res should include a list of the IDs of the Courses the User teaches.
      // (i.e. Courses whose `instructorId` field matches the ID of this User)
      if (user.role === 'instructor') {
        const coursesTaught = await Course.findAll({ where: { instructorId: id } })
        res.status(200).send({
          "name": user.name,
          "email": user.email,
          "role": user.role,
          "courses": coursesTaught.map(course => course.id)
        })
      } else if (user.role === 'student') {
        
        // If the User has the 'student' role, the response should include a list of the IDs of the Courses the User is enrolled in.
        const coursesTaken = await CourseUsers.findAll({ where: { userId: id } })
        res.status(200).send ({
          "name": user.name,
          "email": user.email,
          "role": user.role,
          "courses": coursesTaken.map(course => course.courseId) 
        })
      } else {
        res.status(200).send({
          "name": user.name,
          "email": user.email,
          "role": user.role
        })
      }

    } else {
      res.status(403).send({
        error: "You are not authorized to access this information."
      });
    }

  } catch (err) {
    res.status(404).send({
      error: "User not found."
    });
  }
});

module.exports = router;

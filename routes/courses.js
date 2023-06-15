const router = require('express').Router();


const { ValidationError } = require('sequelize');
const { Course, CourseUsers, CourseClientFields } = require('../models/course');
const { User } = require('../models/user');
const { Assignment } = require('../models/assignment');
const { requireAuthentication } = require("../lib/auth");

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
    res.status(201).send({ id: course.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
});

/*
 * Route to fetch data about a specific course.
 * Returns summary data about the Course, excluding the list of
 * students enrolled in the course and the list of Assignments for the course.
 */
router.get('/:id', async function (req, res, next) {
  const id = req.params.id
  const course = await Course.findByPk(id)
  if (course) {
    res.status(200).send(course)
  } else {
    next()
  }
});

/*
 * Route to update data for a specific course.
 * Performs a partial update on the data for the Course.
 * Note that enrolled students and assignments cannot be modified
 * via this endpoint. Only an authenticated User with 'admin' role 
 * or an authenticated 'instructor' User whose ID matches the instructorId
 * of the Course can update Course information.
 */
router.patch('/:id', requireAuthentication, async function (req, res, next) {
  if (req.role == 'admin' || req.user == instructor.id) {
    const id = req.params.id
    const result = await Course.update(req.body, {
      where: { id: id },
      fields: CourseClientFields
    })
    if (result[0] > 0) {
      res.status(200).send()
    } else {
      next()
    }
  }
});

/*
 * Route to remove a specific Course from the database.
 * Completely removes the data for the specified Course,
 * including all enrolled students, all Assignments, etc.
 * Only an authenticated User with 'admin' role can remove a Course.
 */
router.delete('/:id', requireAuthentication, async function (req, res, next) {
  const id = req.params.id
  const result = await Course.destroy({ where: { id: id }})
  if (req.role !== 'admin') {
    res.status(403).json({
      error: "Unauthorized to access the specified resource"
    });
  } else {
    if (result > 0) {
      res.status(204).send()
    } else {
      next()
    }
  }
});

/*
 * Route to fetch a list of the students enrolled in the Course.
 * Returns a list containing the User IDs of all
 * students currently enrolled in the Course. 
 * Only an authenticated User with 'admin' role or an 
 * authenticated 'instructor' User whose ID matches the 
 * instructorId of the Course can fetch the list of 
 * enrolled students.
 */
router.get('/:id/students', requireAuthentication, async function (req, res) {
  const course = await Course.findByPk(req.params.id)
  if (!course.instructorId) {
    res.status(404).send("specified course not found")
  }
  const instructor = await User.findByPk(course.instructorId)
  if (req.role == 'admin' || req.user == instructor.id) {
    const courseId = req.params.id
    const courseStudents = await CourseUsers.findAll({ where: {courseId: courseId}})
    
    const studentList = await Promise.all(courseStudents.map(async (student) => {
      const user = await User.findByPk(student.userId)
      return await user.name
    }))
    res.status(200).json({
      students: studentList
    })
  } else {
    res.status(403).send("request made by unauthorized user")
  }
});

/*
 * Route to update enrollment for a Course.
 * Enrolls and/or unenrolls students from a Course. 
 * Only an authenticated User with 'admin' role or an authenticated 
 * 'instructor' User whose ID matches the instructorId of the Course 
 * can update the students enrolled in the Course.
 */
router.post('/:id/students', requireAuthentication, async function (req, res) {
  const course = await Course.findByPk(req.params.id)
  if (!course.instructorId) {
    res.status(404).send("specified course not found")
  }
  try {
    const instructor = await User.findByPk(course.instructorId)
    if (req.role == 'admin' || req.user == instructor.id) {
      req.body.add.map(async (userId) => {
        CourseUsers.create({userId: userId, courseId: req.params.id})
      });
      req.body.remove.map(async (userId) => {
        CourseUsers.destroy({ where: {userId: userId, courseId: req.params.id} })
      });
      res.status(200).send({ added: req.body.add, removed: req.body.remove, courseId: req.params.id })
    } else {
      res.status(403).send("request made by unauthorized user")
    }
  } catch (e) {
    res.status(400).send( "The request body was either not present or did not contain the fields required")
  }
});

/*
 * Route to fetch a CSV file containing list of the students enrolled in the Course.
 * Returns a CSV file containing information about all of the students
 * currently enrolled in the Course, including names, IDs, and 
 * email addresses. Only an authenticated User with 'admin' role 
 * or an authenticated 'instructor' User whose ID matches the 
 * instructorId of the Course can fetch the course roster.
 */
router.get('/:id/roster', async function (req, res) {
  if (req.role == 'admin' || req.user == instructor.id) {
    const courseId = req.params.id
    const courseRoster = await Course.findAll({ where: {courseId: courseId}})
    res.status(200).json({
      roster: courseRoster
    })
  }
});

/*
 * Route to fetch a list of the Assignments for the Course.
 * Returns a list containing the Assignment IDs of all
 * Assignments for the Course.
 */
router.get('/:id/assignments', async function (req, res) {
  const courseId = req.params.id
  const courseAssignments = await Assignment.findAll({ where: {courseId: courseId}})
  res.status(200).json({
    results: courseAssignments
  })
});

module.exports = router;

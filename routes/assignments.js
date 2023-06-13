var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const { Assignment, AssignmentClientFields } = require('../models/assignment')
const { Submission, SubmissionClientFields } = require('../models/submission')

module.exports = router;

/* GET assignment listing. */
router.get('/', function(req, res, next) {
  res.send('accessing the /assignments route');
});

/*
 * Route to create a new assignment.
 */
router.post('/', async function (req, res, next) {
  try {
    const assignment = await Assignment.create(req.body, AssignmentClientFields)
    res.status(201).send({ id: assignment.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
})

/*
 *  Fetch data about a specific Assignment.
 */
router.get('/id', async function (req, res) {
  const assignment = await Assignment.findByPk(id)
  if (assignment) {
    res.status(200).send(assignment)
  } else {
    next()
  }

})

/*
 *  Update data for a specific Assignment.
 */
router.patch('/id', async function (req, res) {
  const assignmentId = req.params.assignmentId
  const result = await Assignment.update(req.body, {
    where: { id: assignmentId },
    fields: AssignmentClientFields
  })
  if (result[0] > 0) {
    res.status(204).send()
  } else {
    next()
  }
})

/*
 *  Remove a specific Assignment from the database.
 */
router.delete('/{id}', async function (req, res) {
  const assignmentId = req.params.assignmentId
  const result = await Assignment.destroy({ where: { id: assignmentId }})
  if (result > 0) {
    res.status(204).send()
  } else {
    next()
  }
})

/*
 * Route to return a list of submissions for an assignment.
 */
router.get('/{id}/submissions', async function (req, res) {
  /*
   * Compute page number based on optional query string parameter `page`.
   * Make sure page is within allowed bounds.
   */
  let page = parseInt(req.query.page) || 1
  page = page < 1 ? 1 : page
  const numPerPage = 10
  const offset = (page - 1) * numPerPage

  const result = await Submission.findAndCountAll({
    limit: numPerPage,
    offset: offset
  })

  /*
   * Generate HATEOAS links for surrounding pages.
   */
  const lastPage = Math.ceil(result.count / numPerPage)
  const links = {}
  if (page < lastPage) {
    links.nextPage = `/{id}/submissions?page=${page + 1}`
    links.lastPage = `/{id}/submissions?page=${lastPage}`
  }
  if (page > 1) {
    links.prevPage = `/{id}/submissions?page=${page - 1}`
    links.firstPage = '/{id}/submissions?page=1'
  }

  /*
   * Construct and send response.
   */
  res.status(200).json({
    submissions: result.rows,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: result.count,
    links: links
  })
})

/*
 * Route to create a new submission.
 */
router.post('/{id}/submissions', upload.single('file'), async function (req, res, next) {
  try {
    const submission = await submission.create({
      'assignmentId': req.params.id,
      'studentId': 0, //get from authentication
      'grade': -1,
      'file': req.file.buffer,
      'fileType': req.file.mimetype
    }, SubmissionClientFields)
    res.status(201).send({ id: submission.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
})

var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const { Submission, SubmissionClientFields } = require('../models/submission')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('accessing the /assignments route');
});

module.exports = router;

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


/*
 * Route to return a list of submissions.
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

  // const [results] = await mysqlPool.query('SELECT image, mimetype FROM photos WHERE id = ?',
  // id);
  // if (results.length == 0) {
  //   res.status(404).json({"Error": "id does not exist"});
  // } else {
  //   res.setHeader('Content-Type', results[0].mimetype);
  //   res.send(results[0].image);
  // }

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




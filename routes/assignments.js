var express = require('express');
var router = express.Router();

const crypto = require("node:crypto")
var fs = require('fs');

const { requireAuthentication } = require('../lib/auth')
const { Submission, SubmissionClientFields, fileTypes } = require('../models/submission')
const { Course } = require('../models/course')
const { User } = require('../models/user')
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/../uploads`,
    filename: (req, file, callback) => {
        const filename = crypto.pseudoRandomBytes(16).toString("hex")
        const extension = fileTypes[file.mimetype]
        callback(null, `${filename}.${extension}`)
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!fileTypes[file.mimetype]);
  }
});
const { ValidationError } = require('sequelize')
const { Assignment, AssignmentClientFields } = require('../models/assignment')


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
router.get('/:id', async function (req, res) {
  const assignment = await Assignment.findByPk(req.params.id)
  if (assignment) {
    res.status(200).send(assignment)
  } else {
    res.status(404).json({"status": "not found"})
  }

})

/*
 *  Update data for a specific Assignment.
 */
router.patch('/:id', async function (req, res) {
  const assignmentId = req.params.id
  try {  
    const result = await Assignment.update(req.body, {
    where: { id: assignmentId },
    fields: AssignmentClientFields
    })
    if (result[0] > 0) {
      res.status(200).json({"status": "okay"})
    } else {
      res.status(500).send("status error")
    }
  } catch (err) {
    res.status(500).send(err)
  }

})

/*
 *  Remove a specific Assignment from the database.
 */
router.delete('/:id', async function (req, res) {
  const assignmentId = req.params.id
  try {
    const result = await Assignment.destroy({ where: { id: assignmentId }})
    if (result > 0) {
      res.status(204).send()
    } else {
      res.status(500).send("status error")
    }
  } catch (err) {
    res.status(500).send(err)
  }
  
})

router.get('/submissions/:id/download', requireAuthentication, async function (req, res) {
  // try to get file from submission file upload
  try{
    const submission = await Submission.findByPk(req.params.id)
    if(!submission){
      res.status(400).send("cannot find submission with that id")
    }
    var file = submission.filePath;
    var filename = file.split('.');
    var mimetype = submission.fileType;
  
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
  
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  } catch {
    res.status(400).send("error downloading file.")
  }  
})
/*
 * Route to return a list of submissions for an assignment.
 */
router.get('/:id/submissions', requireAuthentication, async function (req, res) {
  /*
   * Compute page number based on optional query string parameter `page`.
   * Make sure page is within allowed bounds.
   */
  const id = req.params.id
  // try to get assignment data
  try{ 
    const assignment = await Assignment.findByPk(id)
    const course = await Course.findByPk(assignment.courseId)
    const instructor = await User.findByPk(course.instructorId)

    // verify user matches requirements for query
    if (req.role == 'admin' || req.user == instructor.id){
      let page = parseInt(req.query.page) || 1
      page = page < 1 ? 1 : page
      const numPerPage = 10
      const offset = (page - 1) * numPerPage
    
      const result = await Submission.findAndCountAll({
        limit: numPerPage,
        offset: offset
      })

      console.log("res: ", result)
    
      /*
      * Generate HATEOAS links for surrounding pages.
      */
      const lastPage = Math.ceil(result.count / numPerPage)
      const links = {}
      if (page < lastPage) {
        links.lastPage = `/assignments/${id}/submissions?page=${lastPage}`
        links.nextPage = `/assignments/${id}/submissions?page=${page + 1}`
      } else if (page > 1) {
        links.prevPage = `/assignments/${id}/submissions?page=${page - 1}`
        links.firstPage = `/assignments/${id}/submissions?page=1`
      } else {
        links.firstPage = `/assignments/${id}/submissions?page=1`
      }
    
      /*
      * Construct and send response.
      */
      for (const subIndex in result.rows) {
        // result.row[subIndex].downloadLink = '/assignment'
        console.log("submission id", result.rows[subIndex]);
        result.rows[subIndex].dataValues.downloadLink = `/assignments/submissions/${result.rows[subIndex].id}/download`

      }
      
      console.log("result", result.rows)

      res.status(200).json({
        submissions: result.rows,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: result.count,
        links: links
      })
    } else {
      res.status(403).send("The request was not made by an authenticated User")
    } 
  } catch {
    res.status(404).send(`Specified Assignment with id: ${id} not found`)
  }
})

/*
 * Route to create a new submission.
 */
router.post('/:id/submissions', requireAuthentication, upload.single('file'), async function (req, res, next) {
  console.log("req stuff", req.file.mimetype)
  console.log(" req file path", req.file.path)
  try {
    const submission = await Submission.create({
      'assignmentId': req.params.id,
      'studentId': 7, //get from authentication
      'grade': -1,
      'filePath': req.file.path,
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
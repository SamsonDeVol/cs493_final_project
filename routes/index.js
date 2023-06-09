const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/courses', require('./courses'));
router.use('/assignments', require('./assignments'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

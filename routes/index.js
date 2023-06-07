// var express = require('express');
// var router = express.Router();

const router = module.exports = require('express').Router();

router.use('/users', require('./users').router);
router.use('/courses', require('./courses').router);
router.use('/assignments', require('./assignments').router);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

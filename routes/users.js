var express = require('express');
var router = express.Router();

exports.router = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('accessing the /users route');
});

/* POST - create a new user */


/* POST - login a user */


/* GET - get a user by id */ 

module.exports = router;

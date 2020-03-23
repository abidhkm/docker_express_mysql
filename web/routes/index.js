var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var connection = require('../dbConnect')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ test: 'success!!' })
});

function verifyUser(req,res,next) {
  jwt.verify(req.headers.token, 'mysecret', (err, authData) => {
    if (err) {
      console.log(req.headers)
      res.sendStatus(403)
    } else {
      req.authData = authData
      next();
    }
  })
}

router.get('/verify',verifyUser, function (req, res, next) {
      res.json({
        message: 'success',
        authData:req.authData
      })
});

router.get('/getToken', function (req, res, next) {
  const user = {
    name: 'abidh',
    password: 'password'
  }
  jwt.sign({ user: user }, 'mysecret', (err, token) => {
    res.json({
      token
    })
  })
});


router.get('/data', function (req, res, next) {

  console.log('test-db')

  let sql = `SELECT * FROM authors`;
  connection.query(sql, [true], (error, results, fields) => {
    if (error) {
      return console.error(error.message,'error');
    }
    console.log(results);
    res.send(results)
  });
});



module.exports = router;

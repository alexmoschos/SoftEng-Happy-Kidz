var express = require('express');
var router = express.Router();
var passport = require('../apis/passport');
var validator = require('express-validator');
const request = require('request');
var path = require('path');
var fs = require('fs');
var conf = require('../config');
var multer = require('multer');
var mkdirp = require('mkdirp');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dest = path.join(__dirname, '../public/files');
    mkdirp(dest, function (err) {
        if (err) cb(err, dest);
        else cb(null, dest);
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname);
  }
});

var upload = multer({ storage: storage });

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

/* GET create event page. */
router.get('/', function (req, res, next) {
  res.render('register',
    {
      errors: [],
      tab: "userTab"
    });
});



router.post('/:type', upload.any(),function (req, res, next) {
  var type = req.params.type;
  if (type == 'user') {
    // Do some checks here (all form fields have to be valid)
    req.assert('email', 'A valid email is required').isEmail();
    req.assert('password', 'passwords must be at least 8 chars long and contain one number')
      .isLength({ min: 8 })
      .matches(/\d/);
    req.assert('passwordAgain', 'Passwords do not match').equals(req.body.password);
    let errors = req.validationErrors();
    if (!errors) {   //No errors were found. Continue with the registration!
      //SUCCESS
      passport.authenticate('local-signup-user', function (err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if (!user) {
          return res.status(409).render('register', { errMsg: info.errMsg, errors: [], tab: "userTab" });
        }
        req.login(user, function (err) {
          if (err) {
            console.error(err);
            return next(err);
          }
          return res.redirect('/');

        });
      })(req, res, next);
    }
    else {   //Display errors to user
      res.render('register', {
        errors: errors,
        tab: "userTab"
      });
    }


  } else if (type == 'provider') {


    // Do some checks here (all form fields have to be valid)
    req.assert('email', 'A valid email is required').isEmail();  //Validate email
    req.assert('password', 'passwords must be at least 8 chars long and contain one number')
      .isLength({ min: 8 })
      .matches(/\d/);
    req.assert('passwordAgain', 'Passwords do not match').equals(req.body.password);
    let errors = req.validationErrors();
    if (!errors) {   //No errors were found.  Passed Validation!
      //SUCCESS
      passport.authenticate('local-signup-provider', function (err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if (!user) {
          return res.status(409).render('register', { errMsg: info.errMsg, errors: [], tab: "providerTab" });
        }
        req.login(user, function (err) {
          if (err) {
            console.error(err);
            return next(err);
          }
          return res.redirect('/');

        });
      })(req, res, next);
    }
    else {   //Display errors to user
      res.render('register', {
        errors: errors,
        tab: "providerTab"
      });
    }
  }
  else {
    return res.render('');
  }
});
module.exports = router;
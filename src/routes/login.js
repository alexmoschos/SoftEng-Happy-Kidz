var express = require('express');
var router = express.Router();
var passport = require('../apis/passport');
var db = require('../models/db');
var auth = require('../apis/authentication');
var mail = require('../apis/mail');
var utilities = require('../apis/utilities');
var bcrypt = require('bcrypt');


/* GET create event page. */
router.get('/', function(req, res, next) {
    res.render('login', {user: req.user});
});

router.post('/reset', function(req, res, next) {

  if (typeof req.body.email === 'string' || req.body.email instanceof String){
    var find = auth.findUserByEmail(req.body.email, function(result) {
      if (result){
          //create new random 12 digit password
          var newPassword = utilities.makeid(12);
          var update = result.user.update({password: bcrypt.hashSync(newPassword,10)});
          update.then( (succ) => {
            //stelnoume mail
            if (succ) {
              var finalRes = mail.sendTextEmail('Αλλαγή Κωδικού', result.user.email, 'Ο νέος σας κωδικός είναι: ' + newPassword);
              finalRes.then( (succ1) => {
                if (succ1) {
                  res.render('successReset', {user: req.user});
                }
                else{
                  console.log('error in mail');
                  res.render('/');
                }

              });
            }
            else{
              console.log('error in update');
              res.redirect('/');
            }

          });
        }
        else {
          res.render('failReset',{user: req.user});
        }
      }
      , console.log);
  }
  else{
    res.redirect('failReset',{user: req.user});
  }
});

router.get('/reset', function(req, res, next) {
  res.render('loginReset', {user: req.user});
});

router.post('/', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return res.status(409).render('login', {errMsg: info.errMsg, user: req.user});
      }
      req.login(user, function(err){
        if(err){
          console.error(err);
          return next(err);
        }
        if (user.type === 'admin')
          return res.redirect('/admin');
        return res.redirect('/');
      });
    })(req, res, next);
  });

module.exports = router;
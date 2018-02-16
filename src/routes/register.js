var express = require('express');
var router = express.Router();
var passport = require('../apis/passport');

/* GET create event page. */
router.get('', function(req, res, next) {
    res.render('register', {});
});


router.post('/:type', function(req, res, next) {
    var type = req.params.type;
    if (type === 'user') {

      // Do some checks here (all form fields have to be valid)

      passport.authenticate('local-signup-user', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if (!user) {
          return res.status(409).render('register', {errMsg: info.errMsg});
        }
        req.login(user, function(err){
          if(err){
            console.error(err);
            return next(err);
          }
          return res.redirect('/');
        });
      })(req, res, next);

    } else if (type === 'provider') {

      // Do some checks here (all form fields have to be valid)

      passport.authenticate('local-signup-provider', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if (!user) {
          return res.status(409).render('register', {errMsg: info.errMsg});
        }
        req.login(user, function(err){
          if(err){
            console.error(err);
            return next(err);
          }
          return res.redirect('/');
        });
      })(req, res, next);

    }
    else {
      return res.render('')
    }
});
module.exports = router;
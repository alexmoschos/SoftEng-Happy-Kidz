var express = require('express');
var router = express.Router();
var passport = require('../apis/passport');

/* GET create event page. */
router.get('/', function(req, res, next) {
    res.render('login', {});
});

router.post('/', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return res.status(409).render('login', {errMsg: info.errMsg});
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
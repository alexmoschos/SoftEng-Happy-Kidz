var express = require('express');
var router = express.Router();
var configFile = require('../config');

router.get('/', function(req, res, next){
		res.render('membership',{user: req.user, config: configFile});
});


module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
		res.render('membership',{user: req.user});
});


module.exports = router;

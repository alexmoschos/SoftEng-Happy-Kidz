var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
		res.render('subscription',{});
});

router.post('/', function(req, res, next){
		//prepei kapou na bazoume ti tha plirwsei o user
		console.log(req.body.plan);
		res.redirect('/successPayment');
});


module.exports = router;

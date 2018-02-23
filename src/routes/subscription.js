var express = require('express');
var router = express.Router();
var db = require('../models/db');
var auth = require('../apis/authentication');


router.get('/', function(req,res){
	res.render('no_page', {user: req.user});
});

router.post('/', function(req, res){
	if (req.user.type !== 'parent'){
		req.render('no_page', {user: req.user});
	}
	else{
		var newSubscription = {
			parentId: req.user.user.parentId,
			organizerId: req.body.providerId
		};
		db.Subscription.create(newSubscription)
		.then((succ) => res.redirect('/provider/'+req.body.providerId));
	}

});

router.delete('/:providerId', function(req, res){
	db.Subscription.destroy({
		where: {
			parentId: req.user.user.parentId,
			organizerId: req.params.providerId
		}
	});
});

module.exports = router;
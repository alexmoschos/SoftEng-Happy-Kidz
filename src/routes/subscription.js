var express = require('express');
var router = express.Router();
var db = require('../models/db');
var auth = require('../apis/authentication');


router.get('/', function(req,res){
	res.render('no_page', {user: req.user});
});

router.post('/', auth.isUserParent, function(req, res){
	console.log('here');
	console.log(req.user);
	
	var newSubscription = {
		parentId: parseInt(req.user.user.parentId),
		organizerId: parseInt(req.body.providerId)
	};
	db.Subscription.create(newSubscription)
	.then((succ) => {console.log('wtf');res.redirect('/parent/'+req.user.user.parentId);});

});

router.delete('/:providerId', auth.isUserParent, function(req, res){
	db.Subscription.destroy({
		where: {
			parentId: parseInt(req.user.user.parentId),
			organizerId: parseInt(req.params.providerId)
		}
	})
	.then(succ => {res.redirect('/parent/'+req.user.user.parentId);});
});

module.exports = router;
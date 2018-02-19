var express = require('express');
var router = express.Router();
var db = require('../models/db');
var bcrypt = require('bcrypt');

/* GET parent profile. */
router.get('/:parentId', function(req, res, next) {
	db.Parent.findById(req.params.parentId)
	.then( (parent) => {
		db.Organizer.findAll({
			include: [{
			  model: db.Event,
			  required: true
			}],
			// where: { organizerId: 4 }
		  })
		  .then( tickets => { 
			console.log(tickets);
			obj = {
				user: req.user,
				id: parent.parentId ,
				name: parent.name,
				category:"Gold",
				expiryDate: "12-12-12",
				points: parent.wallet,
				email: parent.email,
				bought: tickets
			};
			res.render('parent', obj);
		})
	});
});

router.get('/:parentId/settings', function(req, res){
	db.Parent.findById(req.params.parentId)
	.then( (parent) => { 
		obj = {
			user: req.user,
			errors: [],
			id: parent.parentId,
			name: parent.name,
			email: parent.email
		}
		res.render('parentSettings', obj)
})
});


router.post('/:parentId/settings', function(req, res){
	db.Parent.findById(req.params.parentId)
	.then( (parent) => { 
		var temp = bcrypt.compareSync(req.body.oldPassword, parent.password);
		if(!temp){
			req.assert('oldPassword', 'Λάθος Κωδικός').equals(true);			
		}
		req.assert('email', 'A valid email is required').isEmail(); 
		req.assert('newPassword', 'passwords must be at least 8 chars long and contain one number')
			.isLength({ min: 8 })
			.matches(/\d/);
		req.assert('newPasswordAgain', 'Passwords do not match').equals(req.body.newPassword);
		var errors = req.validationErrors();
		if( !errors){
			parent.update({email: req.body.email})
			.then ( (succ) => {
				return succ.update({password: bcrypt.hashSync(req.body.newPassword,10)});
			})
			.then( (succe) => res.redirect("/parent/" + req.params.parentId));
		}
		else{
			obj = {
				user: req.user,
				errors: errors,
				id: parent.parentId,
				name: parent.name,
				email: parent.email
			};
			res.render('parentSettings', obj);
		}
	})
});



router.delete('/:parentId', function(req, res){
	db.Parent.findById(req.params.parentId)
	.then( (parent) => {
		if (parent) {
			return parent.destroy();
		} else {
			res.send('No such parent!' + console.log(req.params.parentId))
		}
	}  )
	.then( (succeed) => res.redirect("/admin") );
});

module.exports = router;

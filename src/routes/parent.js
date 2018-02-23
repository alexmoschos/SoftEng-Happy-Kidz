var express = require('express');
var router = express.Router();
var db = require('../models/db');
var auth = require('../apis/authentication');
var utilities = require('../apis/utilities');
var mail = require('../apis/mail');


var bcrypt = require('bcrypt');
var HashMap = require('hashmap');



/* GET parent profile. */
router.get('/:parentId', auth.isUserParentId, function(req, res, next) {

	db.Parent.findOne({
		where: { parentId: req.params.parentId },
		include: [{
			model: db.Organizer,
			required: false,
			attributes: ['organizerId', 'name'],
			through: {
				model: db.Subscription
			}
		}]
	})
	// db.Parent.findById(req.params.parentId)
	.then( (parent) => {
		if (parent){
			console.log(parent.parentId);
			db.BoughtTickets.findAll({
				include: [{
				  model: db.Event,
				  required: true
				}],
				where: { parentId: parent.parentId }
			})
			.then( tickets => { 
				console.log(tickets);
				if(tickets){
					ticketMap = new HashMap(tickets.map( x => [x.eventId, x]));
					tickets = ticketMap.values();
				}
				db.Membership.findById(req.params.parentId)
				.then( member => {
					if(member != null){
						obj = {
							user: req.user,
							id: parent.parentId ,
							name: parent.name,
							category: member.membershipTier,
							expiryDate: member.expiryDate,
							points: parent.wallet,
							email: parent.email,
							bought: tickets,
							subscriptions: parent.organizers
						};
					}
					else{
						obj = {
							user: req.user,
							id: parent.parentId ,
							name: parent.name,
							category: 0,
							expiryDate: 0,
							points: parent.wallet,
							email: parent.email,
							bought: tickets,
							subscriptions: parent.organizers							
						};
					}
					res.render('parent', obj);
				})	
				// })
				
				// console.log(tickets);
			})
		}
		else {
            res.render('no_page',{user: req.user});
        }
	});
});

router.get('/:parentId/settings', auth.isUserParentId, function(req, res){
	db.Parent.findById(req.params.parentId)
	.then( (parent) => { 
		if(parent){
			obj = {
				user: req.user,
				errors: [],
				id: parent.parentId,
				name: parent.name,
				email: parent.email
			};
			res.render('parentSettings', obj);
		}
		else {
            res.render('no_page',{user: req.user});
        }	
	})
});


router.post('/:parentId/settings', auth.isUserParentId,function(req, res){
	var find = auth.findUserByEmail(req.body.email, function(result) {
		db.Parent.findById(req.params.parentId)
		.then( (parent) => {
			if (parent){
				if (result && req.body.email !== parent.email){
					req.assert('email', 'Υπάρχει ήδη χρήστης με αυτό το email').equals(true);	
				}
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
			}
			else {
				res.render('no_page',{user: req.user});
			} 	
		})
	})
});

router.delete('/:parentId', auth.isUserAdmin,  function(req, res){

	var parentId = utilities.checkInt(req.params.parentId);
	var email;

	db.Parent.findById(parentId)
	.then( (parent) => {
		if (parent) {
			email = parent.email;
			return parent.destroy();
		} else {
			res.send('No such parent!' + console.log(req.params.parentId))
		}
	})
	.then( (succ) => {
		if (succ){
		 return mail.sendTextEmail('Διαγραφή Λογαριασμού', email, 'Είμαστε στη δυσάρεστη θέση να σας ενημερώσουμε ότι ο λογαριαμός σας διαγράφηκε.');
		}
		else{
			console.log('error with deletion');
			res.redirect('/admin');
		}
	})
	.then( (succ) => {
		if (succ) {
			res.redirect('/admin');
		}
		else{
			console.log('error with email');
			res.redirect('/admin');
		}
	});
});

module.exports = router;
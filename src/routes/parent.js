var express = require('express');
var router = express.Router();
var db = require('../models/db');
var auth = require('../apis/authentication');
var utilities = require('../apis/utilities');
var mail = require('../apis/mail');
var fs = require('fs');
var promisify = require('js-promisify');
var bcrypt = require('bcrypt');
var HashMap = require('hashmap');



/* GET parent profile. */
router.get('/:parentId', auth.isUserParentId, function(req, res, next) {
	var tickets;
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
	.then( (parent) => {
		if (parent){
			db.BoughtTickets.findAll({
				include: [{
				  model: db.Event, 
				  required: true,
				  include: [{
					model: db.Organizer,
					required: true
				  }],
				}],
				where: { parentId: parent.parentId }
			})
			.then( eisitiria => {
				tickets = eisitiria;
				var future_tickets = [];
				var past_tickets = [];
				var promises = [];
 
				if(tickets){
					ticketMap = new HashMap(tickets.map( x => [x.eventId, x]));
					tickets = ticketMap.values();
					
					tickets.forEach(function(tick){
						promises.push(promisify(fs.readdir, ['./public/files/events/' + tick.eventId + "/"]));

						if(tick.startTime > Math.floor(Date.now() / 1000)){
							future_tickets.push(tick);
						}
						else{
							past_tickets.push(tick);
						}
					});
					
				}
				Promise.all(promises).
				then( succ => 
				{
					for (var i = 0; i < succ.length; i++){
						if (succ[i].length > 0){
							tickets[i].image = '/files/events/'+ tickets[i].eventId + '/' + succ[i][0];
						}
						else{
							tickets[i].image = '/happy.png';
						}
					}
					db.Membership.findById(parseInt(req.params.parentId))
					.then( member => {
					if(member != null){
						var exp;
						var cat;
						if (member.expiryDate < Math.floor(Date.now() / 1000)){
							exp = 0;
							cat = '0';
						}
						else{
							exp = member.expiryDate;
							cat = member.membershipTier;
						}
						console.log(cat);
						
						obj = {
							user: req.user,
							id: parent.parentId ,
							name: parent.name,
							category: cat,
							expiryDate: exp,
							points: parent.wallet,
							email: parent.email,
							bought: future_tickets,
							past: past_tickets,
							subscriptions: parent.organizers
						};

					}
					else{
						console.log('here');
						obj = {
							user: req.user,
							id: parent.parentId ,
							name: parent.name,
							category: '0',
							expiryDate: 0,
							points: parent.wallet,
							email: parent.email,
							bought: future_tickets,
							past: past_tickets,
							subscriptions: parent.organizers							
						};
					}
					res.render('parent', obj);
				});
				});
					
				// })
				
				// console.log(tickets);
			});
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
	});
});


router.post('/:parentId/settings', auth.isUserParentId,function(req, res){
	var find = auth.findUserByEmail(req.body.email, function(result) {
		db.Parent.findById(req.params.parentId)
		.then( (parent) => {
			if (parent){
				if ((req.body.email !== parent.email) || (req.body.newPassword.length > 0)){
					if (result && req.body.email !== parent.email){
						req.assert('email', 'Υπάρχει ήδη χρήστης με αυτό το email').equals(true);	
					}
					var temp = bcrypt.compareSync(req.body.oldPassword, parent.password);
					if(!temp){
						req.assert('oldPassword', 'Λάθος Κωδικός').equals(true);			
					}
					req.assert('email', 'A valid email is required').isEmail(); 
					if (req.body.newPassword.length > 0){
						req.assert('newPassword', 'passwords must be at least 8 chars long and contain one number')
							.isLength({ min: 8 })
							.matches(/\d/);
						req.assert('newPasswordAgain', 'Passwords do not match').equals(req.body.newPassword);
					}
					var errors = req.validationErrors();
					if( !errors && req.body.newPassword.length > 0){
						req.flash('success', 'Επιτυχία !');
						parent.update({email: req.body.email})
						.then ( (succ) => {
							return succ.update({password: bcrypt.hashSync(req.body.newPassword,10)});
						})
						.then( (succe) => res.redirect("/parent/" + req.params.parentId));
					}
					else if( !errors ){ // here, user did not put a new password
						req.flash('success', 'Επιτυχία !');
						parent.update({email: req.body.email})
						.then( (succ) => res.redirect("/parent/" + req.params.parentId));
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
				else { // user didnt change anything at all
					req.flash('error', 'Δεν αλλάξατε κανένα πεδίο !');
					res.redirect("/parent/" + req.params.parentId);
				}	
			}
			else {
				res.render('no_page',{user: req.user});
			} 	
		});
	});
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
			res.send('No such parent!' + console.log(req.params.parentId));
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
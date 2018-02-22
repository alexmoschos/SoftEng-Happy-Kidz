var express = require('express');
var router = express.Router();
var elastic = require('../apis/elastic_interface');
var geocoding = require('../apis/geocoding');
var db = require('../models/db');
const request = require('request');
var conf = require('../config');
var auth = require('../apis/authentication');
var db = require('../models/db');
const Sequelize = require('sequelize');

var mail = require('../apis/mail');
var bcrypt = require('bcrypt');
var HashMap = require('hashmap');


var utilities = require('../apis/utilities');



const Op = Sequelize.Op;



/* GET create event page. */
router.get('/:providerId', function(req, res) {
	providerId = utilities.checkInt(req.params.providerId);
	if (!providerId) { res.render('no_page', {user: req.user});}

	if (req.isAuthenticated()){
		console.log(req.user.user.organizerId);
		db.Organizer.findAll({
			where: {
				organizerId : providerId
			}
		}).then(provider => {
			if (provider.length > 0) {
				var currtime = new Date().getTime()/1000;
				var result = provider[0].dataValues;
				db.Event.findAll({
					where: {
						organizerId: providerId,
						startTime:{
							[Op.lt]: currtime
						}
					}
				}).then(events => {
					PastEventsArray = [];
					events.forEach(function(element,i){
						var event = element.dataValues;
						var startDate = new Date(event.startTime*1000);
						var numberdate = startDate.getDate();
						var month = startDate.getMonth()+1;
						var year = startDate.getFullYear();
						var hours = startDate.getHours();
						if(hours < 10)hours = "0" + hours;
						var minutes = startDate.getMinutes();
						if(minutes < 10)minutes = "0" + minutes;
						var time = hours + ":" + minutes;
						var stringDate = numberdate + "/"+month+"/"+year;
						PastEventsArray[i]= 
						{
							eventId : event.eventId,
							ImgUrl: "../files/events/"+event.eventId +"/0",
							Title: event.title,
							Date: stringDate,
							Hours: time,
							Address: event.geoAddress,
							Provider: result.name,
							Ages: event.minAge + "-" + event.maxAge,
							PhoneNumber: result.phone,
							InitialPrice: event.ticketPrice,
							FinalPrice: event.discount
						};
					});
					db.Event.findAll({
						where: {
							organizerId: providerId,
							startTime:{
								[Op.gt]: currtime
							}
						}
					}).then(upcomingEvents => {
						var CurrentEvents = [];
						upcomingEvents.forEach(function(element,i){
							var event = element.dataValues;
							var startDate = new Date(event.startTime*1000);
							var numberdate = startDate.getDate();
							var month = startDate.getMonth()+1;
							var year = startDate.getFullYear();
							var hours = startDate.getHours();
							if(hours < 10)hours = "0" + hours;
							var minutes = startDate.getMinutes();
							if(minutes < 10)minutes = "0" + minutes;
							var time = hours + ":" + minutes;
							var stringDate = numberdate + "/"+month+"/"+year;
							CurrentEvents[i]= 
							{
								eventId : event.eventId,
								ImgUrl: "../files/events/"+event.eventId +"/0",
								Title: event.title,
								Date: stringDate,
								Hours: time,
								Address: event.geoAddress,
								Provider: result.name,
								Ages: event.minAge + "-" + event.maxAge,
								PhoneNumber: result.phone,
								InitialPrice: event.ticketPrice,
								FinalPrice: event.discount,
								BarchartID: event.eventId
							};
							
						});						
						var ProviderInfo =  {
							PersonalInfo: { ProviderName : result.name, ProviderText : result.description,
								ProviderId : providerId,
								ProviderEmail : result.email,
								ProviderPage :result.webpage,
								ProviderPhoneNumber: result.phone,
								ProviderAddress : "25ης Μαρτίου 10, Βριλήσσια"},
								PastEventsList: PastEventsArray,
								CurrentEventsList: CurrentEvents,
								user: req.user

							}; 
							if ((req.user.type === 'organizer') && (req.user.user.organizerId == req.params.providerId)) { //the request was made by the owner
								res.render('ProviderPage', ProviderInfo);
							}
							else {
								//Render a page for users-providers with other id-admins
								res.render('providerPageAsUser', ProviderInfo);
							}

						});
				});
			} 
			else {
				res.render('no_page', {user: req.user});
			}      
		});		
	}
	else {
		res.redirect('/login');
	}
});
router.get('/:providerId/settings',function(req,res,next){
	providerId = utilities.checkInt(req.params.providerId);
	if (!providerId) { res.render('no_page', {user: req.user});}
	if (req.isAuthenticated()){
		if(req.user.type === 'organizer'){
			if(providerId == req.user.user.organizerId){
				// res.send("you hit the provider Settings!");
				db.Organizer.findAll({
					where: {
						organizerId : providerId
					}
				}).then(provider => {
					console.log(provider);
					var result = provider[0].dataValues;
					var ProviderInfo= {
						name : result.name,
						id : result.organizerId,
						email : result.email,
						errors : []
					};
					res.render('ProviderSettings',ProviderInfo);

				});

			}
		}
	}
});

router.post('/:providerId/settings',function(req,res,next){
	providerId = utilities.checkInt(req.params.providerId);
	if (!providerId) { return res.render('no_page', {user: req.user});}
	var find = auth.findProviderByEmail(req.body.email, function(result) {
		db.Organizer.findById(providerId)
		.then( (provider) => {
			if (provider){
				if (result && req.body.email !== provider.email){
					req.assert('email', 'Υπάρχει ήδη provider με αυτό το email').equals(true);	
				}
				var temp = bcrypt.compareSync(req.body.oldPassword, provider.password);
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
					provider.update({email: req.body.email})
					.then ( (succ) => {
						return succ.update({password: bcrypt.hashSync(req.body.newPassword,10)});
					})
					.then( (succe) => res.redirect("/provider/" + providerId));
				}
				else{
					obj = {
						user: req.user,
						errors: errors,
						id: provider.organizerId,
						name: provider.name,
						email: provider.email
					};
					res.render('ProviderSettings', obj);
				}
			}
			else {
				res.render('no_page',{user: req.user});
			} 	
		})
	});
});



/* Create a new provider */
router.post('/', function(req, res, next) {
	var event = req.body;
	console.log(event);

	res.send("You have submitted an event!");

});

/* Route to delete a provider */
router.delete('/:providerId', auth.isUserAdmin, function(req, res){


	var providerId = utilities.checkInt(req.params.providerId);
	var email;

	
	if (!providerId) { res.render('no_page', {user: req.user});}


	db.Organizer.findById(providerId)
	.then( (provider) => {
		if (provider) {
			email = provider.email;
			return provider.destroy();
		} else {
			res.send('No such provider!' + console.log(req.params.providerId))
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

/* Route to accept a provider */

router.put('/:providerId', auth.isUserAdmin, function(req, res){


	var providerId = utilities.checkInt(req.params.providerId);
    if (!providerId) { res.render('no_page', {user: req.user});}
    var email;

	
	if (!providerId) { res.render('no_page', {user: req.user});}
	
	db.Organizer.findById(providerId)
	.then( (provider) => {
		if (provider && provider.isVerified === false) {
			return provider.update({isVerified: true});
		}  
		else {
			console.log(provider);
			res.render('no_page', {user: req.user});
		}
	})
	.then ( (succ) => res.redirect("/admin")); 

});
    

module.exports = router;

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
var auth = require('../apis/authentication');


const Op = Sequelize.Op;


/* GET create event page. */
router.get('/:providerId', function(req, res) {
	var providerId = req.params.providerId;
	if (req.isAuthenticated()){
		if ((req.user.type === 'organizer') && (req.user.user.organizerId == req.params.providerId)) { //the request was made by the owner
			console.log(req.user.user.organizerId);
		  	db.Organizer.findAll({
				where: {
					organizerId : providerId
				}
			}).then(provider => {
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
													ProviderEmail : result.email,
													ProviderPage :result.webpage,
													ProviderPhoneNumber: result.phone,
													ProviderAddress : "25ης Μαρτίου 10, Βριλήσσια"},
							PastEventsList: PastEventsArray,
							CurrentEventsList: CurrentEvents,
							user: req.user
					
						};
						res.render('ProviderPage', ProviderInfo);
					});
				});
			});
		}
		else {
			res.send("thats not me");
		}
	}
	else {
		res.redirect('/login');
	}
});

/* Create a new provider */
router.post('/', function(req, res, next) {
    var event = req.body;
    console.log(event);

    res.send("You have submitted an event!");
    
});

/* Route to delete a provider */
router.delete('/:providerId', auth.isUserAdmin, function(req, res){
	providerId = utilities.checkInt(req.params.providerId);
    if (!providerId) { res.render('no_page', {user: req.user});}

	db.Organizer.findById(providerId)
	.then( (provider) => {
		if (provider) {
			return provider.destroy();
		} else {
			res.render('no_page',{user: req.user})
		}
	}  )
	.then( (succ) => res.redirect("/admin") );

});

/* Route to accept a provider */

router.put('/:providerId', auth.isUserAdmin, function(req, res){

	providerId = utilities.checkInt(req.params.providerId);
    if (!providerId) { res.render('no_page', {user: req.user});}
	
    db.Event.findById(providerId)
    .then( (provider) => {
        if (provider && provider.isVerified === false) {
            return provider.update({isVerified: true});
        }  
        else {
                    res.render('no_page', {user: req.user});
        }
    })
    .then ( (succ) => res.redirect("/admin")); 
});

module.exports = router;

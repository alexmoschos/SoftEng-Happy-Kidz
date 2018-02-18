var express = require('express');
var router = express.Router();
var elastic = require('../apis/elastic_interface');
var geocoding = require('../apis/geocoding');
const request = require('request');
var conf = require('../config');
var auth = require('../apis/authentication');
var db = require('../models/db');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;  

/* GET create event page. */
router.get('/', function(req, res, next) {
	var providerId = req.user.user.organizerId;
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
				endTime:{
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
					ImgUrl: "files/events/"+event.eventId +"/0",
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
					ImgUrl: "files/events/"+event.eventId +"/0",
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
					CurrentEventsList: CurrentEvents
			
				};
				res.render('ProviderPage', ProviderInfo);
			});
		});
	});
});

/* POST create event page */
router.post('/', function(req, res, next) {
    var event = req.body;
    console.log(event);
    /*geocoding(event.location, function(loc) {
        event.location = {
            lat: loc.lat,
            lon: loc.lng
        };
	console.log(event);
        event.tickets = parseInt(event.tickets);
        event.price = parseFloat(event.price);
        event.start_time = parseInt(event.start_time);
        event.end_time = parseInt(event.end_time);
	
        elastic.insert('events', event, function (err, resp, status) {
            if (err) {
                console.log(err);
            }
            else {
                res.send("ok");
            }
        });
    });*/
    res.send("You have submitted an event!");
    
});

module.exports = router;

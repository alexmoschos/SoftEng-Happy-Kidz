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
  /*var ProviderInfo =  {
		PersonalInfo: { ProviderName : "Κανδήρος Βαρδής", ProviderText : "Είμαι ένας Provider",
											ProviderEmail : "vkandiros@yahoo.gr",
											ProviderPage : "google.gr",
											ProviderPhoneNumber: "6814123",
											ProviderAddress : "25ης Μαρτίου 10, Βριλήσσια"},
		PastEventsList: [
			{
				ImgUrl: "barcelona.png",
				Title: "Ποδοσφαιρομάνια στο Μαρούσι",
				Date: "17/10/2008",
				Hours: "18:00-20:00",
				Address: "Μαρούσι",
				Provider: "Αθλητικός Όμιλος Αμαρουσίου",
				Ages: "7-10",
				PhoneNumber: "210-6814789",
				InitialPrice: "10 €",
				FinalPrice: "5 €"
			}
		],
		CurrentEventsList: [
			{
				ImgUrl: "barcelona.png",
				Title: "Ποδοσφαιρομάνια στο Μαρούσι",
				Date: "17/10/2008",
				Hours: "18:00-20:00",
				Address: "Μαρούσι",
				Provider: "Αθλητικός Όμιλος Αμαρουσίου",
				Ages: "7-10",
				PhoneNumber: "210-6814789",
				InitialPrice: "10 €",
				FinalPrice: "5 €",
				EmptySeats: 15,
				BookedSeats: 35,
				BarchartID: "barchart1",
				ChartData: [
        ['Genre', 'Ελεύθερες', 'Κρατημένες', { role: 'annotation' } ],
        ['Θέσεις', 10, 24, '']
      ],
				ChartOptions: {
				title: "Θέσεις",
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: 'percent',
        backgroundColor: '#e6ecf0'
			 }
			}
		]
	};
  */
  db.Organizer.findAll({
	where: {
		organizerId : 123
		}
	}).then(provider => {
		var currtime = new Date().getTime()/1000;
		var result = provider[0].dataValues;
		db.Event.findAll({
			where: {
				organizerId: 123,
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
					ImgUrl: "files/"+event.eventId +"/0",
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
					organizerId: 123,
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
					ImgUrl: "files/"+event.eventId +"/0",
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
			/*[
			{
				ImgUrl: "barcelona.png",
				Title: "Ποδοσφαιρομάνια στο Μαρούσι",
				Date: "17/10/2008",
				Hours: "18:00-20:00",
				Address: "Μαρούσι",
				Provider: "Αθλητικός Όμιλος Αμαρουσίου",
				Ages: "7-10",
				PhoneNumber: "210-6814789",
				InitialPrice: "10 €",
				FinalPrice: "5 €",
				EmptySeats: 15,
				BookedSeats: 35,
				BarchartID: "barchart1",
				
			}
		]*/
				};
				res.render('ProviderPage', ProviderInfo);
			});
		});
		
		
		


	});
  
  /*var ProviderInfo =  {
		PersonalInfo: { ProviderName : "Κανδήρος Βαρδής", ProviderText : "Είμαι ένας Provider",
											ProviderEmail : "vkandiros@yahoo.gr",
											ProviderPage : "google.gr",
											ProviderPhoneNumber: "6814123",
											ProviderAddress : "25ης Μαρτίου 10, Βριλήσσια"},
		PastEventsList: [
			{
				ImgUrl: "barcelona.png",
				Title: "Ποδοσφαιρομάνια στο Μαρούσι",
				Date: "17/10/2008",
				Hours: "18:00-20:00",
				Address: "Μαρούσι",
				Provider: "Αθλητικός Όμιλος Αμαρουσίου",
				Ages: "7-10",
				PhoneNumber: "210-6814789",
				InitialPrice: "10 €",
				FinalPrice: "5 €"
			}
		],
		CurrentEventsList: [
			{
				ImgUrl: "barcelona.png",
				Title: "Ποδοσφαιρομάνια στο Μαρούσι",
				Date: "17/10/2008",
				Hours: "18:00-20:00",
				Address: "Μαρούσι",
				Provider: "Αθλητικός Όμιλος Αμαρουσίου",
				Ages: "7-10",
				PhoneNumber: "210-6814789",
				InitialPrice: "10 €",
				FinalPrice: "5 €",
				EmptySeats: 15,
				BookedSeats: 35,
				BarchartID: "barchart1",
				ChartData: [
        ['Genre', 'Ελεύθερες', 'Κρατημένες', { role: 'annotation' } ],
        ['Θέσεις', 10, 24, '']
      ],
				ChartOptions: {
				title: "Θέσεις",
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: 'percent',
        backgroundColor: '#e6ecf0'
			 }
			}
		]
	};*/
  

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

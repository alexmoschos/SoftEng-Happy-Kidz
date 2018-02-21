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
	if (req.isAuthenticated() && req.user.type === 'organizer'){
		var organizerId = req.user.user.organizerId;
		var currtime = new Date().getTime()/1000;
		db.Event.findAll({
					where: {
						organizerId: organizerId,
						startTime:{
							[Op.gt]: currtime
						}
					}
			}).then(events => {
				CurrentEvents = [];
				events.forEach(function(element,i){
					var event = element.dataValues;
					CurrentEvents[i] = {
						BarchartID: event.eventId,
						ChartData: [
	        					['Genre', 'Ελεύθερες', 'Κρατημένες', { role: 'annotation' } ],
	        					['Θέσεις', event.ticketCount, event.initialTicketCount - event.ticketCount, '']
	      					],
					ChartOptions: {
						title: "Θέσεις",
	        				legend: { position: 'top', maxLines: 3 },
	        				bar: { groupWidth: '75%' },
	        				isStacked: 'percent',
	        				backgroundColor: '#e6ecf0'
				 	}
					};
				});
				var obj = {CurrentEventsList : CurrentEvents};
				res.send(obj);
		});
	}
	else {
		res.redirect("/login");
	}

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

var express = require('express');
var router = express.Router();
var elastic = require('../apis/elastic_interface');
var geocoding = require('../apis/geocoding');
const request = require('request');

/* GET create event page. */
router.get('/', function(req, res, next) {
	var obj = {CurrentEventsList: [
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
		],
			TopicChart : {
				Data: [
          ['Task', 'Hours per Day'],
          ['Παιδότοπος',     11],
          ['Αθλήματα',      2],
          ['Κλοουν',  2],
          ['Κουκλοθέατρο', 2],
          ['Λοιπά',    7]
        ],
				Options:{
        	title: 'Θεματικές των Events'
    	}
			},
			AgesChart:{
				Data: [
					['Age','Kids per Age'],
					['3-5',15],
					['6-8',17],
					['9-12',25],
					['> 12',8]
				],
				Options: {
					title: 'Ηλικιακές κατηγορίες'
				}
			}
						};
		res.send(obj);
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

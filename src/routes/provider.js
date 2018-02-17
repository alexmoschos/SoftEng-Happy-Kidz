var express = require('express');
var router = express.Router();
var elastic = require('../apis/elastic_interface');
var geocoding = require('../apis/geocoding');
var db = require('../models/db');
const request = require('request');

/* GET create event page. */
router.get('/', function(req, res, next) {
  var ProviderInfo =  {
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
  res.render('ProviderPage', ProviderInfo);

});

/* Create a new provider */
router.post('/', function(req, res, next) {
    var event = req.body;
    console.log(event);

    res.send("You have submitted an event!");
    
});

/* Route to delete a provider */
router.delete('/:providerId', function(req, res){
	db.Organizer.findById(req.params.providerId)
	.then( (provider) => {
		if (provider) {
			return provider.destroy();
		} else {
			res.send('No such user!')
		}
	}  )
	.then( (succ) => res.redirect("/admin") );

});

module.exports = router;

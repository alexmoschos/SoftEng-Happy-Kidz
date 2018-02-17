var express = require('express');
var router = express.Router();
var db = require('../models/db');
var passport = require('../apis/passport');
var auth = require('../apis/authentication');
var bodyParser = require('body-parser');

var availMemberships = {
	low: {
		description: "Συνδρομή 3 μηνών",
		duration: 3,
		price: 15
	},
	mid: {
		description: "Συνδρομή 6 μηνών",
		duration: 6,
		price: 25
	},
	high: {
		description: "Συνδρομή 12 μηνών",
		duration: 12,
		price: 40
	}
}

router.get('/', function (req, res) {
	
	/* Retrieve item to buy */
	let userSession = req.session;
	if (userSession){
		if (userSession.cart){
			let item = userSession.cart;
			console.log(item);
			switch (item.type) {
				case 'ticket':
					res.render('payment', {description: 'Εισιτήριο ' , amount: 10});
					break;
				case 'membership':
					res.render('payment', {description: availMemberships[item.tier] , amount: availMemberships[item.tier]});
					break;
				default:
					console.log('something definitely went wrong');
					res.redirect('/');
					break;
			}
		} else {
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}
});

router.post('/events/:id', auth.isUserParent, function (req, res) {
	/* Add ticket for event to cart */
	console.log('Adding ticket to cart - session ' + req.session );
	if (req.session && (req.session.passport.user.type === 'parent')){
		req.session.cart = {
			type: 'ticket',
			eventId: req.params.id,
			quantity: req.body.quantity
		}
		console.log(req.session.cart);
	}
	else {
		res.redirect('/login');
	}
});

router.post('/membership/:id',auth.isUserParent, function (req, res) {
	/* Add ticket for event to cart */
	console.log('Adding membership to cart - session ' + req.user.type );
	if (req.session && (req.user.type === 'parent')){
		req.session.cart = {
			type: 'membership',
			tier: req.params.tier
		}
		res.redirect('/payment');
	}
	else {
		res.redirect('/login');
	}
});

module.exports = router;
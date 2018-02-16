var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
		obj = {amount: 1000}
		res.render('ticketPayment',obj);
});

router.post('/', function(req, res, next){
		//prepei na kanoume redirect analoga me to an einai user i admin
		//user-provider redirect sto / kai admin sto /admin
		console.log(req.body);
		//elegxos gia ta stoixeia tis kartas
		if (true){
			res.redirect('/successPayment');
		}
		else{
			res.redirect('/failPayment');
		}
});

module.exports = router;

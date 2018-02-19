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
	var temp = req.query.from.split("-"), temp2 = req.query.to.split("-");
	if((req.query.from === "") || (req.query.to === "")){
		res.send({});
		return;
	}
	var organizerId = req.user.user.organizerId;
	var fromdate = new Date(req.query.from).getTime()/1000, todate = new Date(req.query.to).getTime()/1000;
	console.log(fromdate);
	console.log(todate);
	db.Event.findAll({
			attributes: [
				"categoryName",
				[Sequelize.fn('COUNT',Sequelize.col("categoryName")), 'num']
			],
			where: {
				organizerId: organizerId,
				startTime:{
					[Op.lt]: todate,
					[Op.gt]: fromdate
				}
			},
			group: [
				"categoryName"
			]
		}).then(categories => {
			// console.log(categories);
			var Data = [['Task', 'Hours per Day']];
			categories.forEach(function(element,i){
				var cat = element.dataValues;
				Data[i+1] = [cat.categoryName, cat.num];
			})
			db.Event.findAll({
				attributes: [
					"minAge",
					[Sequelize.fn('COUNT',Sequelize.col("minAge")), 'num']
				],
				where: {
					organizerId: organizerId,
					startTime:{
						[Op.lt]: todate,
						[Op.gt]: fromdate
					}
				},
				group: [
					"minAge"
				]
			}).then(Ages => {
				var AgesData = [['Age','Kids per Age']];
				Ages.forEach(function(element,i){
					var age = element.dataValues;
					var agestring;
					if(age.minAge == 3)agestring = "3-5";
					else if(age.minAge == 6)agestring = "6-8";
					else if (age.minAge == 9)agestring = "9-12"
					else agestring = ">12";
					AgesData[i+1] = [agestring, age.num];
				});
				var obj = {
					TopicChart : {
						Data: Data,
						Options:{
			        		title: 'Θεματικές των Events'
			    		}
					},
					AgesChart:{
						Data: AgesData,
						Options: {
							title: 'Ηλικιακές κατηγορίες'
						}
					}
				};
				res.send(obj);

			});
		})
			
})

router.get('/bar_chart', function(req,res, next){
	var organizerId = req.user.user.organizerId;
	var currtime = new Date().getTime()/1000;
	db.Event.findAll({
		limit: 10,
		order:[
			["clickNumber", 'desc']
		],
		attributes :['clickNumber', 'title'],
		where: {
				organizerId: organizerId,
				isVerified: true,
				/*startTime:{
					[Op.gt]: currtime
				}*/
			}
	}).then(results => {
		Rows = [];
		results.forEach(function(element,i){
			var result = element.dataValues;
			Rows[i] = [result.title, result.clickNumber];
		});
		res.send({Rows:Rows});
	})

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

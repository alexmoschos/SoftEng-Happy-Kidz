var express = require('express');
var router = express.Router();
var elastic = require('../apis/elastic_interface');
var geocoding = require('../apis/geocoding');
const request = require('request');
var path = require('path');
var fs = require('fs');

/* GET create event page. */
router.get('/', function(req, res, next) {
  res.render('newevent');
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
    var files = req.files;
   /* var fields = req.fields;
    if (fields.id.length == 0)
        fields.id = '1';
    */
    var id = '12'; //here goes the id of the event
    var newdir = path.join(__dirname, '../public/files/',  id);
    if (!fs.existsSync(newdir)){
        fs.mkdirSync(newdir);
    }
    var count=0;
    for (i in files) {
        var newpath = path.join(newdir, count.toString());
        count++;
        fs.rename(files[i].path, newpath, function (err) {
            if (err) throw err;
        });
    }
    res.render('file_upload');

    res.send("You have submitted an event!");
    
});

module.exports = router;

var express = require('express');
var router = express.Router();
var elastic = require('../apis/elastic_interface');
var geocoding = require('../apis/geocoding');
const request = require('request');
var path = require('path');
var fs = require('fs');
var conf = require('../config');
var auth = require('../apis/authentication');
var db = require('../models/db');
var watermark = require('../apis/watermark/watermark.js');

var info = {};

function validNewEvent(newEvent) {

    if (newEvent.title.length == 0) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συπληρωμένα", event: newEvent};
        return false;
    }

    if (isNaN(newEvent.startTime)) {
        delete newEvent.startTime;
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συπληρωμένα",event: newEvent};
        return false;
    }

    if (newEvent.description.length == 0) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συπληρωμένα",event: newEvent};
        return false;
    }

    if (newEvent.geoAddress.length == 0) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συπληρωμένα",event: newEvent};
        return false;
    }

    if (!newEvent.categoryName) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συπληρωμένα",event: newEvent};
        return false;
    }

    if (isNaN(newEvent.ticketPrice)) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συπληρωμένα",event: newEvent};
        return false;
    }

    if (isNaN(newEvent.ticketCount)) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συπληρωμένα",event: newEvent};
        return false;
    }
    
    if (isNaN(newEvent.discount)) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συπληρωμένα",event: newEvent};
        return false;
    }

    if (newEvent.ticketPrice < 0) {
        delete newEvent.ticketPrice;
        info = {errMsg : "Η τιμή του εισιτηρίου δεν μπορεί να είναι αρνητική",event: newEvent};
        return false;
    }

    if (newEvent.ticketCount <= 0) {
        delete newEvent.ticketCount;
        info = {errMsg : "Δεν υπάρχουν διαθέσιμα εισιτήρια",event: newEvent};
        return false;
    }

    if (newEvent.discount<0 || newEvent.discount > 100) {
        delete newEvent.discount;
        info = {errMsg : "Η έκπτωση πρέπει να είναι ποσοστό επί της εκατό",event: newEvent};
        return false;
    }


    info = {event: newEvent};
    return true;
}



/* GET create event page. */
router.get('/', auth.isUserVerifiedOrganizer, function(req, res, next) {
  res.render('newevent', {categories: conf.supportedCategories, user: req.user, event: {}});
});

/* POST create event page */
router.post('/', auth.isUserVerifiedOrganizer,  function(req, res, next) {
    var body = req.fields;
    var files = req.files;

    var newEvent = {};

    newEvent.organizerId = req.user.user.organizerId;

    newEvent.title = body.EventName;
    newEvent.startTime = new Date(body.Date).getTime()/1000;
    newEvent.endTime = newEvent.startTime; // this field should probably go.
    newEvent.description = body.Description;
    newEvent.categoryName = body.categoryName;
    newEvent.geoAddress = body.location;
    newEvent.ticketPrice = parseInt(body.Price);
    newEvent.ticketCount = parseInt(body.TicketNum);
    newEvent.initialTicketCount  = newEvent.ticketCount;
    newEvent.minAge = parseInt(body.AgeGroup);
    newEvent.maxAge = newEvent.minAge + 2;
    if (newEvent.minAge === 13)
        newEvent.maxAge = 200;
    newEvent.discount  = parseInt(body.Discount);
    newEvent.pictures = parseInt(body.pictures);


    //here we have collected all necessary fields we should validate them.
    if (!validNewEvent(newEvent)) {
        info.user = req.user;
        info.categories = conf.supportedCategories;
        return res.render('newevent', info);
    }

    geocoding(newEvent.geoAddress, function(loc) {
        newEvent.geoLat = loc.lat;
        newEvent.geoLon = loc.lng;

        // at this point we can add the new Event to the database
        db.Event.create(newEvent).then(event => {
            // save uploaded images under event_eventId from 0
            if (newEvent.pictures > 0) {
                var files = req.files;

                var id = event.eventId.toString(); //here goes the id of the event
                var newdir = path.join(__dirname, '../public/files/events',  id);
                if (!fs.existsSync(newdir)){
                    fs.mkdirSync(newdir);
                }
                count=0;
                for (i in files) {
                    var newpath = path.join(newdir, count.toString());
                    count++;
                    fs.rename(files[i].path, newpath, function (err) {
                        if (err) throw err;
                    });

                    if (body.watermark)
                        watermark.addTextWatermark(newpath, newpath, 'HappyKidz').catch(err => {console.log(err);});
                }
            }

            //for now we should also add the newEvent to elasticSearch.
            newEvent.geoLocation = {
                lat: newEvent.geoLat,
                lon: newEvent.geoLon
            };
            delete newEvent.geoLat;
            delete newEvent.geoLon;

            newEvent.providerName = req.user.user.name;
            newEvent.providerPhone = req.user.user.phone;
            newEvent.eventId = event.eventId.toString();

            elastic.insert('events', newEvent, function( err, resp, status){
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("insertion to elastic completed");
                }
            });

            res.send("You have submitted an event!");

        }).catch(err => {
            console.log(err);
            res.send("There was an error please try again.", {user: req.user});
        });
    });
});

module.exports = router;

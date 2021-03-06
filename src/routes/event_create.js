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
var watermark = require('watermarkmodule');

var info = {};

function validNewEvent(newEvent) {

    if (newEvent.title.length == 0) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συμπληρωμένα", event: newEvent};
        return false;
    }

    if (isNaN(newEvent.startTime)) {
        delete newEvent.startTime;
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συμπληρωμένα",event: newEvent};
        return false;
    }

    if (newEvent.description.length == 0) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συμπληρωμένα",event: newEvent};
        return false;
    }

    if (newEvent.geoAddress.length == 0) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συμπληρωμένα",event: newEvent};
        return false;
    }

    if (!newEvent.categoryName) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συμπληρωμένα",event: newEvent};
        return false;
    }

    if (isNaN(newEvent.ticketPrice)) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συμπληρωμένα",event: newEvent};
        return false;
    }

    if (isNaN(newEvent.ticketCount)) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συμπληρωμένα",event: newEvent};
        return false;
    }

    if (isNaN(newEvent.discount)) {
        info = {errMsg : "Όλα τα πεδία πρέπει να είναι συμπληρωμένα",event: newEvent};
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

    if ((newEvent.startTime + 7200) <= (new Date().getTime() /1000)) {
        info = {errMsg : "Το event δεν μπορεί να ξεκινά σε παρελθοντικό χρόνο", event: newEvent};
        return false;
    }


    info = {event: newEvent, errMsg: undefined};
    return true;
}



/* GET create event page. */
router.get('/', auth.isUserVerifiedOrganizer, function(req, res, next) {
  res.render('newevent', {categories: conf.supportedCategories, user: req.user, event: {}, errMsg: undefined});
});

/* POST create event page */
router.post('/', auth.isUserVerifiedOrganizer,  function(req, res, next) {
    var body = req.fields;
    var files = req.files;

    var newEvent = {};

    newEvent.organizerId = req.user.user.organizerId;

    newEvent.title = body.EventName;
    newEvent.startTime = new Date(body.Date + "T" + body.Time).getTime()/1000 - 7200;
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
        if (info.event.startTime) 
            info.event.startTime +=7200;
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
                let newdir = path.join(__dirname, '../public/files/events',  id);
                if (!fs.existsSync(newdir)){
                    fs.mkdirSync(newdir);
                }
                let count=0;
                for (let i in files) {
                    let newpath = path.join(newdir, count.toString());
                    count++;
                    fs.rename(files[i].path, newpath, function(err) {
                        if (err) throw err;
                        if (body.watermark){
                            watermark.addTextWatermark(newpath, newpath, req.user.user.name).catch(err => {console.log(err);});
                        }

                    });


                }
            }

            res.redirect('/provider/' + req.user.user.organizerId);

        }).catch(err => {
            console.log(err);
            newEvent.startTime += 7200;
            res.render('newevent', {categories: conf.supportedCategories,user: req.user, errMsg : "There was an error please try again", event:newEvent});
        });
    });
});

module.exports = router;

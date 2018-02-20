var express = require('express');
var router = express.Router();
var db = require('../models/db');
const Sequelize = require('sequelize');
var auth = require('../apis/authentication');




var fs = require('fs');


router.get('/:id', function(req, res, next) {
    //console.log(req.params.id);
    if(!isNaN(req.params.id) && req.params.id == parseInt(req.params.id)){
        req.params.id = parseInt(req.params.id);
        db.Event.findById(req.params.id).then(event => {
            if( event == null ) {
                res.render('no_page');
                return;
            }
            //Increment the event clickNumber for provider statistics
            event.increment('clickNumber',{by : 1});
            db.Organizer.findById(event.organizerId).then(provider => {
                const reviews = db.Review.findAll({
                    where : {
                        eventId : req.params.id
                    }
                }).then(reviews => {
                    var ratings = [];
                    var promises = [];
                    reviews.forEach(review => {
                        promises.push( db.Parent.findById(review.parentId).then(parent => {
                            ratings.push({
                                name : parent.name,
                                content : review.text,
                                rating : review.rating
                            });
                        }));
                    });
                    Promise.all(promises).then(function() {

                        var startDate = new Date(event.startTime*1000);
                        var imglist = [];
                        path = './public/files/events/' + event.eventId + "/";
                        fs.readdir(path, function(err, items) {
                            //console.log(items);
                            if(!err){
                                for (var i=0; i<items.length; i++) {
                                    imglist.push('/files/events/' + event.eventId + '/' + items[i]);
                                }
                            }
                            if(imglist.length === 0){
                                console.log(42);
                                imglist.push('/happy.png');
                            }
                            obj = {
                                eventId : event.eventId,
                                organizerId : event.organizerId,
                                title : event.title,
                                date : startDate.toLocaleDateString(),
                                time : startDate.toLocaleTimeString(),
                                address : event.geoAddress,
                                geolon : event.geoLon,
                                geolat: event.geoLat,
                                providerName: provider.name,
                                startingPrice : (event.ticketPrice * 100 / (100 - event.discount)).toFixed(2),
                                finalPrice: event.ticketPrice.toFixed(2),
                                phone: provider.phone,
                                agegroups: event.minAge + "-" + (event.minAge + 2).toString(),
                                description: event.description,
                                ticketCount : event.ticketCount,
                                images: imglist,
                                ratings,
                                user : req.user
                            };
                            res.render('events',obj);
                        });

                    });
                });
            });
        });
    } else {
        console.log(42);
        res.render('no_page');
    }
});

/* Route to delete an event */

//edw thelei elastic kai sto delete kai sto put
router.delete('/:eventId', auth.isUserAdmin, function(req, res){
    eventId = utilities.checkInt(req.params.providerId);
    if (!eventId) { res.render('no_page', {user: req.user});}

    db.Event.findById(eventId)
    .then( (event) => {
        if (event && event.isVerified === false) {
            return event.destroy();
        } else {
            res.render('no_page', {user: req.user});
        }
    }).then( (succ) =>
    res.redirect("/admin")
    );

});

/* Route to approve an event */

//edw thelei elastic kai sto delete kai sto put


router.put('/:eventId', auth.isUserAdmin, function(req, res){

    eventId = utilities.checkInt(req.params.providerId);
    if (!eventId) { res.render('no_page', {user: req.user});}

    db.Event.findById(req.params.eventId)
    .then( (event) => {
        if (event && event.isVerified === false) {
            return event.update({isVerified: true});
        }
        else {
            res.render('no_page', {user: req.user});

        }
    })
    .then ( (succ) => res.redirect("/admin"));

});

module.exports = router;

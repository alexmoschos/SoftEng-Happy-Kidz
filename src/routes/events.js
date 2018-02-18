var express = require('express');
var router = express.Router();
var db = require('../models/db');

var ratings= [
    {name: "John", content:"It sucks", rating:2},
    {name: "John", content:"It sucks", rating:3},
    {name: "John", content:"It sucks", rating:5},
    {name: "John", content:"It sucks", rating:4},
    {name: "John", content:"It sucks", rating:0},
    {name: "John", content:"It sucks", rating:1},
]

router.get('/:id', function(req, res, next) {
    obj={
        title: "Alex Kalom",
        date: "14/12/1999",
        time: "14:49",
        address: "Iroon Polutexneiou 1 Athens",
        geolon: 23.7349,
        geolat: 37.9755,
        providerName: "Kostis Sagonas",
        startingPrice : "42",
        finalPrice: "24",
        phone: "6982532427086",
        agegroups:"16-21",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt eius ut, quod consectetur laboriosam incidunt Ipsa iure, voluptate ipsam molestiae obcaecati quis fugit? Quae distinctio asperiores iusto voluptatumvoluptatibus aliquam Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt eius ut, quod consectetur laboriosam incidunt?",
        images: ["https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg","url2","url3"],
        ratings
    }
    res.render('events',obj);
});

/* Route to delete an event */

//edw thelei elastic kai sto delete kai sto put
router.delete('/:eventId', function(req, res){
    db.Event.findById(req.params.eventId)
    .then( (event) => {
        if (event && event.isVerified === false) {
            return event.destroy();
        } else {
            res.send('No such event!')
        }
    }  )
    .then( (succ) => res.redirect("/admin") );

});

/* Route to approve an event */

//edw thelei elastic kai sto delete kai sto put


router.put('/:eventId', function(req, res){

    db.Event.findById(req.params.eventId)
    .then( (event) => {
        if (event && event.isVerified === false) {
            return event.update({isVerified: true});
        }  
        else {
            res.send('No such event!')
        }
    })
    .then ( (succ) => res.redirect("/admin")); 

});

module.exports = router;

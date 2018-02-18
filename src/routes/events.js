var express = require('express');
var router = express.Router();
var db = require('../models/db');
const Sequelize = require('sequelize');
// var ratings= [
//     {name: "John", content:"It sucks", rating:2},
//     {name: "John", content:"It sucks", rating:3},
//     {name: "John", content:"It sucks", rating:5},
//     {name: "John", content:"It sucks", rating:4},
//     {name: "John", content:"It sucks", rating:0},
//     {name: "John", content:"It sucks", rating:1},
// ]


router.get('/:id', function(req, res, next) {
    console.log(req.params.id);
    db.Event.findAll({
        where: {
            eventId:  parseInt(req.params.id)
        }
    }).then(events => {
        //console.log(events);
        var event = events[0];
        db.Organizer.findAll({
            where : {
                organizerId : parseInt(event.organizerId)
            }
        }).then(providers => {
            var provider = providers[0];
            const reviews = db.Review.findAll({
                where : {
                    eventId : parseInt(req.params.id)
                }
            }).then(reviews => {
                console.log("I have entered");
                console.log(reviews);
                var ratings = [];
                reviews.forEach(review => {
                    ratings.push({
                        name : "John",
                        content : review.text,
                        rating : review.rating
                    })
                });
                var startDate = new Date(event.startTime*1000);
                obj = {
                    title : event.title,
                    date : startDate.toLocaleDateString(),
                    time : startDate.toLocaleTimeString(),
                    address : event.geoAddress,
                    geolon : event.geoLon,
                    geolat: event.geoLat,
                    providerName: provider.name,
                    startingPrice : event.ticketPrice * 100 / (100 - event.discount),
                    finalPrice: event.ticketPrice,
                    phone: provider.phone,
                    agegroups:"16-21",
                    description: event.description,
                    images: ["https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"],
                    ratings
                }
                console.log(obj);
                res.render('events',obj);
            });



        })
    });
    console.log("Something went wrong");
    // obj={
    //     title: "Alex Kalom",
    //     date: "14/12/1999",
    //     time: "14:49",
    //     address: "Iroon Polutexneiou 1 Athens",
    //     geolon: 23.7349,
    //     geolat: 37.9755,
    //     providerName: "Kostis Sagonas",
    //     startingPrice : "42",
    //     finalPrice: "24",
    //     phone: "6982532427086",
    //     agegroups:"16-21",
    //     description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt eius ut, quod consectetur laboriosam incidunt Ipsa iure, voluptate ipsam molestiae obcaecati quis fugit? Quae distinctio asperiores iusto voluptatumvoluptatibus aliquam Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt eius ut, quod consectetur laboriosam incidunt?",
    //     images: ["https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg","url2","url3"],
    //     ratings
    // }
    //res.render('events',obj);
});

module.exports = router;

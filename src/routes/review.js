var express = require('express');
var router = express.Router();
var db = require('../models/db');
var auth = require('../apis/authentication');

router.post("/:eventId/:parentId", auth.isUserParentIdAndBoughtTicket, function(req, res, next){
    // console.log(req.body);
    db.Review.findOne({
        where: {
            parentId: req.params.parentId,
            eventId: req.params.eventId
        }
    })
    .then( review => {
        var newReview = {
            parentId: req.params.parentId,
            eventId: req.params.eventId,
            text: req.body.description,
            rating: req.body.rating,
        };
        if(!review){
            db.Review.create(newReview).then( review2 => {
                res.redirect('/events/' + req.params.eventId);
            }) 
        }
        else{
            review.update(newReview).then( review3 => {
                res.redirect('/events/' + req.params.eventId);
            })
        }
    })   
});

router.get('/:eventId/:parentId', auth.isUserParentIdAndBoughtTicket, function(req, res, next) {
    db.Parent.findById(req.params.parentId)
	.then( (parent) => {
        db.Event.findById(req.params.eventId)
        .then( (event) => {
            db.Review.findOne({
                where: {
                    parentId: req.params.parentId,
                    eventId: req.params.eventId
                }
            })
            .then( review => {
                var descr = "";
                if(review){
                    descr = review.text;
                }
                obj={
                    user: req.user,
                    eventId: req.params.eventId,
                    parentId: parent.parentId,
                    name: parent.name,
                    email: parent.email,
                    title: event.title,
                    prevDescription: descr
                };
                res.render('review',obj);
            })
            
        })
    })
});

module.exports = router;

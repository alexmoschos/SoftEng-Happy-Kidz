var express = require('express');
var router = express.Router();
var db = require('../models/db');
var auth = require('../apis/authentication');

router.post("/:eventId/:parentId", auth.isUserParentIdAndBoughtTicket, function(req, res, next){
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
            date: Math.floor(Date.now() / 1000)
        };
        console.log(newReview.date);
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
        if(parent){
            db.Event.findById(req.params.eventId)
            .then( (event) => {
                if (event){
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
                }
                else {
                    res.render('no_page',{user: req.user});
                }
            })
        }
        else {
            res.render('no_page',{user: req.user});
        }

        
    })
});

module.exports = router;

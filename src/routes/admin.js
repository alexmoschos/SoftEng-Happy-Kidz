var express = require('express');
var router = express.Router();
var db = require('../models/db');
var mail = require('../apis/mail');


router.get('/', function(req, res, next) {
    


    db.Parent.findAll()
    .then( (parents) => parents.forEach( (parent) => console.log(parent.name) )
    );

    var promise1 = db.Parent.findAll();
    var promise2 = db.Organizer.findAll();
    var promise3 = db.Event.findAll({
        where: {
            isVerified: false
        }
    });
    /* test gia na doume an itan swsto to accept */
    //var promise3 = db.Event.findAll();

    var obj;

    Promise.all([promise1,promise2,promise3])
    .then( (values) => {
            obj = { user: values[0], provider: values[1], event: values[2]};
            res.render('admin',obj);
    });

});

// ******************** Reset passwords, isws meta mpei san put sto antistoixo object //
router.put('/parent/:parentId/reset', function(req, res, next) {

    db.Parent.findById(req.params.parentId)
    .then( (parent) =>{
        if (parent) {
            console.log(parent.name + " password reset");
            //edw prepei na kanoume reset kai na steiloume mail
            res.redirect("/admin");
        }
        else {
            res.send("no such parent!");
        }

    });
});

router.put('/provider/:providerId/reset', function(req, res, next) {

    db.Organizer.findById(req.params.providerId)
    .then( (provider) =>{
        if (provider) {
            console.log(provider.name + " password reset");
            //edw prepei na kanoume reset kai na steiloume mail
            res.redirect("/admin");

        }
        else {
            res.send("no such provider!");
        }

    });
});


// ******************** View Events, Providers //


router.get('/events/:eventId', function(req, res, next) {

    db.Event.findById(req.params.eventId)
    .then( (event) => {
        if (event) {
            db.Organizer.findById(event.organizerId)
            .then( (provider) => {
                if (event && event.isVerified === false) {
                    console.log(event.name + " found event");
                    event.provider = provider;
                    console.log(event);
                    obj = event;
                    res.render("adminEvent", {obj});
                    //res.redirect('/admin');
                }
                else {
                    res.send("no such event!");
                }
            });
        }
        else {
            res.send("no such event!");
        }
    });
});

router.get('/provider/:providerId', function(req, res, next) {

    db.Organizer.findById(id)
    .then( (provider) => {
        if (provider) {
            console.log(provider.name + " found provider");
            res.render("adminProvider", provider);
        }
        else {
            res.send("no such provider!");
        }

    });
});



module.exports = router;

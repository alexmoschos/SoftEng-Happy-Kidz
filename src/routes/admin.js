var express = require('express');
var router = express.Router();
var db = require('../models/db');
var mail = require('../apis/mail');
var auth = require('../apis/authentication');
var bcrypt = require('bcrypt');
var utilities = require('../apis/utilities');
var auth = require('../apis/authentication');

router.get('/', auth.isUserAdmin, function(req, res) {

    db.Parent.findAll().then(
        (parents) => parents.forEach((parent) => console.log(parent.name)));

    var promise1 = db.Parent.findAll();
    var promise2 = db.Organizer.findAll();
    var promise3 = db.Event.findAll({where : {isVerified : false}});
    /* test gia na doume an itan swsto to accept */
    // var promise3 = db.Event.findAll();

    var obj;

    Promise.all([ promise1, promise2, promise3 ]).then((values) => {
        obj = {
            parent : values[0],
            provider : values[1],
            event : values[2],
            user : req.user
        };
        res.render('admin', obj);
    });

});

// ******************** Reset passwords, isws meta mpei san put sto antistoixo
// object //
router.put('/parent/:parentId/reset', auth.isUserAdmin, function(req, res) {

    var parentId = utilities.checkInt(req.params.parentId);
    if (!parentId) {
        res.render('no_page', {user : req.user});
    }

    db.Parent.findById(parentId).then((parent) => {
        if (parent) {
            console.log(parent.name + " password reset");
            // edw prepei na kanoume reset kai na steiloume mail
            var newPassword = utilities.makeid(12);
            var update =
                parent.update({password : bcrypt.hashSync(newPassword, 10)});
            update.then((succ) => {
                // stelnoume mail
                if (succ) {
                    var finalRes = mail.sendTextEmail(
                        'Αλλαγή Κωδικού', parent.email,
                        'Ο νέος σας κωδικός είναι: ' + newPassword);
                    finalRes.then((succ1) => {
                        if (succ1) {
                            res.redirect('/admin');
                        } else {
                            console.log('problem in mail');
                            res.redirect('/failReset');
                        }

                    });
                } else {
                    console.log('problem in table update');
                    res.redirect('/failReset');
                }

            });

            // res.redirect("/admin");
        } else {
            res.render('no_page', {user : req.user});
        }

    });
});

router.put('/provider/:providerId/reset', auth.isUserAdmin, function(req, res) {

    var providerId = utilities.checkInt(req.params.providerId);
    if (!providerId) {
        res.render('no_page', {user : req.user});
    }

    db.Organizer.findById(providerId).then((provider) => {
        if (provider) {
            console.log(provider.name + " password reset");
            var newPassword = utilities.makeid(12);
            var update =
                provider.update({password : bcrypt.hashSync(newPassword, 10)});
            update.then((succ) => {
                // stelnoume mail
                if (succ) {
                    var finalRes = mail.sendTextEmail(
                        'Αλλαγή Κωδικού', provider.email,
                        'Ο νέος σας κωδικός είναι: ' + newPassword);
                    finalRes.then((succ1) => {
                        if (succ1) {
                            res.redirect('/admin');
                        } else {
                            console.log('error in mail');
                            res.redirect('/failReset');
                        }

                    });
                } else {
                    console.log('fail in update');
                    res.redirect('/failReset');
                }

            });

        } else {
            res.render('no_page', {user : req.user});
        }

    });
});

// ******************** View Events, Providers //

router.get('/events/:eventId', auth.isUserAdmin, function(req, res) {

    var eventId = utilities.checkInt(req.params.eventId);
    if (!eventId) {
        res.render('no_page', {user : req.user});
    }

    db.Event.findById(eventId).then((event) => {
        if (event) {
            organizerId = utilities.checkInt(event.organizerId);
            if (!organizerId) {
                res.render('no_page', {user : req.user});
            }

            db.Organizer.findById(organizerId).then((provider) => {
                if (event && event.isVerified === false) {
                    console.log(event.name + " found event");
                    event.provider = provider;
                    console.log(event);
                    var imglist = [];
                    path = './public/files/events/' + event.eventId + "/";
                    fs.readdir(path, function(err, items) {
                        // console.log(items);
                        if (!err) {
                            for (var i = 0; i < items.length; i++) {
                                imglist.push('/files/events/' + event.eventId +
                                             '/' + items[i]);
                            }
                        }
                        if (imglist.length === 0) {
                            imglist.push('/happy.png');
                        }
                        obj = event;
                        res.render("adminEvent", {obj, user : req.user, images: imglist});
                        // res.redirect('/admin');
                    });
                }
                else {
                    res.render('no_page', {user : req.user});
                }
            });
        } else {
            res.render('no_page', {user : req.user});
        }
    });
});

router.get('/provider/:providerId', auth.isUserAdmin, function(req, res) {

    var providerId = utilities.checkInt(req.params.providerId);
    if (!providerId) {
        res.render('no_page', {user : req.user});
    }

    db.Organizer.findById(providerId).then((provider) => {
        if (provider) {
            console.log(provider.name + " found provider");
            provider.user = req.user;
            res.render("adminProvider", provider);
        } else {
            res.render('no_page', {user : req.user});
        }

    });
});

module.exports = router;
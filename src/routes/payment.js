var express = require('express');
var router = express.Router();
var db = require('../models/db');
var passport = require('../apis/passport');
var auth = require('../apis/authentication');
var bodyParser = require('body-parser');

var availMemberships = [{
        description: "Συνδρομή 3 μηνών",
        duration: 3,
        amount: 15
    },
    {
        description: "Συνδρομή 6 μηνών",
        duration: 6,
        amount: 25
    },
    {
        description: "Συνδρομή 12 μηνών",
        duration: 12,
        amount: 40
    }
]

router.get('/', auth.isUserParent, function(req, res) {

    /* Retrieve item to buy */
    let userSession = req.session;
    if (userSession.cart) {
        let item = userSession.cart;
        console.log(item);
        switch (item.type) {
            case 'ticket':
                db.Event.findById(item.eventId)
                    .then((event) => res.render('payment', { description: tier.quantity + 'x Εισιτήριο για ' + event.title, amount: event.ticketPrice }));
                break;
            case 'membership':
                res.render('payment', { description: availMemberships[item.tier - 1].description, amount: availMemberships[item.tier - 1].amount });
                break;
            default:
                console.log('something definitely went wrong');
                res.redirect('/');
                break;
        }
    } else {
        res.redirect('/');
    }
});

router.post('/', auth.isUserParent, function(req, res) {
    if (userSession.cart) {
        let item = userSession.cart;
        console.log(item);
        switch (item.type) {
            case 'ticket':
                // Ticket transaction
                db.sequelizeConnection.transaction(function(t) {

                    // chain all your queries here. make sure you return them.
                    return User.create({
                        firstName: 'Abraham',
                        lastName: 'Lincoln'
                    }, { transaction: t }).then(function(user) {
                        return user.setShooter({
                            firstName: 'John',
                            lastName: 'Boothe'
                        }, { transaction: t });
                    });

                }).then(function(result) {
                    // Transaction has been committed
                    // result is whatever the result of the promise chain returned to the transaction callback
                }).catch(function(err) {
                    // Transaction has been rolled back
                    // err is whatever rejected the promise chain returned to the transaction callback
                });

                break;
            case 'membership':
                db.Membership.create({
                    parentId: req.user.id,
                    startDate: Math.floor(Date.now() / 1000),
                    expiryDate: Math.floor(Date.now() / 1000 + 60 * 60 * 24 * 10 * availMemberships[item.tier].duration),
                    membershipTier: item.tier,
                    maxTicketsPerEvent: 100
                })
                break;
            default:
                console.log('something definitely went wrong');
                res.redirect('/');
                break;
        }
    } else {
        res.redirect('/');
    }
})

router.post('/events/:id', auth.isUserParent, function(req, res) {
    /* Add ticket for event to cart */
    console.log('Adding ticket to cart - session ' + req.user.type);
    req.session.cart = {
        type: 'ticket',
        eventId: req.params.id,
        quantity: req.body.quantity
    }
    res.redirect('/payment');
});

router.post('/membership/:id', auth.isUserParent, function(req, res) {
    /* Add ticket for event to cart */
    console.log('Adding membership to cart - session ' + req.user.type);
    req.session.cart = {
        type: 'membership',
        tier: req.params.id
    }
    res.redirect('/payment');
});

module.exports = router;
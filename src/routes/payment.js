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
}]

// Utility function to check if membership is valid
function isMembershipValid(membership) {
    if (membership && (membership.endTime < Math.floor(Date.now()))) {
        return true;
    } else {
        return false;
    }
}

// GET Route for payment form (common for memberships and tickets)
router.get('/', auth.isUserParent, function (req, res) {

    /* Retrieve item to buy */
    let userSession = req.session;
    if (userSession.cart) {
        let item = userSession.cart;
        console.log(item);
        switch (item.type) {
            case 'ticket':
                db.Event.findById(item.eventId)
                    .then((event) => res.render('payment', { description: tier.quantity + 'x Εισιτήριο για ' + event.title, amount: event.ticketPrice, quantity: tier.quantity }));
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

// Payment forms should post here
router.post('/', auth.isUserParent, function (req, res) {
    /* Retrieve item to buy */
    let userSession = req.session;
    if (userSession.cart) {
        let item = userSession.cart;
        console.log(item);
        switch (item.type) {
            case 'ticket':
                // Check if parent has a valid membership
                db.Membership.findOne({ parentId: userSession.passport.user.id })
                    .then((membership) => {
                        if (!isMembershipValid(membership)) {
                            res.redirect('/membership');
                        } else {
                            db.sequelizeConnection.transaction(function (t) {
                                // Chain all transaction queries
                                return db.Event.findById(item.eventId, { transaction: t })
                                    .then((event) => {
                                        console.log('Event found: ' + event);
                                        let newTicketCount = event.ticketCount - item.quantity;
                                        if (newTicketCount >= 0) {
                                            return event.update({ ticketCount: newTicketCount }, { transaction: t })
                                        } else {
                                            throw new Error("Not enough tickets");
                                        }
                                    })
                                    .then((event) => db.BoughtTickets.create({
                                        eventId: event.eventId,
                                        parentId: userSession.passport.user.id,
                                        transactionId: '54541',
                                        startTime: event.startTime,
                                        endTime: event.endTime,
                                        price: event.ticketPrice
                                    }, { transaction: t }))
                                    .then((ticket) => db.Parent.findById(userSession.passport.user.id, { transaction: t }))
                                    .then((parent) => parent.update({ wallet: parent.wallet + item.quantity * 100 }, { transaction: t }))
                            })
                            .then((result) => { 
                                console.log('Successful transaction '+ result);
                                res.redirect('/payment/success');
                            })
                            .catch((err) => {
                                console.log('Unsuccessful transaction ' + err);
                                res.send('Not enough tickets')
                            });
                        }
                    })

                break;
            case 'membership':
                console.log('Creating new membership' + JSON.stringify(userSession.passport.user));
                db.Membership.create({
                    parentId: userSession.passport.user.id,
                    startDate: Math.floor(Date.now() / 1000),
                    expiryDate: Math.floor(Date.now() / 1000 + 60 * 60 * 24 * 10 * availMemberships[item.tier].duration),
                    membershipTier: item.tier,
                    maxTicketsPerEvent: 100
                });
                res.redirect('/payment/success');
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

// Ticket purchase forms on event page should post here
router.post('/events/:id', auth.isUserParent, function (req, res) {
    /* Add ticket for event to cart */
    console.log('Adding ticket to cart - session ' + req.user.type);
    // Check if parent has a valid membership
    db.Membership.findOne({ parentId: req.session.passport.user.id })
    .then((membership) => {
        if (!isMembershipValid(membership)) {
            res.redirect('/membership');
        } else {
            req.session.cart = {
                type: 'ticket',
                eventId: req.params.id,
                quantity: req.body.quantity
            }
            res.redirect('/payment');
        }
    });
});

// Membership purchase forms should post here
router.post('/membership/:id', auth.isUserParent, function (req, res) {
    /* Add ticket for event to cart */
    console.log('Adding membership to cart - session ' + req.user);
    // Check if parent already has a valid membership
    db.Membership.findById(req.session.passport.user.id)
    .then((membership) => {
        if (!isMembershipValid(membership)) {
            req.session.cart = {
                type: 'membership',
                tier: req.params.id
            }
            res.redirect('/payment');
        } else {
            res.redirect('/');
        }
    });
});

router.get('/success', function(req, res){
    res.render('successPayment', {user: req.user});
});

module.exports = router;
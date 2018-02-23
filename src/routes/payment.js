var express = require('express');
var router = express.Router();
var db = require('../models/db');
var passport = require('../apis/passport');
var auth = require('../apis/authentication');
var bodyParser = require('body-parser');
var configFile = require('../config');
var utils = require('../apis/utilities');
var qr = require('../apis/qr');
var pdf = require('../apis/pdf_generator');
var mail = require('../apis/mail');



var availableMemberships = configFile.availableMemberships;

// Utility function to check if membership is valid
function isMembershipValid(membership) {
    if (membership && (membership.expiryDate < Math.floor(Date.now()))) {
        return true;
    } else {
        return false;
    }
}

// Create qrcode-pdf and send email
function mailTickets(parentId, eventId) {
    // Find all tickets for that event
    db.BoughtTickets.findAll({
        where: {
            parentId: parentId
        }
    }).then((tickets) => {
        // Create QR Code
        let ticketIds = [];
        for (let i = 0; i < tickets.length; i++) {
            ticketIds.push(tickets[i].ticketId);
        }
        // let pdfFilename = path.resolve('./') + "/public/files/tickets/pdf/" + ticketIds[0];
        qr.createQRCode(ticketIds)
            .then((qrCodePath) => {
                console.log("Getting ticket event");
                tickets[0].getEvent()
                    .then((event) => {
                        // Create PDF with QRCode
                        console.log("Creating pdf");
                        let eventImage = "public/files/events/default.png";
                        if (event.pictures > 0) {
                            eventImage = "public/files/events/" + event.eventId + "/" + "0";
                        }
                        let opt = {
                            filename: "public/files/tickets/pdf/" + ticketIds[0] + '.pdf',
                            title: event.title,
                            type: 'ticket',
                            date_and_time: event.startTime,
                            address: event.geoAddress,
                            number_of_tickets: tickets.length,
                            event_img_src: eventImage,
                            qr_code_src: qrCodePath
                        };
                        pdf.save_pdf(opt)
                            .then((pdfPath) => {
                                tickets[0].getParent()
                                    .then((parent) => mail.sendPdfEmail('[Happy Kidz] Αγορά Εισητηρίων για το event: ' + event.title, parent.email, '', pdfPath))
                                    .then((success) => { return; })
                                    .catch((err) => console.log(err));
                            });
                    });

            });
    });
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
                    .then((event) => res.render('payment/index', { description: item.quantity + 'x Εισιτήριο για ' + event.title, amount: event.ticketPrice, quantity: item.quantity }));
                break;
            case 'membership':
                if (availableMemberships[item.tier - 1]) {
                    res.render('payment/index', { description: availableMemberships[item.tier - 1].description, amount: availableMemberships[item.tier - 1].amount });
                }
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
    // Retrieve item to buy 
    let userSession = req.session;
    if (userSession.cart) {
        let item = userSession.cart;
        console.log(item);
        switch (item.type) {
            case 'ticket':
                // Check if parent has a valid membership
                db.Membership.findById(userSession.passport.user.id)
                    .then((membership) => {
                        if (!isMembershipValid(membership)) {
                            console.log("Not a valid membership");
                            req.flash('error', 'Δεν έχετε συνδρομή είτε η συνδρομή σας έχει λήξει.');
                            res.redirect('/membership');
                        } else {
                            db.sequelizeConnection.transaction(function (t) {
                                // Transaction to purchase tickets for an event
                                return db.Event.findById(item.eventId, { transaction: t })
                                    // Remove wanted tickets from event
                                    .then((event) => {
                                        console.log('Event found: ' + JSON.stringify(event));
                                        let newTicketCount = event.ticketCount - item.quantity;
                                        if (newTicketCount >= 0) {
                                            return event.update({ ticketCount: newTicketCount }, { transaction: t });
                                        } else {
                                            req.flash('error', 'Δεν υπάρχουν όσα εισητήρια ζητήσατε !');
                                            req.redirect('back');
                                            throw new Error("Not enough tickets");
                                        }
                                    })
                                    // Create the bought tickets
                                    .then((event) => {
                                        let ticketItem = {
                                            eventId: event.eventId,
                                            parentId: userSession.passport.user.id,
                                            transactionId: '54541',
                                            startTime: event.startTime,
                                            endTime: event.endTime,
                                            price: event.ticketPrice
                                        };
                                        let ticketArray = [];
                                        for (let i = 0; i < item.quantity; i++) {
                                            ticketArray.push(ticketItem);
                                        }
                                        db.BoughtTickets.bulkCreate(ticketArray, { transaction: t });
                                    })
                                    .then((tickets) => {
                                        // Find parent and update wallet
                                        console.log('Finding parent');
                                        return db.Parent.findById(userSession.passport.user.id, { transaction: t });
                                    })
                                    .then((parent) => { return parent.update({ wallet: parent.wallet + item.quantity * 100 }, { transaction: t }); });
                            })
                                .then((result) => {
                                    console.log('Successful transaction ' + result);
                                    // Generate QRCode -> PDF -> Send Email
                                    mailTickets(userSession.passport.user.id, item.eventId);
                                    res.redirect('/payment/success');
                                })
                                .catch((err) => {
                                    console.log('Unsuccessful transaction ' + err);
                                });
                        }
                    });

                break;
            case 'membership':
                console.log('Creating new membership' + JSON.stringify(userSession.passport.user));
                // Insert new or update existing membership
                db.Membership.upsert({
                    parentId: userSession.passport.user.id,
                    startDate: Math.floor(Date.now() / 1000),
                    expiryDate: Math.floor(Date.now() / 1000 + 60 * 60 * 24 * 10 * availableMemberships[item.tier].duration),
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
    // Check if id is a valid integer
    if (!utils.checkInt(req.params.id)) {
        req.status(404).render('no_page');
        return;
    }
    // Check if parent has a valid membership
    db.Membership.findById(req.session.passport.user.id)
        .then((membership) => {
            if (!isMembershipValid(membership)) {
                req.flash('error', 'Δεν έχετε συνδρομή είτε η συνδρομή σας έχει λήξει.');
                res.redirect('/membership');
            } else {
                req.session.cart = {
                    type: 'ticket',
                    eventId: req.params.id,
                    quantity: req.body.quantity
                };
                res.redirect('/payment');
            }
        });
});

// Membership purchase forms should post here
router.post('/membership/:id', auth.isUserParent, function (req, res) {
    // Add ticket for event to cart
    console.log('Adding membership to cart - session ' + req.user);
    // Check if id is a valid integer
    if (!utils.checkInt(req.params.id)) {
        req.status(404).render('no_page');
        return;
    }
    // Check if membership id is valid
    if (!availableMemberships[req.params.id - 1]) {
        res.status(404).render('no_page');
        return;
    }
    // Check if parent already has a valid membership
    db.Membership.findById(req.session.passport.user.id)
        .then((membership) => {
            if (!isMembershipValid(membership)) {
                req.session.cart = {
                    type: 'membership',
                    tier: req.params.id
                };
                res.redirect('/payment');
            } else {
                req.flash('error', 'Έχετε ήδη συνδρομή');
                res.redirect('/');
            }
        });
});

router.get('/success', function (req, res) {
    res.render('payment/success', { user: req.user });
});

module.exports = router;
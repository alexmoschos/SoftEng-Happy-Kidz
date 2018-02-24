var express = require('express');
var router = express.Router();
var pdf = require('../apis/pdf_generator');

router.get('/', function(req, res, next) {
    // if we decide to send back a pdf we can generate it like so
    // we focus here on generating tickets.

    options = {
        filename: "untitled.pdf", 
        type: 'ticket', 
        title:'Redhood',
        date_and_time: 'Δευτέρα 13/05/2018 16:30',
        ticket_id: 04464053,
        number_of_tickets: 3,
        address: 'Αριστοτέλους 23, Πυλαία, Θεσσαλονίκη',
        event_img_src: 'public/files/redhood.jpg'
    };

    pdf.send_pdf(res,options); 
});

module.exports = router;

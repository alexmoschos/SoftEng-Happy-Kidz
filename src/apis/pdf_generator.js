PDFDocument = require('pdfkit');
fs = require('fs');


function build_ticket(doc, options) {
    // add logo
    doc.image('public/logo.png', (doc.page.width - 350)/2, 0, {width: 350});

    // add qrcode
    //TODO: change this to be dynamic
    doc.image(options.qr_code_src, 0, 150, {width: 150});

    //add event title
    doc.fontSize(18);
    doc.font('public/font-bold.ttf');
    doc.text(options.title, (170 + 150)/2, 150, {width: doc.page.width - 170, align:'center'});
    

    //add ticket and event info
    doc.fontSize(11);
    doc.text('κωδικός εισιτηρίου: ' + options.ticket_id, (170 + 150)/2, 180, {width: doc.page.width - 170, align:'right'});

    doc.font('public/font-regular.ttf');
    doc.text('Ημερομηνία: ' + options.date_and_time, (170 + 150)/2, 210, {width: doc.page.width - 170, align:'left'});
    doc.text('Διεύθυνση: ' + options.address, (170 + 150)/2, 230, {width: doc.page.width - 170, align:'left'});
    doc.text('Θέσεις: ' + options.number_of_tickets, (170 + 150)/2, 250, {width: doc.page.width - 170, align:'left'});

    //add event image
    doc.image(options.event_img_src, (doc.page.width - 400)/2 ,350, {width: 400});
}


function send_pdf(res, options) {
    doc = new PDFDocument;

    // Set some headers
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Header to force download
    res.setHeader('Content-disposition', 'inline; filename=' + options.filename);

    switch (options.type) {
        case 'ticket': 
            build_ticket(doc, options);
            break;
        default:
            break; // empty pdf
    }

    doc.pipe(res);
    doc.end();   
}

function save_pdf(options) {
    doc = new PDFDocument;

    build_ticket(doc, options);
    doc.pipe(fs.createWriteStream(options.filename));
    doc.end();
}

pdf = {
    send_pdf: send_pdf,
    save_pdf: save_pdf
};


module.exports = pdf;
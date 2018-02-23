var pdf = require('./pdf_generator');

var options = {
    filename: 'untitled.pdf',
    ticketId: 1,
    number_of_tickets: 2,
    date_and_time: 'May 2018',
    address: 'sfjdfk',
    title: 'title',
    type: 'ticket',
    event_img_src: 'public/happy.png',
    qr_code_src: 'public/qrcode.png'
};

pdf.save_pdf(options);
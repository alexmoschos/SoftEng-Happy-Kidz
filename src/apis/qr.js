var qrcode = require('qrcode');
var path = require('path');

var options = {
    type: 'png',
    width: 400,
    color: {
        dark: '#4c89d4ff'
    }
};

// Input: A String Array (Ticket UUIDs)
// Output: Promise<String>, String Array of the absolute path of the QR-Code Image
function createQRCode(tickets) {

    return new Promise((resolve, reject) => {
        let qrString = tickets.join('-');
        let savePath = path.resolve('./') + '/public/files/tickets/qrcode/' + qrString + '.png';
        qrcode.toFile(savePath, qrString, options)
        .then((ticketPath) => resolve(ticketPath))
        .catch((err) => reject(err));
        
    });
}

// Input: Array of String (Ticket UUIDs)
// Output: Promise<Array<String>>, String Array of the absolute paths of the QR-Code Images
function createQRCodes(tickets) {
    let promiseArray = [];
    let ticketPaths = [];
    return new Promise((resolve, reject) => {
        for (let t of tickets) {
            // Create a QR-Code object
            let savePath = path.resolve('./') + '/public/files/tickets/qrcode/' + t + '.png';
            promiseArray.push(qrcode.toFile(savePath, t, options));
            ticketPaths.push(savePath);
        }
        Promise.all(promiseArray)
            .then((values) => resolve(ticketPaths))
            .catch((err) => reject(err));
    });
}

module.exports = { 
    createQRCode: createQRCode,
    createQRCodes: createQRCodes };
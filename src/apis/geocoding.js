var request = require('request');

function geocoding(address, callback) {
    var option = { 
        uri: 'https://maps.googleapis.com/maps/api/geocode/json',
        qs :{
            address: address,
            key: 'AIzaSyAhLwNphhX38RVLO9KBW9C2vdGM5LNYjwk'
        }
    };

    request(option, (err,resp,body) => {
        if (err) { return console.log(err); }
        var loc = JSON.parse(body).results[0].geometry.location;
        callback(loc);
    });
}

module.exports = geocoding;


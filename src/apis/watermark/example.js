// Require watermark module
var watermark = require('./watermark');
var path = require('path');

console.log(watermark);

// Params: Source Image Path, Destination Image Path
let test = watermark.addTextWatermark(__dirname + '/test-image.jpg', __dirname + '/output.png')
// On success return the path of the new image
test.then((dstdir) => console.log(dstdir))
// On fail log the error
    .catch((err) => console.log(err));
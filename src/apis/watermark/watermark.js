const gm = require('gm');
const imageMagick = gm.subClass({ imageMagick: true });
const path = require('path');


// Path to watermark
var watermarkPath = __dirname + '/watermark.png';
// Scale factor determines how big the watermark will be ( values: [0,1] )
var scaleFactor = 0.9;
// Aspect ratio of the watermark used
var watermarkAspectRatio = 16 / 9;
// Calculate watermark size

function applyWatermark(sourcePath, destinationPath) {
    return new Promise((resolve, reject) => {
        imageMagick(sourcePath).size(function(err, value) {
            if (err) {
                reject(err);
            } else if (value === undefined) {
                reject(err);
            } else {
                let watermarkSize = {
                    width: Math.ceil(value.width * scaleFactor),
                    height: Math.ceil(value.width * scaleFactor / watermarkAspectRatio)
                };
                // Apply watermark
                imageMagick(sourcePath)
                    // WATERMARK - PARAM ORDER: [X Pos, Y Pos, width, height]
                    .draw(['gravity South image Over 0,0 ' + watermarkSize.width + ', ' + watermarkSize.height + ' "' + watermarkPath + '"'])
                    // RESIZE DIMENSIONS - PARAM ORDER: [width, height]
                    .resize(value.width, value.height, null)
                    .write(destinationPath, function(err, stdout, stderr, command) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(destinationPath);
                        }
                    });
            }
        })
    })

};

function addTextWatermark(sourcePath, destinationPath) {
    return new Promise((resolve, reject) => {
        imageMagick(sourcePath).size(function(err, value) {
            if (err) {
                reject(err);
            } else if (value === undefined) {
                reject(err);
            } else {
                let watermarkSize = {
                    width: Math.ceil(value.width * scaleFactor),
                    height: Math.ceil(value.width * scaleFactor / watermarkAspectRatio)
                };
                // Apply watermark
                imageMagick(sourcePath)
                    // WATERMARK - PARAM ORDER: [X Pos, Y Pos, width, height]
                    .fill('rgba(0, 0, 0, 0.5)')
                    .fontSize(150)
                    .stroke("rgba(255, 255, 255, 0.4)", 2)
                    //.fill("#888")
                    .drawText(0, 0, "HappyKidz",'Center')
                    // .drawText(10,10,'HappyKidz','Center')
                    // .fontSize( 1000000000 )
                    // .draw(['-pointsize 200'])
                    //.font( __dirname + '/../fonts/GothamCond-Medium.otf')
                    // RESIZE DIMENSIONS - PARAM ORDER: [width, height]
                    .resize(value.width, value.height, null)
                    .write(destinationPath, function(err, stdout, stderr, command) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(destinationPath);
                        }
                    });
            }
        })
    })

};

var watermarkAPI = {
    scaleFactor: scaleFactor,
    watermarkAspectRatio: watermarkAspectRatio,
    watermarkPath: watermarkPath,
    applyWatermark: applyWatermark,
    addTextWatermark: addTextWatermark
};

module.exports = watermarkAPI;
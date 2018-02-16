var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET create event page. */
router.get('/', function(req, res, next) {
    res.render('file_upload');
});


router.post('/', function (req, res, next) {
    var files = req.files;
    var fields = req.fields;
    if (fields.id.length == 0) 
        fields.id = '1';
    var newdir = path.join(__dirname, '../public/files/',  fields.id);
    if (!fs.existsSync(newdir)){
        fs.mkdirSync(newdir);
    }
    var count=0;
    for (i in files) {
        var newpath = path.join(newdir, count.toString());
        count++;
        fs.rename(files[i].path, newpath, function (err) {
            if (err) throw err;
        });
    }
    res.render('file_upload');
});

module.exports = router;

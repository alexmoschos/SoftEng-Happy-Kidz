var express = require('express');
var router = express.Router();
var db = require('../models/db');


router.get('/', function(req, res, next) {

    db.Parent.findAll()
    .then( (parents) => parents.forEach( (parent) => console.log(parent.name) )
    );

    var promise1 = db.Parent.findAll();
    var promise2 = db.Organizer.findAll();
    var promise3 = db.Event.findAll({
        where: {
            isVerified: false
        }
    });

    var obj;

    Promise.all([promise1,promise2,promise3])
    .then( (values) => {
            obj = { user: values[0], provider: values[1], event: values[2]};
            res.render('admin',obj);
    });

});

module.exports = router;

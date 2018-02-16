var express = require('express');
var router =express.Router();
var auth = require('../apis/authentication');


router.get('/', auth.isUserOrganizer, function(req, res) {
    return res.redirect('/ticket');
});


module.exports = router;
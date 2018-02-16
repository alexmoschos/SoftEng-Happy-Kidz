var express = require('express');
var router =express.Router();


router.get('/', function (req, res) {
    req.logout();
    req.session.destroy();
    
    return res.redirect('/');
});

module.exports = router;
var express = require('express');
var router = express.Router();

router.post('/:id', function(req, res, next) {
	console.log(req.body.delete + " deleted");
	res.redirect('/admin');
});



module.exports = router;


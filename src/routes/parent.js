var express = require('express');
var router = express.Router();
var db = require('../models/db');
var auth = require('../apis/authentication');


/* GET parent profile. */
router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});

router.delete('/:parentId', auth.isUserAdmin,  function(req, res){
	db.Parent.findById(req.params.parentId)
	.then( (parent) => {
		if (parent) {
			return parent.destroy();
		} else {
			res.send('No such parent!' + console.log(req.params.parentId))
		}
	}  )
	.then( (succeed) => res.redirect("/admin") );
})

module.exports = router;

var express = require('express');
var router = express.Router();
var ratings= [
    {name: "John", content:"It sucks", rating:2},
    {name: "John", content:"It sucks", rating:3},
    {name: "John", content:"It sucks", rating:5},
    {name: "John", content:"It sucks", rating:4},
    {name: "John", content:"It sucks", rating:0},
    {name: "John", content:"It sucks", rating:1},
]


router.post("/", function(req, res){
    console.log(req.body);
    // comm = {
    //     name: "zark",
    //     content: "lala",
    //     rating: 5
    // };
    // ratings.push(comm);
    // res.redirect('/events/hello');
});

router.get('/', function(req, res, next) {
    obj={
        title: "Alex Kalom"
    }
    res.render('review',obj);
});

module.exports = router;

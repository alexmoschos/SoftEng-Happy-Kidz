var express = require('express');
var router = express.Router();
var url = require('url');
var elastic = require('../apis/elastic_interface');
router.get('/', function(req, res, next) {
    // TODO: Add image links, AgeGroups, ProviderName and ID, Provider Phone,
    // Maybe delete startingPrice field from ejs.
    // Make sure to render a helpful text when no search results are found.
    filters = {
        free_text : req.query.q,
        price : req.query.endPrice,
        distance : req.query.radius,
        tickets : 1,
        address : req.query.location,
        page : req.query.page
    }


    // checks for valid search request
    var q = "value=" + req.query.q;
    if (req.query.q == null)
        q = "";
    var location = "value=" + req.query.location;
    if (req.query.location == null)
        location = "";
    var ageGroup = "" + req.query.AgeGroup;
    if (req.query.AgeGroup == null)
        ageGroup = "one";

    // var startPrice = "value=" + req.query.startPrice;
    // if (req.query.startPrice == null)
    //     startPrice = "";

    var radius = "value=" + req.query.radius;
    if (req.query.radius == null)
        radius = "";

    var endPrice = "value=" + req.query.endPrice;
    if (req.query.endPrice == null)
        endPrice = "";

    // var startDate = "value=" + req.query.startDate;
    // if (req.query.startDate == null)
    //     startDate = "";

    var endDate = "value=" + req.query.endDate;
    if (req.query.endDate == null)
        endDate = "";

    var startDate = "value=" + req.query.startDate;
    if (req.query.endDate == null)
        endDate = "";
    var page = req.query.page;
    if (req.query.page == null)
        page = 0;



    elastic.search('events',filters, (hits) => {
        obj = [];
        hits.forEach((element) => {
            obj.push ({
                title : element._source.title,
                date : new Date(element._source.startTime * 1000).toLocaleDateString(),
                time : element._source.startTime,
                address : element._source.geoAddress,
                providerName : element._source.providerName,
                startingPrice : 42,
                finalPrice : element._source.ticketPrice,
                phone : element._source.providerPhone,
                agegroups : "5-10",
                images : [
                    "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
                ],
                geolon : element._source.geoLocation.lon,
                geolat : element._source.geoLocation.lat
            });
        });

        info = {
            obj : obj,
            activity : q,
            location : location,
            ageGroup : ageGroup,
            // startPrice : startPrice,
            radius : radius,
            endPrice : endPrice,
            startDate : startDate,
            endDate : endDate,
            page : page,
    
        };
        // console.log(info);
        res.render('search_results', info);

    });
});

module.exports = router;

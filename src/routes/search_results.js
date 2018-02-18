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
    elastic.search('events',filters, (hits) => {
        hits.foreach((element) => {
            var date = new Date(element._source.start_time);
            obj.push ({
                title : element._source.name,
                date : date.toUTCString(),
                time : date.getTime(),
                address : element._source.address,
                providerName : element._source.provider,
                startingPrice : 42,
                finalPrice : element._source.price,
                phone : "69999999",
                agegroups : "5-10",
                images : [
                    "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
                ],
                geolon : element._source.location.lon,
                geolat : element._source.location.lat
            })
        });
    });
    obj = [
        {
          //event_id : 42,
          title : "Alex Kalom",
          date : "14/12/1999",
          time : "14:49",
          address : "Iroon Polutexneiou 1 Athens",
          providerName : "Kostis ",
          startingPrice : "42",
          finalPrice : "24",
          phone : "6982532427086",
          agegroups : "16-21",
          images : [
              "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
          ],
          geolon : 131.044,
          geolat : -25.363
        }
    ];
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
    console.log(ageGroup);
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

module.exports = router;

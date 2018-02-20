const conf = require('../config.js');
const bcrypt = require('bcrypt');
const elastic = require('../apis/elastic_interface');
const faker = require('faker/locale/el');
const faker_en = require('faker');
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function seedDatabase(db) {
    // for each supported category make sure, we have it in the categories table
    conf.supportedCategories.forEach(function (category, idx) {
        db.Categories.findOne({ where: { categoryName: category } }).then(res => {
            if (!res) {
                // this category has to be added.
                db.Categories.create({ categoryName: category }).catch(err => { console.log(err); });
            }
        }).catch(err => { console.log(err); });
    });
    var parentobj = [];
    for(var i = 0; i < 15; ++i){
        parentobj.push(
            {
                name : faker.name.findName(),
                email : faker_en.internet.email(),
                password : bcrypt.hashSync(faker_en.internet.password(),10),
                wallet: 0,
                mailNotifications : false
            }
        );
    }
    var providerobj = [{
        name: 'Βελεγκοιβεντς',
        email: 'velegkevents@velegkas.com',
        password: bcrypt.hashSync('123456', 10),
        description: '',
        phone: '2105874658',
        webpage: 'www.thevelegk.gr',
        avgRating: 4,
        avatar: '',
        isVerified: false,
        documents: ''
    },
    {
        name: 'Κοφι Εντερπραιζις',
        email: 'theman@otenet.gr',
        password: bcrypt.hashSync('123456', 10),
        description: '',
        phone: '2104845145',
        webpage: 'www.theman.gr',
        avgRating: 1,
        avatar: '',
        isVerified: true,
        documents: ''
    }
    ];
    for(var i = 0; i < 10; ++i){
        providerobj.push(
            {
                name: faker.company.companyName(),
                email: faker_en.internet.email(),
                password: bcrypt.hashSync('123456', 10),
                description: faker.lorem.words(),
                phone: faker.phone.phoneNumberFormat(),
                webpage: 'www.theman.gr',
                avgRating: 1,
                avatar: '',
                isVerified: true,
                documents: ''
            }
        );
    }
    eventobj =  [{
        organizerId: 1,
        title: 'Παρτυ στο σπίτι του Βελεγκα χωρις τον Βελεγκα',
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        description: '',
        categoryName: 'Αθλητισμός',
        geoLon: 37.988930,
        geoLat: 23.764727,
        geoAddress: 'Ευρυτανίας 56, 15451, Αθήνα',
        ticketPrice: 15,
        discount: 5,
        ticketCount: 100,
        initialTicketCount: 100,
        minAge: 10,
        maxAge: 18,
        pictures: 0,
        clickNumber: 0,
        isVerified: true
    },
    {
        organizerId: 2,
        title: 'Παρτυ με τον Βελεγκα χωρις τον Βελεγκα',
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000 + 3600),
        description: '',
        categoryName: 'Αθλητισμός',
        geoLon: 37.988930,
        geoLat: 23.764727,
        geoAddress: 'Ευρυτανίας 56, 15451, Αθήνα',
        ticketPrice: 15,
        discount: 5,
        ticketCount: 100,
        initialTicketCount: 100,
        minAge: 10,
        maxAge: 18,
        pictures: 0,
        clickNumber: 0,
        isVerified: false
    }];
    for(var i = 0; i < 20; ++i){
        eventobj.push(
            {
                organizerId: getRandomInt(1,9),
                title: 'Παρτυ με τον ' + faker.name.firstName(),
                startTime: Math.floor(Date.now() / 1000),
                endTime: Math.floor(Date.now() / 1000 + 3600),
                description: faker.lorem.paragraph(),
                categoryName: 'Αθλητισμός',
                geoLon: 37.988930 + Math.random()*10,
                geoLat: 23.764727 + Math.random()*10,
                geoAddress: faker.address.streetAddress("###"),
                ticketPrice: getRandomInt(5,35),
                discount: getRandomInt(5,15),
                ticketCount: getRandomInt(50,150),
                initialTicketCount: getRandomInt(200,500),
                minAge: 10,
                maxAge: 12,
                pictures: 0,
                clickNumber: getRandomInt(100,500),
                isVerified: getRandomInt(0,1) == 0
            }
        );
    }
    reviewobj = [];
    for(var i = 1; i < 20; ++i){
        for(var k = 1; k < 5; ++k){
            reviewobj.push({
                parentId: k,
                eventId: i,
                text: faker.lorem.paragraph(),
                rating: getRandomInt(1,5),
                date: Date.now()
            });
        }
    }
    //console.log(reviewobj);
    db.Parent.bulkCreate(parentobj)
        .then((succ) => db.Organizer.bulkCreate(providerobj))
        .then((succ) => db.Admin.bulkCreate(
            [{
                username: 'admin',
                password: bcrypt.hashSync('admin', 10),
                email: 'admin@admin.com'
            },
            {
                username: 'dev',
                password: bcrypt.hashSync('password', 10),
                email: 'dev@admin.com'
            }
            ]))
        .then((succ) => db.Event.bulkCreate(eventobj))
        .then((succ) => db.Review.bulkCreate(reviewobj))
        .then(() => {
                // add all events from postgres to elastic
                console.log(reviewobj);

                db.Event.findAll().then(hits => {
                    hits.forEach(function (event) {
                        var newEvent = {};

                        newEvent.organizerId = event.organizerId;

                        newEvent.title = event.title;
                        newEvent.startTime = event.startTime;
                        newEvent.endTime = event.endTime; // this field should probably go
                        newEvent.description = event.description;
                        newEvent.categoryName = event.categoryName;
                        newEvent.geoAddress = event.geoAddress;
                        newEvent.ticketPrice = event.ticketPrice;
                        newEvent.ticketCount = event.ticketCount
                        newEvent.initialTicketCount = event.initialTicketCount;
                        newEvent.minAge = event.minAge;
                        newEvent.maxAge = event.maxAge;
                        newEvent.discount = event.discount;
                        newEvent.pictures = event.pictures;
                        newEvent.geoLocation = {
                            lat: event.geoLat,
                            lon: event.geoLon
                        };

                        newEvent.eventId = event.eventId.toString();

                        db.Organizer.findOne({ where: { organizerId: event.organizerId } }).then((provider) => {
                            newEvent.providerName = provider.name;
                            newEvent.providerPhone = provider.phone;

                            elastic.insert('events', newEvent);
                        });
                    });
                });

            })
        .then((succ) => db.Membership.bulkCreate(
            [{
                parentId: 1,
                startDate: Math.floor(Date.now() / 1000),
                expiryDate: Math.floor(Date.now() / 1000 + 36000),
                membershipTier: 1,
                maxTicketsPerEvent: 100
            },
            {
                parentId: 2,
                startDate: Math.floor(Date.now() / 1000),
                expiryDate: Math.floor(Date.now() / 1000 + 36000),
                membershipTier: 1,
                maxTicketsPerEvent: 100
            }]
        ))
        .catch((err) => console.log(err));

}

module.exports = { seedDatabase: seedDatabase };
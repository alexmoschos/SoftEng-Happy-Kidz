const conf = require('../config.js');
const bcrypt = require('bcrypt');

function seedDatabase(db) {
    // for each supported category make sure, we have it in the categories table
    conf.supportedCategories.forEach(function(category, idx) {
        db.Categories.findOne({ where: { categoryName: category } }).then(res => {
            if (!res) {
                // this category has to be added.
                db.Categories.create({ categoryName: category }).catch(err => { console.log(err); });
            }
        }).catch(err => { console.log(err); });
    });

    db.Parent.bulkCreate(
            [{
                    name: 'Παναγόρης Βελένας',
                    email: 'velenas@gmail.com',
                    password: bcrypt.hashSync('123456', 10),
                    wallet: 0,
                    mailNotifications: false
                },
                {
                    name: 'Κυριάκος Μοσχονάς',
                    email: 'moschokyr@gmail.com',
                    password: bcrypt.hashSync('123456', 10),
                    wallet: 0,
                    mailNotifications: false
                }
            ])
        .then((succ) => db.Organizer.bulkCreate(
            [{
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
            ]))
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
        .then((succ) => db.Event.bulkCreate(
            [{
                    organizerId: 1,
                    title: 'Παρτυ στο σπίτι του Βελεγκα χωρις τον Βελεγκα',
                    startTime: Math.floor(Date.now() / 1000),
                    endTime: Math.floor(Date.now() / 1000 + 3600),
                    description: '',
                    categoryName: 'Αθλητισμός',
                    geoLon: '37.988930',
                    geoLat: '23.764727',
                    geoAddress: 'Ευρυτανίας 56, ΤΚ15451, Αθήνα',
                    ticketPrice: 15,
                    discount: 5,
                    ticketCount: 100,
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
                    geoLon: '37.988930',
                    geoLat: '23.764727',
                    geoAddress: 'Ευρυτανίας 56, ΤΚ15451, Αθήνα',
                    ticketPrice: 15,
                    discount: 5,
                    ticketCount: 100,
                    minAge: 10,
                    maxAge: 18,
                    pictures: 0,
                    clickNumber: 0,
                    isVerified: false
                }
            ]))
        .catch((err) => console.log(err));
}

module.exports = { seedDatabase: seedDatabase };
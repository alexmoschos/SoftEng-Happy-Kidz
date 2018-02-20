const express = require('express');
const app = express();
const path = require('path');
const Sequelize = require('sequelize');
const conf = require('../config.js');
const seedDB = require('./seedfaker')

// Database connection config
const sequelize = new Sequelize('devdb', 'dev', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});


// Import Database Models
const Parent = sequelize.import(__dirname + '/parent.js');
const Organizer = sequelize.import(__dirname + '/organizer.js');
const Admin = sequelize.import(__dirname + '/admin.js');
const Event = sequelize.import(__dirname + '/event.js');
// const AvailableTickets = sequelize.import(__dirname + '/available_tickets.js');
const BoughtTickets = sequelize.import(__dirname + '/bought_tickets.js');
const Review = sequelize.import(__dirname + '/review.js');
const Subscription = sequelize.import(__dirname + '/subscription.js');
const Membership = sequelize.import(__dirname + '/membership.js');
const Categories = sequelize.import(__dirname + '/categories.js');


// Associate models with Foreign Keys

// Parent Foreign Key
Parent.hasOne(Membership, { foreignKey: 'parentId', targetKey: 'parentId' });

// Event Foreign Key
Organizer.hasMany(Event, { foreignKey: 'organizerId', sourceKey: 'organizerId' });
Event.belongsTo(Organizer, { foreignKey: 'organizerId', targetKey: 'organizerId' });

Categories.hasMany(Event, { foreignKey: 'categoryName', sourceKey: 'categoryName' });
Event.belongsTo(Categories, { foreignKey: 'categoryName', targetKey: 'categoryName' });

// Bought Tickets Foreign Keys
Event.hasMany(BoughtTickets, { foreignKey: 'eventId', sourceKey: 'eventId' });
BoughtTickets.belongsTo(Event, { foreignKey: 'eventId', targetKey: 'eventId' });

Parent.hasMany(BoughtTickets, { foreignKey: 'parentId', sourceKey: 'parentId' });
BoughtTickets.belongsTo(Parent, { foreignKey: 'parentId', targetKey: 'parentId' });

// Review Foreign Keys
Parent.belongsToMany(Event, { through: Review, foreignKey: 'parentId', otherKey: 'eventId'});
Event.belongsToMany(Parent, { through: Review, foreignKey: 'eventId', otherKey: 'parentId'});

// Suscription Foreign Keys
Parent.belongsToMany(Organizer, { through: Subscription, foreignKey: 'parentId', otherKey: 'organizerId' });
Organizer.belongsToMany(Parent, { through: Subscription, foreignKey: 'organizerId', otherKey: 'parentId' });



// Construct DB Interface (API) object
var db = {
    Sequelize: Sequelize,
    sequelizeConnection: sequelize,
    Parent: Parent,
    Organizer: Organizer,
    Admin: Admin,
    Event: Event,
    Categories: Categories,
    BoughtTickets: BoughtTickets,
    Review: Review,
    Subscription: Subscription,
    Membership: Membership
}

//initialize tables if they don't exist
sequelize.sync({force:true})
.then(() =>seedDB.seedDatabase(db));


module.exports = db;
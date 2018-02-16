const express = require('express');
const app = express();
const path = require('path');
const Sequelize = require('sequelize');

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

// Membership Foreign Key
Membership.hasOne(Parent, { foreignKey: 'parentId', targetKey: 'parentId' });

// Event Foreign Key 
Organizer.hasMany(Event, { foreignKey: 'organizerId', sourceKey: 'organizerId' });
Event.belongsTo(Organizer, { foreignKey: 'organizerId', targetKey: 'organizerId' });

Categories.hasMany(Event, { foreignKey: 'categoryName', sourceKey: 'category' });
Event.hasMany(Categories, { foreignKey: 'categoryName', targetKey: 'category' })

// Bought Tickets Foreign Keys
Event.hasMany(BoughtTickets, { foreignKey: 'eventId', sourceKey: 'eventId' });
BoughtTickets.belongsTo(Event, { foreignKey: 'eventId', targetKey: 'eventId' });

Parent.hasMany(BoughtTickets, { foreignKey: 'parentId', sourceKey: 'parentId' });
BoughtTickets.belongsTo(Parent, { foreignKey: 'parentId', targetKey: 'parentId' });

// Review Foreign Keys
Event.hasMany(Review, { foreignKey: 'eventId', sourceKey: 'eventId' });
Review.belongsTo(Event, { foreignKey: 'eventId', targetKey: 'eventId' });

Parent.hasMany(Review, { foreignKey: 'parentId', sourceKey: 'parentId' });
Review.belongsTo(Parent, { foreignKey: 'parentId', targetKey: 'parentId' });

// Suscription Foreign Keys
Parent.belongsToMany(Organizer, { through: Favorites, foreignKey: 'parentId', otherKey: 'organizerId' });
Organizer.belongsToMany(Parent, { through: Favorites, foreignKey: 'organizerId', otherKey: 'parentId' });

// Construct DB Interface (API) object
var db = {
    Sequelize: Sequelize,
    sequelizeConnection: sequelize,
    Parent: Parent,
    Organizer: Organizer,
    Admin: Admin,
    Event: Event,
    AvailableTickets: AvailableTickets,
    BoughtTickets: BoughtTickets,
    Review: Review,
    Subscription: Subscription,
    Favorites: Favorites
}

module.exports = db;
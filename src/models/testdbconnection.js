var db = require('./db');

// database setup
db.sequelizeConnection.sync()
	// .drop({ force: true })
	.then( () => db.sequelizeConnection.sync({ force: true }) )
    .then( () => db.Event.findAll() )
    .then( (results) => { console.log(results); } );


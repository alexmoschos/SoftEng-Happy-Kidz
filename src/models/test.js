var db = require('./db');

db.Event.findAll({
    include: [{
      model: db.Organizer, 
      required: true
    }],
    where: {organizerId: 1}
  })
  .then( tickets => console.log(tickets))
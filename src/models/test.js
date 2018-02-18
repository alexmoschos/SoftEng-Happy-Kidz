var db = require('./db');

db.BoughtTickets.findAll({
    include: [{
      model: db.Event, 
      required: true
    }],
    where: {parentId: parentIdHere}
  })
  .then( tickets => console.log(tickets))
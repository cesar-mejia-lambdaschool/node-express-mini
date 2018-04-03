const express = require('express');
const CORS = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const db = require('./data/db.js');

const server =  express();

server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());
server.use(CORS());

// server.get('/', function(req, res) {
//   res.json({api: 'Running...'});
// });

server.get('/api/users', (req, res) => {
  db.
  find()
  .then(users => {
    res.json(users);
  })
  .catch(error =>  {
    res.status(500).json({ error: "The users information could not be retrieved." });
  })
})

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db
  .findById(id)
  .then(users => {
    if (users.length === 0) {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    } else {
      res.json(users[0]);
    }
  })
  .catch(error => {
    res.status(500).json({ error: "The user information could not be retrieved." });
  });
});

server.delete('/api/users/:id', (req, res) =>  {
  const { id } = req.params;

  let user;
  
  db
  .findById(id)
  .then(users => {
    user = users[0];
  })
  .catch(erorr =>{
    res.status(404).json({ message: "The user with the specified ID does not exist." })
  })

  db
  .remove(id)
  .then(deletions => {
    if ( deletions === 0  )  {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
    res.status(200).json(user);
    } 
  })
  .catch(error => {
    res.status(500).json({ error: "The user could not be removed" });
  });
})

server.post('/api/users', (req, res) => {
  const user =  req.body;
  
  if (user.name  ===  undefined || user.bio ===  undefined) res.status(400).json({ errorMessage: "Please provide name and bio for the user." })

  db
  .insert(user)
  .then(newID => {
    let newUser;
    db.findById(newID.id).then(users => res.status(201).json(users[0])).catch(error => console.error(error))
  })
  .catch(error => res.status(500).json({ error: "There was an error while saving the user to the database" }));
})



const port = 5000;
server.listen(port, () => console.log('API  Running on port 5000'));

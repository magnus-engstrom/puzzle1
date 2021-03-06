var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
const PORT = process.env.PORT || 5000
var server = http.Server(app);

const { Client } = require('pg');


app.use('/static', express.static(__dirname + '/static'));
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/stats', (request, response) => {
  const { headers } = request;
  const userAgent = headers['user-agent'];
  const levelId = request.query.id;
  if (process.env.ENV == 'prod') {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    client.connect();
    client.query('INSERT INTO statistics(agent, level_id) VALUES($1, $2) RETURNING id', [userAgent, levelId], (err,res)=>{
      if (err) {
          console.log(err);
      } else {
          console.log('row inserted with id: ' + res.rows[0].id);
      }
      client.end();
    });
  }
  response.sendStatus(201);
});
server.listen(PORT, function() {
  console.log('Starting game server on port 5000');
});
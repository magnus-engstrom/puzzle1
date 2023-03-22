var express = require('express');
var http = require('http');
var path = require('path');
const statistics = require('./statistics');
var app = express();
const PORT = process.env.PORT || 4000
var server = http.Server(app);

app.use('/static', express.static(__dirname + '/static'));
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/stats', (request, response) => {
  const { headers } = request;
  const userAgent = headers['user-agent'];
  const levelId = request.query.id;
  const clientId = "id" + Math.random().toString(16).slice(2);
  statistics.store(clientId, userAgent, 'puzzle1', 'level', levelId);
  response.sendStatus(201);
});
server.listen(PORT, function() {
  console.log('Starting game server on port 5000');
});
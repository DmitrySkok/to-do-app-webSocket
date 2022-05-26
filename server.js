const express = require('express');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');

const db = require('./db.js');
let tasks = db.tasks;

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).send('<h1>404 not found...</h1>');
})

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server, {
  allowEIO3: true
});

io.on('connection', (socket) => {

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => { //?
    tasks = tasks.filter(task => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });

  io.to(socket.id).emit('updateData', tasks);
});
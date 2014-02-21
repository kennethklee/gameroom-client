gameroom-client
===============

Client for gameroom API

Requirements
------------

* Socket.io

Usage
-----

```
npm install gameroom-client
```

Use it.

```
var Socket = require('socket.io-client');
var GameRoom = require('gameroom-client');

socket = Socket('http://localhost');

client = new GameRoom(socket);

// Create a room
client.room.create('room-name', function(err, room) {
    // Created...
});


// Join a room
client.room.join('some-room', function(err, room) {
    // Joined...

    // Message within room
    room.say('blah blah blah', function(err) {

    });

    // Leave a room
    room.leave(function(err) {
        // Left...
    });

});


client.player.say('some-user', 'blah blah blah', function(err) {

});

```
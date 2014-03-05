gameroom-client
===============

Client for gameroom API.

[![Build Status](https://travis-ci.org/kennethklee/gameroom-client.png?branch=master)](https://travis-ci.org/kennethklee/gameroom-client)

Requirements
------------

* Socket.io client 0.10.x

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

// Say something within the room, without the room object
client.room.in('room-name').say('hello there');


// Say something to another user
client.player.say('some-user', 'blah blah blah', function(err) {

});

```

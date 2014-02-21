var handleJoin = require('./handlers/join'),
    handleLeave = require('./handlers/leave'),
    handleMessage = require('./handlers/message'),
    Room = require('./room');

module.exports = Client;

function Client(io) {
    if (!(this instanceof Client)) return new Client(io);

    this.io = io;
    this.room = {};
    this.player = {};

    this.room.create = createRoom.bind(this);
    this.room.join = joinRoom.bind(this);

    this.player.say = sayToPlayer.bind(this);

    this.rooms = {};

    this.io.on('joined', handleJoin.bind(this));
    this.io.on('left', handleLeave.bind(this));
    this.io.on('message', handleMessage.bind(this));
};

var createRoom = function(name, cb) {
    var self = this;
    this.io.emit('create', name, function(err) {
        if (err && cb) return cb(err);

        self.rooms[name] = new Room(self.io, name);
    });
};

var joinRoom = function(name, cb) {
    this.io.emit('create', name, cb);
};

var sayToPlayer = function(player, message, cb) {
    this.io.emit('message', {player: player, message: message}, cb);
};
var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    handlers = require('./handlers'),
    Room = require('./room');

module.exports = GameRoom;

function GameRoom(io) {
    if (!(this instanceof GameRoom)) return new GameRoom(io);

    io.on('identity', handlers.identity.bind(this));
    io.on('joined', handlers.joined.bind(this));
    io.on('left', handlers.left.bind(this));
    io.on('message', handlers.message.bind(this));

    this.io = io;
    this.room = {};
    this.room.create = createRoom.bind(this);
    this.room.join = joinRoom.bind(this);
    this.room.in =
    this.player = {};
    this.player.say = sayToPlayer.bind(this);

    this._rooms = {};

    EventEmitter.call(this);
}

util.inherits(GameRoom, EventEmitter);

var createRoom = function(name, cb) {
    var self = this;
    this.io.emit('create', name, function(err) {
        var room;

        if (!err) {
            room = self._rooms[name] = new Room(self.io, name, [self.login]);
        }

        cb.call(self, err, room);
    });
};

var joinRoom = function(name, cb) {
    var self = this;

    this.io.emit('join', name, function(err, players) {
        var room;

        if (!err) {
            room = self._rooms[name] = new Room(self.io, name, players);
        }

        cb.call(self, err, room);
    });
};

var inRoom = function(name) {
    if (this._rooms[name]) {
        return this._rooms[name];
    }
};

var sayToPlayer = function(player, message, cb) {
    this.io.emit('message', {player: player, message: message}, cb);
};
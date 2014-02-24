var handlers = require('./handlers'),
    Room = require('./room');

module.exports = Client;

function Client(io) {
    if (!(this instanceof Client)) return new Client(io);

    io.on('identity', handlers.identity.bind(this));
    io.on('joined', handlers.join.bind(this));
    io.on('left', handlers.left.bind(this));
    io.on('message', handlers.message.bind(this));

    this.io = io;
    this.room = {};
    this.room.create = createRoom.bind(this);
    this.room.join = joinRoom.bind(this);
    this.player = {};
    this.player.say = sayToPlayer.bind(this);

    this.rooms = {};

}

var createRoom = function(name, cb) {
    var self = this;
    this.io.emit('create', name, function(err) {
        var room;

        if (!err) {
            room = self.rooms[name] = new Room(self.io, name, [self.login]);
        }

        cb.call(self, err, room);
    });
};

var joinRoom = function(name, cb) {
    var self = this;

    this.io.emit('join', name, function(err, players) {
        var room;

        if (!err) {
            room = self.rooms[name] = new Room(self.io, name, players);
        }

        cb.call(self, err, room);
    });
};

var sayToPlayer = function(player, message, cb) {
    this.io.emit('message', {player: player, message: message}, cb);
};
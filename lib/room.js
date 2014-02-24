var Room = module.exports = function(io, name, players) {
    this.io = io;
    this.name = name;
    this.players = players || [];
};

Room.prototype.say = function(message, cb) {
    io.emit('message', { room: this.name, message: message }, cb);
};

Room.prototype.leave = function(cb) {
    io.emit('leave', this.name, cb);
};